import { ethers } from "hardhat";
import { RoarPoints } from "../typechain-types";

async function main() {
  console.log("🚀 Déploiement de RoarPoints sur Chiliz Chain...");

  // Récupération du signer
  const [deployer] = await ethers.getSigners();
  console.log("📝 Déployeur:", deployer.address);
  console.log("💰 Balance:", ethers.formatEther(await deployer.provider!.getBalance(deployer.address)), "CHZ");

  // Déploiement du contrat
  const RoarPointsFactory = await ethers.getContractFactory("RoarPoints");
  const roarPoints = await RoarPointsFactory.deploy();
  
  await roarPoints.waitForDeployment();
  const contractAddress = await roarPoints.getAddress();
  
  console.log("✅ RoarPoints déployé à l'adresse:", contractAddress);

  // Vérifications post-déploiement
  console.log("\n🔍 Vérifications post-déploiement:");
  
  const name = await roarPoints.name();
  const symbol = await roarPoints.symbol();
  const owner = await roarPoints.owner();
  const maxSupply = await roarPoints.MAX_SUPPLY();
  const totalSupply = await roarPoints.totalSupply();

  console.log("📛 Nom:", name);
  console.log("🏷️  Symbole:", symbol);
  console.log("👑 Owner:", owner);
  console.log("📊 Supply max:", ethers.formatEther(maxSupply), "ROAR");
  console.log("📈 Supply actuel:", ethers.formatEther(totalSupply), "ROAR");

  // Test de mint
  console.log("\n🧪 Test de mint...");
  const testAmount = ethers.parseEther("1000");
  const testReason = "Test initial deployment";
  
  const mintTx = await roarPoints.mint(deployer.address, testAmount, testReason);
  await mintTx.wait();
  
  const newBalance = await roarPoints.balanceOf(deployer.address);
  console.log("✅ Mint réussi! Nouveau solde:", ethers.formatEther(newBalance), "ROAR");

  // Informations pour la configuration frontend
  console.log("\n🎯 Informations pour le frontend:");
  console.log("Contract Address:", contractAddress);
  console.log("Network:", await deployer.provider!.getNetwork());
  console.log("Block Explorer:", "https://testnet.chiliscan.com/address/" + contractAddress);

  console.log("\n🎉 Déploiement terminé avec succès!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Erreur lors du déploiement:", error);
    process.exit(1);
  }); 