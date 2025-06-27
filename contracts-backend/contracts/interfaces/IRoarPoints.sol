// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IRoarPoints
 * @dev Interface pour le contrat RoarPoints
 * Permet l'extensibilité et l'intégration avec d'autres contrats
 */
interface IRoarPoints {
    // Événements
    event PointsMinted(address indexed to, uint256 amount, string reason);
    event PointsBurned(address indexed from, uint256 amount, string reason);
    event MinterAdded(address indexed minter);
    event MinterRemoved(address indexed minter);

    // Fonctions de mint
    function mint(address to, uint256 amount, string memory reason) external;
    function mintBatch(
        address[] memory recipients,
        uint256[] memory amounts,
        string[] memory reasons
    ) external;

    // Fonctions de gestion
    function burn(address from, uint256 amount, string memory reason) external;
    function addMinter(address minter) external;
    function removeMinter(address minter) external;
    function pause() external;
    function unpause() external;

    // Fonctions de consultation
    function getUserStats(address user) external view returns (
        uint256 balance,
        uint256 totalMinted,
        uint256 lastMint
    );
    function canUserMint(address user) external view returns (bool canMint, uint256 timeUntilNextMint);
    function minters(address minter) external view returns (bool);
    function lastMintTime(address user) external view returns (uint256);
    function totalMinted(address user) external view returns (uint256);

    // Constantes
    function MAX_SUPPLY() external view returns (uint256);
    function MINT_COOLDOWN() external view returns (uint256);
    function MAX_MINT_PER_TX() external view returns (uint256);

    // Fonctions ERC20 standard
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);

    // Fonctions d'accessibilité
    function owner() external view returns (address);
    function name() external view returns (string memory);
    function symbol() external view returns (string memory);
    function decimals() external view returns (uint8);
} 