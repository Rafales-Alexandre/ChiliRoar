import { ethers } from "hardhat";
import { RoarPoints } from "../typechain-types";

// Adresse du contrat déployé (à remplacer après déploiement)
const CONTRACT_ADDRESS = "0x..."; // Remplacez par l'adresse réelle

async function main() {
  console.log("🔗 Connexion au contrat RoarPoints...");

  // Connexion au contrat
  const roarPoints = await ethers.getContractAt("RoarPoints", CONTRACT_ADDRESS) as RoarPoints;
  const [signer] = await ethers.getSigners();

  console.log("📝 Signer:", signer.address);
  console.log("🏗️  Contrat:", await roarPoints.getAddress());

  // Récupération des informations du contrat
  console.log("\n📊 Informations du contrat:");
  console.log("Nom:", await roarPoints.name());
  console.log("Symbole:", await roarPoints.symbol());
  console.log("Owner:", await roarPoints.owner());
  console.log("Supply max:", ethers.formatEther(await roarPoints.MAX_SUPPLY()), "ROAR");
  console.log("Supply actuel:", ethers.formatEther(await roarPoints.totalSupply()), "ROAR");

  // Vérification du statut de minter
  const isMinter = await roarPoints.minters(signer.address);
  console.log("🔑 Est minter:", isMinter);

  if (isMinter) {
    // Test de mint simple
    console.log("\n🧪 Test de mint simple...");
    const mintAmount = ethers.parseEther("100");
    const reason = "Test interaction script";
    
    try {
      const tx = await roarPoints.mint(signer.address, mintAmount, reason);
      await tx.wait();
      console.log("✅ Mint réussi!");
      
      const balance = await roarPoints.balanceOf(signer.address);
      console.log("💰 Nouveau solde:", ethers.formatEther(balance), "ROAR");
    } catch (error) {
      console.log("❌ Erreur lors du mint:", error);
    }

    // Test de mint en batch
    console.log("\n🧪 Test de mint en batch...");
    const recipients = [signer.address, "0x1234567890123456789012345678901234567890"];
    const amounts = [ethers.parseEther("50"), ethers.parseEther("25")];
    const reasons = ["Batch test 1", "Batch test 2"];
    
    try {
      const tx = await roarPoints.mintBatch(recipients, amounts, reasons);
      await tx.wait();
      console.log("✅ Mint batch réussi!");
    } catch (error) {
      console.log("❌ Erreur lors du mint batch:", error);
    }
  }

  // Récupération des statistiques utilisateur
  console.log("\n📈 Statistiques utilisateur:");
  const stats = await roarPoints.getUserStats(signer.address);
  console.log("Solde:", ethers.formatEther(stats[0]), "ROAR");
  console.log("Total minté:", ethers.formatEther(stats[1]), "ROAR");
  console.log("Dernier mint:", new Date(Number(stats[2]) * 1000).toLocaleString());

  // Vérification du cooldown
  const cooldown = await roarPoints.canUserMint(signer.address);
  console.log("Peut mint:", cooldown[0]);
  if (!cooldown[0]) {
    console.log("Temps restant:", cooldown[1], "secondes");
  }

  // Test de transfert
  console.log("\n🔄 Test de transfert...");
  const transferAmount = ethers.parseEther("10");
  const recipient = "0x1234567890123456789012345678901234567890";
  
  try {
    const tx = await roarPoints.transfer(recipient, transferAmount);
    await tx.wait();
    console.log("✅ Transfert réussi!");
  } catch (error) {
    console.log("❌ Erreur lors du transfert:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Erreur:", error);
    process.exit(1);
  }); 