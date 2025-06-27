import { ethers } from "hardhat";
import { RoarPoints } from "../typechain-types";

async function main() {
  console.log("🌶️  Déploiement de RoarPoints sur Chiliz Spicy Testnet...");

  // Vérification de la configuration
  const network = await ethers.provider.getNetwork();
  console.log("🌐 Réseau:", network.name, "(Chain ID:", network.chainId, ")");
  
  if (network.chainId !== 88882n) {
    throw new Error("❌ Ce script doit être exécuté sur le testnet Chiliz Spicy (Chain ID: 88882)");
  }

  // Récupération du signer
  const [deployer] = await ethers.getSigners();
  console.log("📝 Déployeur:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Balance:", ethers.formatEther(balance), "CHZ");

  // Vérification du solde minimum
  const minBalance = ethers.parseEther("0.1"); // 0.1 CHZ minimum
  if (balance < minBalance) {
    throw new Error(`❌ Solde insuffisant. Minimum requis: 0.1 CHZ, actuel: ${ethers.formatEther(balance)} CHZ`);
  }

  // Déploiement du contrat RoarPoints
  console.log("\n🚀 Déploiement du contrat RoarPoints...");
  const RoarPointsFactory = await ethers.getContractFactory("RoarPoints");
  const roarPoints = await RoarPointsFactory.deploy();
  
  console.log("⏳ Attente de la confirmation du déploiement...");
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
  const isOwnerMinter = await roarPoints.minters(owner);

  console.log("📛 Nom:", name);
  console.log("🏷️  Symbole:", symbol);
  console.log("👑 Owner:", owner);
  console.log("🔧 Owner est minter:", isOwnerMinter);
  console.log("📊 Supply max:", ethers.formatEther(maxSupply), "ROAR");
  console.log("📈 Supply actuel:", ethers.formatEther(totalSupply), "ROAR");

  // Test de mint initial
  console.log("\n🧪 Test de mint initial...");
  const testAmount = ethers.parseEther("1000");
  const testReason = "Test initial deployment";
  
  const mintTx = await roarPoints.mint(deployer.address, testAmount, testReason);
  console.log("⏳ Attente de la confirmation du mint...");
  await mintTx.wait();
  
  const newBalance = await roarPoints.balanceOf(deployer.address);
  const userStats = await roarPoints.getUserStats(deployer.address);
  
  console.log("✅ Mint réussi!");
  console.log("💰 Nouveau solde:", ethers.formatEther(newBalance), "ROAR");
  console.log("📊 Total minté pour le déployeur:", ethers.formatEther(userStats[1]), "ROAR");

  // Test de pause/unpause
  console.log("\n⏸️  Test de pause/unpause...");
  await roarPoints.pause();
  console.log("✅ Contrat mis en pause");
  
  await roarPoints.unpause();
  console.log("✅ Contrat repris");

  // Informations pour la configuration frontend
  console.log("\n🎯 Informations pour le frontend:");
  console.log("Contract Address:", contractAddress);
  console.log("Network Name: Chiliz Spicy Testnet");
  console.log("Chain ID:", network.chainId);
  console.log("RPC URL: https://testnet-rpc.chiliz.com");
  console.log("Block Explorer: https://testnet.chiliscan.com/address/" + contractAddress);
  console.log("Currency: CHZ");

  // Informations pour la vérification
  console.log("\n🔍 Informations pour la vérification:");
  console.log("Contract Name: RoarPoints");
  console.log("Constructor Arguments: []");
  console.log("Compiler Version: 0.8.28");
  console.log("Optimization: Enabled (200 runs)");

  console.log("\n🎉 Déploiement terminé avec succès sur Chiliz Spicy Testnet!");
  console.log("🔗 Voir le contrat: https://testnet.chiliscan.com/address/" + contractAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Erreur lors du déploiement:", error);
    process.exit(1);
  }); 