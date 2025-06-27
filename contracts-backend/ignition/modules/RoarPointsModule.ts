import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { ethers } from "hardhat";

const RoarPointsModule = buildModule("RoarPointsModule", (m) => {
  // Déploiement du contrat RoarPoints
  const roarPoints = m.contract("RoarPoints");

  // Vérifications post-déploiement
  m.call(roarPoints, "name", [], { id: "verifyName" });
  m.call(roarPoints, "symbol", [], { id: "verifySymbol" });
  m.call(roarPoints, "owner", [], { id: "verifyOwner" });
  m.call(roarPoints, "MAX_SUPPLY", [], { id: "verifyMaxSupply" });

  return { roarPoints };
});

export default RoarPointsModule;