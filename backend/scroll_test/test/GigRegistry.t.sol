// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {GigRegistry} from "../src/GigRegistry.sol";

contract GigRegistryTest is Test {
    GigRegistry public registry;
    
    address public buyer = address(0x1);
    address public seller = address(0x2);
    address public bidder2 = address(0x3);
    
    uint256 public constant GIG_BUDGET = 1 ether;
    uint256 public constant BID_AMOUNT = 0.8 ether;
    uint256 public deadline;

    function setUp() public {
        registry = new GigRegistry();
        deadline = block.timestamp + 7 days;
        
        // Fund accounts
        vm.deal(buyer, 10 ether);
        vm.deal(seller, 10 ether);
        vm.deal(bidder2, 10 ether);
    }

    function test_CreateGig() public {
        vm.prank(buyer);
        registry.createGig{value: GIG_BUDGET}(
            "Build a website",
            "Need a simple landing page",
            deadline
        );

        assertEq(registry.gigCount(), 1);
        
        (
            uint256 id,
            address gigBuyer,
            address gigSeller,
            string memory title,
            ,
            uint256 budget,
            ,
            GigRegistry.GigStatus status,
            uint256 bidCount
        ) = registry.getGig(1);

        assertEq(id, 1);
        assertEq(gigBuyer, buyer);
        assertEq(gigSeller, address(0));
        assertEq(budget, GIG_BUDGET);
        assertEq(uint256(status), uint256(GigRegistry.GigStatus.Open));
        assertEq(bidCount, 0);
    }

    function test_SubmitBid() public {
        // Create gig first
        vm.prank(buyer);
        registry.createGig{value: GIG_BUDGET}(
            "Build a website",
            "Need a simple landing page",
            deadline
        );

        // Submit bid
        vm.prank(seller);
        registry.submitBid{value: BID_AMOUNT}(1, "I can do this for 0.8 ETH");

        GigRegistry.Bid[] memory bids = registry.getBids(1);
        assertEq(bids.length, 1);
        assertEq(bids[0].bidder, seller);
        assertEq(bids[0].amount, BID_AMOUNT);
    }

    function test_AcceptBid() public {
        // Create gig
        vm.prank(buyer);
        registry.createGig{value: GIG_BUDGET}(
            "Build a website",
            "Need a simple landing page",
            deadline
        );

        // Submit bid
        vm.prank(seller);
        registry.submitBid{value: BID_AMOUNT}(1, "I can do this");

        // Submit another bid
        vm.prank(bidder2);
        registry.submitBid{value: 0.9 ether}(1, "I can do this for 0.9 ETH");

        uint256 bidder2BalanceBefore = bidder2.balance;

        // Accept first bid
        vm.prank(buyer);
        registry.acceptBid(1, 0);

        (
            ,
            ,
            address gigSeller,
            ,
            ,
            ,
            ,
            GigRegistry.GigStatus status,
        ) = registry.getGig(1);

        assertEq(gigSeller, seller);
        assertEq(uint256(status), uint256(GigRegistry.GigStatus.Assigned));
        
        // Check that bidder2 was refunded
        assertEq(bidder2.balance, bidder2BalanceBefore + 0.9 ether);
    }

    function test_CompleteGig() public {
        // Create gig
        vm.prank(buyer);
        registry.createGig{value: GIG_BUDGET}(
            "Build a website",
            "Need a simple landing page",
            deadline
        );

        // Submit and accept bid
        vm.prank(seller);
        registry.submitBid{value: BID_AMOUNT}(1, "I can do this");

        vm.prank(buyer);
        registry.acceptBid(1, 0);

        // Complete gig
        vm.prank(seller);
        registry.completeGig(1);

        (
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            GigRegistry.GigStatus status,
        ) = registry.getGig(1);

        assertEq(uint256(status), uint256(GigRegistry.GigStatus.Completed));
    }

    function test_ReleasePayment() public {
        // Create gig
        vm.prank(buyer);
        registry.createGig{value: GIG_BUDGET}(
            "Build a website",
            "Need a simple landing page",
            deadline
        );

        // Submit and accept bid
        vm.prank(seller);
        registry.submitBid{value: BID_AMOUNT}(1, "I can do this");

        vm.prank(buyer);
        registry.acceptBid(1, 0);

        // Complete gig
        vm.prank(seller);
        registry.completeGig(1);

        uint256 sellerBalanceBefore = seller.balance;

        // Release payment
        vm.prank(buyer);
        registry.releasePayment(1);

        // Check payment was released
        assertEq(seller.balance, sellerBalanceBefore + GIG_BUDGET);
        
        // Check gig budget is zero
        (
            ,
            ,
            ,
            ,
            ,
            uint256 budget,
            ,
            ,
        ) = registry.getGig(1);
        
        assertEq(budget, 0);
    }

    function test_FullWorkflow() public {
        // Full happy path: create -> bid -> accept -> complete -> pay
        vm.prank(buyer);
        registry.createGig{value: GIG_BUDGET}(
            "Build a website",
            "Need a simple landing page",
            deadline
        );

        vm.prank(seller);
        registry.submitBid{value: BID_AMOUNT}(1, "I can do this");

        vm.prank(buyer);
        registry.acceptBid(1, 0);

        vm.prank(seller);
        registry.completeGig(1);

        uint256 sellerBalanceBefore = seller.balance;
        vm.prank(buyer);
        registry.releasePayment(1);

        assertEq(seller.balance, sellerBalanceBefore + GIG_BUDGET);
        
        (
            ,
            ,
            address gigSeller,
            ,
            ,
            uint256 budget,
            ,
            GigRegistry.GigStatus status,
        ) = registry.getGig(1);

        assertEq(gigSeller, seller);
        assertEq(budget, 0);
        assertEq(uint256(status), uint256(GigRegistry.GigStatus.Completed));
    }

    function test_RevertIf_BuyerBidsOnOwnGig() public {
        vm.prank(buyer);
        registry.createGig{value: GIG_BUDGET}(
            "Build a website",
            "Need a simple landing page",
            deadline
        );

        vm.prank(buyer);
        vm.expectRevert("Buyer cannot bid on own gig");
        registry.submitBid{value: BID_AMOUNT}(1, "My own bid");
    }

    function test_RevertIf_AcceptBidWhenNotBuyer() public {
        vm.prank(buyer);
        registry.createGig{value: GIG_BUDGET}(
            "Build a website",
            "Need a simple landing page",
            deadline
        );

        vm.prank(seller);
        registry.submitBid{value: BID_AMOUNT}(1, "I can do this");

        vm.prank(seller);
        vm.expectRevert("Only buyer");
        registry.acceptBid(1, 0);
    }

    function test_RevertIf_CompleteGigWhenNotSeller() public {
        vm.prank(buyer);
        registry.createGig{value: GIG_BUDGET}(
            "Build a website",
            "Need a simple landing page",
            deadline
        );

        vm.prank(seller);
        registry.submitBid{value: BID_AMOUNT}(1, "I can do this");

        vm.prank(buyer);
        registry.acceptBid(1, 0);

        vm.prank(buyer);
        vm.expectRevert("Only seller");
        registry.completeGig(1);
    }
}

