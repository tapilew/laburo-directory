// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {GigRegistry} from "../src/GigRegistry.sol";

/**
 * @title Deploy
 * @notice Deployment script for GigRegistry to Scroll Sepolia testnet
 */
contract Deploy is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);

        GigRegistry registry = new GigRegistry();

        vm.stopBroadcast();

        console.log("GigRegistry deployed to:", address(registry));
        console.log("Deployer address:", vm.addr(deployerPrivateKey));
        console.log("Chain ID:", block.chainid);
    }
}

