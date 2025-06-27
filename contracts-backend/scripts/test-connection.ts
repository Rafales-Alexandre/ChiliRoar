import { ethers } from "hardhat";

async function main() {
  console.log("🔍 Test de connexion au réseau Chiliz Spicy...");
  
  try {
    const network = await ethers.provider.getNetwork();
    console.log("✅ Connexion réussie!");
    console.log("🌐 Réseau:", network.name);
    console.log("🔗 Chain ID:", network.chainId);
    
    const blockNumber = await ethers.provider.getBlockNumber();
    console.log("📦 Block actuel:", blockNumber);
    
    const gasPrice = await ethers.provider.getFeeData();
    console.log("⛽ Gas Price:", ethers.formatUnits(gasPrice.gasPrice || 0, "gwei"), "gwei");
    
  } catch (error) {
    console.error("❌ Erreur de connexion:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Erreur:", error);
    process.exit(1);
  }); 