import { expect } from "chai";
import { ethers } from "hardhat";
import { RoarPoints } from "../typechain-types";
import { time } from "@nomicfoundation/hardhat-network-helpers";

describe("RoarPoints - Tests Avancés", function () {
  let roarPoints: RoarPoints;
  let owner: any;
  let minter1: any;
  let minter2: any;
  let user1: any;
  let user2: any;
  let user3: any;

  beforeEach(async function () {
    [owner, minter1, minter2, user1, user2, user3] = await ethers.getSigners();
    
    const RoarPointsFactory = await ethers.getContractFactory("RoarPoints");
    roarPoints = await RoarPointsFactory.deploy();
  });

  describe("Configuration initiale", function () {
    it("Devrait avoir les bonnes constantes", async function () {
      expect(await roarPoints.MAX_SUPPLY()).to.equal(ethers.parseEther("1000000000")); // 1 milliard
      expect(await roarPoints.MINT_COOLDOWN()).to.equal(3600); // 1 heure
      expect(await roarPoints.MAX_MINT_PER_TX()).to.equal(ethers.parseEther("100000")); // 100k
    });

    it("Devrait avoir le bon owner et minter initial", async function () {
      expect(await roarPoints.owner()).to.equal(owner.address);
      expect(await roarPoints.minters(owner.address)).to.be.true;
    });
  });

  describe("Gestion des minters", function () {
    it("Devrait permettre à l'owner d'ajouter un minter", async function () {
      await roarPoints.addMinter(minter1.address);
      expect(await roarPoints.minters(minter1.address)).to.be.true;
    });

    it("Devrait permettre à l'owner de retirer un minter", async function () {
      await roarPoints.addMinter(minter1.address);
      await roarPoints.removeMinter(minter1.address);
      expect(await roarPoints.minters(minter1.address)).to.be.false;
    });

    it("Ne devrait pas permettre de retirer l'owner comme minter", async function () {
      await expect(
        roarPoints.removeMinter(owner.address)
      ).to.be.revertedWith("RoarPoints: cannot remove owner as minter");
    });

    it("Ne devrait pas permettre d'ajouter une adresse zéro comme minter", async function () {
      await expect(
        roarPoints.addMinter(ethers.ZeroAddress)
      ).to.be.revertedWith("RoarPoints: cannot add zero address as minter");
    });
  });

  describe("Fonction mint avec cooldown", function () {
    beforeEach(async function () {
      await roarPoints.addMinter(minter1.address);
    });

    it("Devrait permettre le premier mint sans cooldown", async function () {
      const amount = ethers.parseEther("100");
      await roarPoints.connect(minter1).mint(user1.address, amount, "Test mint");
      
      const stats = await roarPoints.getUserStats(user1.address);
      expect(stats[0]).to.equal(amount); // balance
      expect(stats[1]).to.equal(amount); // totalMinted
      expect(stats[2]).to.be.gt(0); // lastMint
    });

    it("Ne devrait pas permettre un mint pendant le cooldown", async function () {
      const amount = ethers.parseEther("100");
      await roarPoints.connect(minter1).mint(user1.address, amount, "First mint");
      
      await expect(
        roarPoints.connect(minter1).mint(user1.address, amount, "Second mint")
      ).to.be.revertedWith("RoarPoints: mint cooldown not expired");
    });

    it("Devrait permettre un mint après expiration du cooldown", async function () {
      const amount = ethers.parseEther("100");
      await roarPoints.connect(minter1).mint(user1.address, amount, "First mint");
      
      // Avancer le temps de 1 heure + 1 seconde
      await time.increase(3601);
      
      await roarPoints.connect(minter1).mint(user1.address, amount, "Second mint");
      
      const stats = await roarPoints.getUserStats(user1.address);
      expect(stats[0]).to.equal(amount * 2n); // balance
      expect(stats[1]).to.equal(amount * 2n); // totalMinted
    });

    it("Devrait vérifier correctement le cooldown", async function () {
      const amount = ethers.parseEther("100");
      await roarPoints.connect(minter1).mint(user1.address, amount, "First mint");
      
      const [canMint, timeUntilNextMint] = await roarPoints.canUserMint(user1.address);
      expect(canMint).to.be.false;
      expect(timeUntilNextMint).to.be.gt(0);
      
      // Avancer le temps de 1 heure
      await time.increase(3600);
      
      const [canMintAfter, timeUntilNextMintAfter] = await roarPoints.canUserMint(user1.address);
      expect(canMintAfter).to.be.true;
      expect(timeUntilNextMintAfter).to.equal(0);
    });
  });

  describe("Fonction mintBatch", function () {
    beforeEach(async function () {
      await roarPoints.addMinter(minter1.address);
    });

    it("Devrait permettre le mint en batch", async function () {
      const recipients = [user1.address, user2.address, user3.address];
      const amounts = [
        ethers.parseEther("100"),
        ethers.parseEther("200"),
        ethers.parseEther("300")
      ];
      const reasons = ["Reward 1", "Reward 2", "Reward 3"];
      
      await roarPoints.connect(minter1).mintBatch(recipients, amounts, reasons);
      
      expect(await roarPoints.balanceOf(user1.address)).to.equal(amounts[0]);
      expect(await roarPoints.balanceOf(user2.address)).to.equal(amounts[1]);
      expect(await roarPoints.balanceOf(user3.address)).to.equal(amounts[2]);
    });

    it("Ne devrait pas permettre le mint en batch avec des tableaux de tailles différentes", async function () {
      const recipients = [user1.address, user2.address];
      const amounts = [ethers.parseEther("100")];
      const reasons = ["Reward 1"];
      
      await expect(
        roarPoints.connect(minter1).mintBatch(recipients, amounts, reasons)
      ).to.be.revertedWith("RoarPoints: arrays length mismatch");
    });

    it("Ne devrait pas permettre le mint en batch avec des montants invalides", async function () {
      const recipients = [user1.address];
      const amounts = [0];
      const reasons = ["Invalid reward"];
      
      await expect(
        roarPoints.connect(minter1).mintBatch(recipients, amounts, reasons)
      ).to.be.revertedWith("RoarPoints: amount must be greater than 0");
    });
  });

  describe("Limites de mint", function () {
    beforeEach(async function () {
      await roarPoints.addMinter(minter1.address);
    });

    it("Ne devrait pas permettre de dépasser MAX_MINT_PER_TX", async function () {
      const maxAmount = ethers.parseEther("100000"); // 100k
      const tooMuch = maxAmount + ethers.parseEther("1");
      
      await expect(
        roarPoints.connect(minter1).mint(user1.address, tooMuch, "Too much")
      ).to.be.revertedWith("RoarPoints: amount exceeds max per transaction");
    });

    it("Ne devrait pas permettre de dépasser MAX_SUPPLY", async function () {
      const maxSupply = await roarPoints.MAX_SUPPLY();
      const maxMintPerTx = await roarPoints.MAX_MINT_PER_TX();
      
      // Mint par petits lots jusqu'à presque atteindre le max supply
      // Utiliser mintBatch pour éviter le cooldown
      let totalMinted = 0n;
      const batchSize = 10; // 10 adresses par batch
      
      while (totalMinted + (maxMintPerTx * BigInt(batchSize)) < maxSupply) {
        const recipients = [];
        const amounts = [];
        const reasons = [];
        
        for (let i = 0; i < batchSize; i++) {
          recipients.push(ethers.Wallet.createRandom().address);
          amounts.push(maxMintPerTx);
          reasons.push("Batch mint");
        }
        
        await roarPoints.connect(minter1).mintBatch(recipients, amounts, reasons);
        totalMinted += maxMintPerTx * BigInt(batchSize);
      }
      
      // Maintenant essayer de mint ne serait-ce qu'1 token de plus
      await expect(
        roarPoints.connect(minter1).mint(user2.address, ethers.parseEther("1"), "Exceeds supply")
      ).to.be.revertedWith("RoarPoints: would exceed max supply");
    });
  });

  describe("Fonction burn", function () {
    beforeEach(async function () {
      await roarPoints.addMinter(minter1.address);
      await roarPoints.connect(minter1).mint(user1.address, ethers.parseEther("1000"), "Initial mint");
    });

    it("Devrait permettre à l'owner de burn des tokens", async function () {
      const burnAmount = ethers.parseEther("100");
      const initialBalance = await roarPoints.balanceOf(user1.address);
      
      await roarPoints.burn(user1.address, burnAmount, "Sanction");
      
      const finalBalance = await roarPoints.balanceOf(user1.address);
      expect(finalBalance).to.equal(initialBalance - burnAmount);
    });

    it("Ne devrait pas permettre de burn plus que le solde", async function () {
      const tooMuch = ethers.parseEther("2000"); // Plus que le solde de 1000
      
      await expect(
        roarPoints.burn(user1.address, tooMuch, "Too much burn")
      ).to.be.revertedWith("RoarPoints: insufficient balance");
    });

    it("Ne devrait pas permettre aux non-owners de burn", async function () {
      await expect(
        roarPoints.connect(minter1).burn(user1.address, ethers.parseEther("100"), "Unauthorized")
      ).to.be.revertedWithCustomError(roarPoints, "OwnableUnauthorizedAccount");
    });
  });

  describe("Fonctionnalités de pause", function () {
    beforeEach(async function () {
      await roarPoints.addMinter(minter1.address);
    });

    it("Devrait permettre à l'owner de pause et unpause", async function () {
      await roarPoints.pause();
      expect(await roarPoints.paused()).to.be.true;
      
      await roarPoints.unpause();
      expect(await roarPoints.paused()).to.be.false;
    });

    it("Ne devrait pas permettre le mint quand le contrat est en pause", async function () {
      await roarPoints.pause();
      
      await expect(
        roarPoints.connect(minter1).mint(user1.address, ethers.parseEther("100"), "Paused mint")
      ).to.be.revertedWithCustomError(roarPoints, "EnforcedPause");
    });

    it("Ne devrait pas permettre le transfert quand le contrat est en pause", async function () {
      await roarPoints.connect(minter1).mint(user1.address, ethers.parseEther("100"), "Initial mint");
      await roarPoints.pause();
      
      await expect(
        roarPoints.connect(user1).transfer(user2.address, ethers.parseEther("50"))
      ).to.be.revertedWithCustomError(roarPoints, "EnforcedPause");
    });
  });

  describe("Statistiques utilisateur", function () {
    beforeEach(async function () {
      await roarPoints.addMinter(minter1.address);
    });

    it("Devrait retourner les bonnes statistiques", async function () {
      const amount1 = ethers.parseEther("100");
      const amount2 = ethers.parseEther("200");
      
      await roarPoints.connect(minter1).mint(user1.address, amount1, "First mint");
      await time.increase(3601); // Passer le cooldown
      await roarPoints.connect(minter1).mint(user1.address, amount2, "Second mint");
      
      const stats = await roarPoints.getUserStats(user1.address);
      expect(stats[0]).to.equal(amount1 + amount2); // balance
      expect(stats[1]).to.equal(amount1 + amount2); // totalMinted
      expect(stats[2]).to.be.gt(0); // lastMint
    });

    it("Devrait retourner des statistiques vides pour un utilisateur sans activité", async function () {
      const stats = await roarPoints.getUserStats(user1.address);
      expect(stats[0]).to.equal(0); // balance
      expect(stats[1]).to.equal(0); // totalMinted
      expect(stats[2]).to.equal(0); // lastMint
    });
  });

  describe("Fonctionnalités ERC20 avancées", function () {
    beforeEach(async function () {
      await roarPoints.addMinter(minter1.address);
      await roarPoints.connect(minter1).mint(user1.address, ethers.parseEther("1000"), "Initial mint");
    });

    it("Devrait permettre l'approbation et transferFrom", async function () {
      const approveAmount = ethers.parseEther("100");
      await roarPoints.connect(user1).approve(user2.address, approveAmount);
      
      expect(await roarPoints.allowance(user1.address, user2.address)).to.equal(approveAmount);
      
      await roarPoints.connect(user2).transferFrom(user1.address, user3.address, approveAmount);
      
      expect(await roarPoints.balanceOf(user3.address)).to.equal(approveAmount);
      expect(await roarPoints.allowance(user1.address, user2.address)).to.equal(0);
    });

    it("Ne devrait pas permettre transferFrom sans approbation suffisante", async function () {
      await roarPoints.connect(user1).approve(user2.address, ethers.parseEther("50"));
      
      await expect(
        roarPoints.connect(user2).transferFrom(user1.address, user3.address, ethers.parseEther("100"))
      ).to.be.revertedWithCustomError(roarPoints, "ERC20InsufficientAllowance");
    });
  });

  describe("Événements", function () {
    beforeEach(async function () {
      await roarPoints.addMinter(minter1.address);
    });

    it("Devrait émettre l'événement PointsMinted", async function () {
      const amount = ethers.parseEther("100");
      const reason = "Test event";
      
      await expect(roarPoints.connect(minter1).mint(user1.address, amount, reason))
        .to.emit(roarPoints, "PointsMinted")
        .withArgs(user1.address, amount, reason);
    });

    it("Devrait émettre l'événement MinterAdded", async function () {
      // Supprimer le minter1 s'il existe déjà (dans le beforeEach)
      if (await roarPoints.minters(minter1.address)) {
        await roarPoints.removeMinter(minter1.address);
      }
      
      await expect(roarPoints.addMinter(minter1.address))
        .to.emit(roarPoints, "MinterAdded")
        .withArgs(minter1.address);
    });

    it("Devrait émettre l'événement MinterRemoved", async function () {
      // S'assurer que minter1 est un minter
      if (!(await roarPoints.minters(minter1.address))) {
        await roarPoints.addMinter(minter1.address);
      }
      
      await expect(roarPoints.removeMinter(minter1.address))
        .to.emit(roarPoints, "MinterRemoved")
        .withArgs(minter1.address);
    });

    it("Devrait émettre l'événement PointsBurned", async function () {
      await roarPoints.connect(minter1).mint(user1.address, ethers.parseEther("100"), "Initial mint");
      
      const burnAmount = ethers.parseEther("50");
      const reason = "Test burn";
      
      await expect(roarPoints.burn(user1.address, burnAmount, reason))
        .to.emit(roarPoints, "PointsBurned")
        .withArgs(user1.address, burnAmount, reason);
    });
  });

  describe("Sécurité et edge cases", function () {
    beforeEach(async function () {
      await roarPoints.addMinter(minter1.address);
    });

    it("Ne devrait pas permettre de mint vers l'adresse zéro", async function () {
      await expect(
        roarPoints.connect(minter1).mint(ethers.ZeroAddress, ethers.parseEther("100"), "Zero address")
      ).to.be.revertedWith("RoarPoints: cannot mint to zero address");
    });

    it("Ne devrait pas permettre de mint un montant nul", async function () {
      await expect(
        roarPoints.connect(minter1).mint(user1.address, 0, "Zero amount")
      ).to.be.revertedWith("RoarPoints: amount must be greater than 0");
    });

    it("Devrait gérer correctement les grands nombres", async function () {
      const maxMintPerTx = await roarPoints.MAX_MINT_PER_TX();
      await roarPoints.connect(minter1).mint(user1.address, maxMintPerTx, "Large amount");
      
      const stats = await roarPoints.getUserStats(user1.address);
      expect(stats[0]).to.equal(maxMintPerTx);
    });
  });
}); 