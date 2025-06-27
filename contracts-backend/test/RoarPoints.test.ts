import { expect } from "chai";
import { ethers } from "hardhat";
import { RoarPoints } from "../typechain-types";

describe("RoarPoints", function () {
  let roarPoints: RoarPoints;
  let owner: any;
  let user1: any;
  let user2: any;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();
    
    const RoarPointsFactory = await ethers.getContractFactory("RoarPoints");
    roarPoints = await RoarPointsFactory.deploy();
  });

  describe("Déploiement", function () {
    it("Devrait déployer avec le bon nom et symbole", async function () {
      expect(await roarPoints.name()).to.equal("RoarPoints");
      expect(await roarPoints.symbol()).to.equal("ROAR");
    });

    it("Devrait définir le déployeur comme owner", async function () {
      expect(await roarPoints.owner()).to.equal(owner.address);
    });
  });

  describe("Fonction mint", function () {
    it("Devrait permettre à l'owner de mint des tokens", async function () {
      const mintAmount = ethers.parseEther("100");
      await roarPoints.mint(user1.address, mintAmount, "Test mint");
      
      expect(await roarPoints.balanceOf(user1.address)).to.equal(mintAmount);
    });

    it("Devrait empêcher les non-owners de mint", async function () {
      const mintAmount = ethers.parseEther("100");
      
      await expect(
        roarPoints.connect(user1).mint(user2.address, mintAmount, "Test mint")
      ).to.be.revertedWith("RoarPoints: caller is not a minter");
    });

    it("Devrait permettre de mint plusieurs fois", async function () {
      const mintAmount1 = ethers.parseEther("50");
      const mintAmount2 = ethers.parseEther("75");
      
      await roarPoints.mint(user1.address, mintAmount1, "First mint");
      
      // Attendre que le cooldown expire (1 heure)
      await ethers.provider.send("evm_increaseTime", [3601]);
      await ethers.provider.send("evm_mine", []);
      
      await roarPoints.mint(user1.address, mintAmount2, "Second mint");
      
      expect(await roarPoints.balanceOf(user1.address)).to.equal(
        mintAmount1 + mintAmount2
      );
    });
  });

  describe("Fonctionnalités ERC20", function () {
    it("Devrait permettre le transfert de tokens", async function () {
      const mintAmount = ethers.parseEther("100");
      const transferAmount = ethers.parseEther("30");
      
      await roarPoints.mint(user1.address, mintAmount, "Test mint");
      await roarPoints.connect(user1).transfer(user2.address, transferAmount);
      
      expect(await roarPoints.balanceOf(user1.address)).to.equal(
        mintAmount - transferAmount
      );
      expect(await roarPoints.balanceOf(user2.address)).to.equal(transferAmount);
    });

    it("Devrait permettre l'approbation et le transferFrom", async function () {
      const mintAmount = ethers.parseEther("100");
      const approveAmount = ethers.parseEther("50");
      
      await roarPoints.mint(user1.address, mintAmount, "Test mint");
      await roarPoints.connect(user1).approve(user2.address, approveAmount);
      await roarPoints.connect(user2).transferFrom(user1.address, user2.address, approveAmount);
      
      expect(await roarPoints.balanceOf(user2.address)).to.equal(approveAmount);
    });
  });
}); 