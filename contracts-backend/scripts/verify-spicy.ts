import { run } from "hardhat";

async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS;
  
  if (!contractAddress) {
    throw new Error("❌ Veuillez définir la variable d'environnement CONTRACT_ADDRESS");
  }

  console.log("🔍 Vérification du contrat RoarPoints sur Chiliz Spicy Testnet...");
  console.log("📝 Adresse du contrat:", contractAddress);

  try {
    await run("verify:verify", {
      address: contractAddress,
      contract: "contracts/RoarPoints.sol:RoarPoints",
      constructorArguments: [],
      network: "chiliz_testnet",
    });

    console.log("✅ Contrat vérifié avec succès!");
    console.log("🔗 Voir le contrat: https://testnet.chiliscan.com/address/" + contractAddress);
  } catch (error: any) {
    if (error.message.includes("Already Verified")) {
      console.log("ℹ️  Le contrat est déjà vérifié!");
    } else {
      console.error("❌ Erreur lors de la vérification:", error.message);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Erreur:", error);
    process.exit(1);
  }); 