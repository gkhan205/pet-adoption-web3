const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
describe("PetAdoption", () => {
  async function deployContractFixture() {
    const PETS_COUNT = 5;
    const ADOPTED_PET_IDX = 0;
    const [owner, account2, account3] = await ethers.getSigners();
    const PetAdoption = await ethers.getContractFactory("PetAdoption");
    const contract = await PetAdoption.deploy(PETS_COUNT);

    await contract.connect(account3).adoptPet(ADOPTED_PET_IDX);

    return {
      owner,
      contract,
      account2,
      account3,
      petsAddedCount: PETS_COUNT,
      adoptedPetIdx: ADOPTED_PET_IDX,
    };
  }

  describe("Deployment", () => {
    it("should set the right owner", async () => {
      const { contract, owner } = await loadFixture(deployContractFixture);
      const contractOwner = await contract.owner();

      expect(contractOwner).to.equal(owner.address);
    });

    it("should return the right owner", async () => {
      const { contract, owner } = await loadFixture(deployContractFixture);
      const contractOwner = await contract.getOwner();

      expect(contractOwner).to.equal(owner.address);
    });
  });

  describe("Add Pet", () => {
    it("should revert with the right error in case of other account", async () => {
      const { contract, account2 } = await loadFixture(deployContractFixture);

      await expect(contract.connect(account2).addPet()).to.be.revertedWith(
        "Only owner can add a pet",
      );
    });

    it("should increase pet index", async () => {
      const { contract, petsAddedCount } = await loadFixture(
        deployContractFixture,
      );
      await contract.addPet();

      expect(await contract.petIndex()).to.equal(petsAddedCount + 1);
    });
  });

  describe("Adopt Pet", () => {
    it("should revert with index out of bound", async () => {
      const { contract, petsAddedCount } = await loadFixture(
        deployContractFixture,
      );

      await expect(contract.adoptPet(petsAddedCount)).to.be.revertedWith(
        "Pet index out of bounds!",
      );
      await expect(contract.adoptPet(-1)).to.be.rejectedWith(
        "value out-of-bounds",
      );
    });

    it("should revert with pet is already adopted", async () => {
      const { contract, adoptedPetIdx, account2 } = await loadFixture(
        deployContractFixture,
      );

      await expect(
        contract.connect(account2).adoptPet(adoptedPetIdx),
      ).to.be.revertedWith("Pet already adopted!");
    });

    it("should adopt pet successfully!", async () => {
      const { contract, account2 } = await loadFixture(deployContractFixture);

      const firstPetIdx = 1;
      await expect(contract.connect(account2).adoptPet(firstPetIdx)).not.to.be
        .reverted;

      const secondPetIdx = 2;
      await expect(contract.connect(account2).adoptPet(secondPetIdx)).not.to.be
        .reverted;

      const petOwnerAddress = await contract.petIdxToOwnerAddress(firstPetIdx);
      expect(petOwnerAddress).to.equal(account2.address);

      const zeroAddress = await contract.petIdxToOwnerAddress(100);
      expect(zeroAddress).to.equal(
        "0x0000000000000000000000000000000000000000",
      );

      const petsByOwner = await contract
        .connect(account2)
        .getAllAdoptedPetsByOwner();
      const allAdoptedPets = await contract.getAllAdoptedPets();

      expect(petsByOwner.length).to.equal(2);
      expect(allAdoptedPets.length).to.equal(3);

      expect(
        await contract.ownerAddressToPetList(account2.address, 0),
      ).to.equal(firstPetIdx);
    });
  });
});
