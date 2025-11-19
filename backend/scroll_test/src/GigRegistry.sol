// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title GigRegistry
 * @notice Minimal decentralized Upwork MVP - all data stored on-chain temporarily
 * @dev Simple contract for posting gigs, bidding, and payment escrow
 */
contract GigRegistry {
    // ============ Types ============
    
    enum GigStatus {
        Open,
        Assigned,
        Completed
    }

    struct Bid {
        address bidder;
        uint256 amount;
        string message;
        uint256 timestamp;
    }

    struct Gig {
        uint256 id;
        address buyer;
        address seller; // set when bid accepted
        string title;
        string description;
        uint256 budget; // in wei
        uint256 deadline;
        GigStatus status;
        Bid[] bids;
    }

    // ============ State Variables ============
    
    mapping(uint256 => Gig) public gigs;
    uint256 public gigCount;
    
    // Reentrancy guard
    bool private locked;

    // ============ Events ============
    
    event GigCreated(
        uint256 indexed gigId,
        address indexed buyer,
        string title,
        uint256 budget,
        uint256 deadline
    );
    
    event BidSubmitted(
        uint256 indexed gigId,
        address indexed bidder,
        uint256 amount,
        uint256 bidIndex
    );
    
    event BidAccepted(
        uint256 indexed gigId,
        address indexed seller,
        uint256 bidIndex
    );
    
    event GigCompleted(
        uint256 indexed gigId,
        address indexed seller
    );
    
    event PaymentReleased(
        uint256 indexed gigId,
        address indexed seller,
        uint256 amount
    );

    // ============ Modifiers ============
    
    modifier nonReentrant() {
        require(!locked, "ReentrancyGuard: reentrant call");
        locked = true;
        _;
        locked = false;
    }

    modifier onlyBuyer(uint256 _gigId) {
        require(gigs[_gigId].buyer == msg.sender, "Only buyer");
        _;
    }

    modifier onlySeller(uint256 _gigId) {
        require(gigs[_gigId].seller == msg.sender, "Only seller");
        _;
    }

    // ============ Functions ============
    
    /**
     * @notice Create a new gig and escrow the budget
     * @param _title Title of the gig
     * @param _description Description of the gig
     * @param _deadline Deadline timestamp for the gig
     */
    function createGig(
        string memory _title,
        string memory _description,
        uint256 _deadline
    ) external payable {
        require(msg.value > 0, "Budget must be greater than 0");
        require(_deadline > block.timestamp, "Deadline must be in the future");
        require(bytes(_title).length > 0, "Title cannot be empty");

        gigCount++;
        
        Gig storage newGig = gigs[gigCount];
        newGig.id = gigCount;
        newGig.buyer = msg.sender;
        newGig.title = _title;
        newGig.description = _description;
        newGig.budget = msg.value;
        newGig.deadline = _deadline;
        newGig.status = GigStatus.Open;

        emit GigCreated(gigCount, msg.sender, _title, msg.value, _deadline);
    }

    /**
     * @notice Submit a bid on an open gig
     * @param _gigId ID of the gig to bid on
     * @param _message Bid message/description
     */
    function submitBid(
        uint256 _gigId,
        string memory _message
    ) external payable {
        Gig storage gig = gigs[_gigId];
        
        require(gig.id != 0, "Gig does not exist");
        require(gig.status == GigStatus.Open, "Gig is not open");
        require(gig.buyer != msg.sender, "Buyer cannot bid on own gig");
        require(msg.value > 0, "Bid amount must be greater than 0");
        require(block.timestamp <= gig.deadline, "Gig deadline passed");

        Bid memory newBid = Bid({
            bidder: msg.sender,
            amount: msg.value,
            message: _message,
            timestamp: block.timestamp
        });

        gig.bids.push(newBid);
        uint256 bidIndex = gig.bids.length - 1;

        emit BidSubmitted(_gigId, msg.sender, msg.value, bidIndex);
    }

    /**
     * @notice Accept a bid on a gig
     * @param _gigId ID of the gig
     * @param _bidIndex Index of the bid to accept
     */
    function acceptBid(
        uint256 _gigId,
        uint256 _bidIndex
    ) external onlyBuyer(_gigId) {
        Gig storage gig = gigs[_gigId];
        
        require(gig.status == GigStatus.Open, "Gig is not open");
        require(_bidIndex < gig.bids.length, "Invalid bid index");
        
        Bid memory acceptedBid = gig.bids[_bidIndex];
        require(acceptedBid.bidder != address(0), "Bid does not exist");

        gig.seller = acceptedBid.bidder;
        gig.status = GigStatus.Assigned;

        // Refund other bidders
        for (uint256 i = 0; i < gig.bids.length; i++) {
            if (i != _bidIndex && gig.bids[i].bidder != address(0)) {
                payable(gig.bids[i].bidder).transfer(gig.bids[i].amount);
            }
        }

        emit BidAccepted(_gigId, acceptedBid.bidder, _bidIndex);
    }

    /**
     * @notice Mark a gig as completed (seller calls this)
     * @param _gigId ID of the gig
     */
    function completeGig(uint256 _gigId) external onlySeller(_gigId) {
        Gig storage gig = gigs[_gigId];
        
        require(gig.status == GigStatus.Assigned, "Gig must be assigned");
        
        gig.status = GigStatus.Completed;

        emit GigCompleted(_gigId, msg.sender);
    }

    /**
     * @notice Release payment to seller (buyer calls this after completion)
     * @param _gigId ID of the gig
     */
    function releasePayment(uint256 _gigId) external onlyBuyer(_gigId) nonReentrant {
        Gig storage gig = gigs[_gigId];
        
        require(gig.status == GigStatus.Completed, "Gig must be completed");
        require(gig.seller != address(0), "No seller assigned");
        require(address(this).balance >= gig.budget, "Insufficient contract balance");

        uint256 paymentAmount = gig.budget;
        gig.budget = 0; // Prevent double payment
        
        (bool success, ) = payable(gig.seller).call{value: paymentAmount}("");
        require(success, "Payment transfer failed");

        emit PaymentReleased(_gigId, gig.seller, paymentAmount);
    }

    // ============ View Functions ============
    
    /**
     * @notice Get gig details
     * @param _gigId ID of the gig
     * @return id Gig ID
     * @return buyer Buyer address
     * @return seller Seller address
     * @return title Gig title
     * @return description Gig description
     * @return budget Gig budget in wei
     * @return deadline Deadline timestamp
     * @return status Gig status
     * @return bidCount Number of bids
     */
    function getGig(uint256 _gigId) external view returns (
        uint256 id,
        address buyer,
        address seller,
        string memory title,
        string memory description,
        uint256 budget,
        uint256 deadline,
        GigStatus status,
        uint256 bidCount
    ) {
        Gig storage gig = gigs[_gigId];
        require(gig.id != 0, "Gig does not exist");
        
        return (
            gig.id,
            gig.buyer,
            gig.seller,
            gig.title,
            gig.description,
            gig.budget,
            gig.deadline,
            gig.status,
            gig.bids.length
        );
    }

    /**
     * @notice Get all bids for a gig
     * @param _gigId ID of the gig
     * @return Array of Bid structs
     */
    function getBids(uint256 _gigId) external view returns (Bid[] memory) {
        Gig storage gig = gigs[_gigId];
        require(gig.id != 0, "Gig does not exist");
        
        return gig.bids;
    }

    /**
     * @notice Get a specific bid
     * @param _gigId ID of the gig
     * @param _bidIndex Index of the bid
     * @return Bid struct
     */
    function getBid(uint256 _gigId, uint256 _bidIndex) external view returns (Bid memory) {
        Gig storage gig = gigs[_gigId];
        require(gig.id != 0, "Gig does not exist");
        require(_bidIndex < gig.bids.length, "Invalid bid index");
        
        return gig.bids[_bidIndex];
    }

    /**
     * @notice Get total number of gigs
     * @return Total gig count
     */
    function getGigCount() external view returns (uint256) {
        return gigCount;
    }
}

