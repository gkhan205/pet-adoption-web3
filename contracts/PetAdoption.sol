// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;
//import "hardhat/console.sol";

contract PetAdoption {
    address public owner;
    uint public petIndex = 0;
    uint[] public allAdoptedPets;

    mapping(uint => address) public petIdxToOwnerAddress;
    mapping(address => uint[]) public ownerAddressToPetList;

    constructor(uint initialPetIndex) {
        owner = msg.sender;
        petIndex = initialPetIndex;
    }

    function addPet() public {
        require(msg.sender == owner, "Only owner can add a pet");
        petIndex++;
    }

    function adoptPet(uint adoptIdx) public {
        require(adoptIdx < petIndex, "Pet index out of bounds!");
        require(petIdxToOwnerAddress[adoptIdx] == address(0), "Pet already adopted!");

        petIdxToOwnerAddress[adoptIdx] = msg.sender;
        ownerAddressToPetList[msg.sender].push(adoptIdx);
        allAdoptedPets.push(adoptIdx);
    }

    function getOwner() public view returns(address) {
        return owner;
    }

    function getAllAdoptedPetsByOwner() public view returns(uint[] memory) {
        return ownerAddressToPetList[msg.sender];
    }

    function getAllAdoptedPets() public view returns(uint[] memory) {
        return allAdoptedPets;
    }
}
