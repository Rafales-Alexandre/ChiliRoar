// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title RoarPoints
 * @dev Token ERC20 pour récompenser les fans de sport avec des points basés sur leur activité sociale
 * Compatible avec Chiliz Chain et optimisé pour l'extensibilité future (NFTs, DAO, etc.)
 */
contract RoarPoints is ERC20, Ownable, Pausable, ReentrancyGuard {
    using Counters for Counters.Counter;

    // Événements
    event PointsMinted(address indexed to, uint256 amount, string reason);
    event PointsBurned(address indexed from, uint256 amount, string reason);
    event MinterAdded(address indexed minter);
    event MinterRemoved(address indexed minter);
    event Paused(address indexed account);
    event Unpaused(address indexed account);

    // Variables d'état
    Counters.Counter private _activityIdCounter;
    mapping(address => bool) public minters;
    mapping(address => uint256) public lastMintTime;
    mapping(address => uint256) public totalMinted;
    
    // Constantes et limites
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10**18; // 1 milliard de tokens
    uint256 public constant MINT_COOLDOWN = 1 hours;
    uint256 public constant MAX_MINT_PER_TX = 100_000 * 10**18; // 100k tokens max par transaction

    // Modifiers
    modifier onlyMinter() {
        require(minters[msg.sender] || msg.sender == owner(), "RoarPoints: caller is not a minter");
        _;
    }

    modifier mintCooldown(address to) {
        require(
            block.timestamp >= lastMintTime[to] + MINT_COOLDOWN || lastMintTime[to] == 0,
            "RoarPoints: mint cooldown not expired"
        );
        _;
    }

    constructor() ERC20("RoarPoints", "ROAR") Ownable(msg.sender) {
        minters[msg.sender] = true;
        emit MinterAdded(msg.sender);
    }

    /**
     * @dev Mint des points à un utilisateur
     * @param to Adresse du destinataire
     * @param amount Montant à mint
     * @param reason Raison du mint (pour le tracking)
     */
    function mint(
        address to, 
        uint256 amount, 
        string memory reason
    ) external onlyMinter mintCooldown(to) nonReentrant whenNotPaused {
        require(to != address(0), "RoarPoints: cannot mint to zero address");
        require(amount > 0, "RoarPoints: amount must be greater than 0");
        require(amount <= MAX_MINT_PER_TX, "RoarPoints: amount exceeds max per transaction");
        require(totalSupply() + amount <= MAX_SUPPLY, "RoarPoints: would exceed max supply");

        _mint(to, amount);
        lastMintTime[to] = block.timestamp;
        totalMinted[to] += amount;

        emit PointsMinted(to, amount, reason);
    }

    /**
     * @dev Mint en batch pour plusieurs utilisateurs
     * @param recipients Adresses des destinataires
     * @param amounts Montants correspondants
     * @param reasons Raisons correspondantes
     */
    function mintBatch(
        address[] memory recipients,
        uint256[] memory amounts,
        string[] memory reasons
    ) external onlyMinter nonReentrant whenNotPaused {
        require(
            recipients.length == amounts.length && amounts.length == reasons.length,
            "RoarPoints: arrays length mismatch"
        );

        for (uint256 i = 0; i < recipients.length; i++) {
            require(recipients[i] != address(0), "RoarPoints: cannot mint to zero address");
            require(amounts[i] > 0, "RoarPoints: amount must be greater than 0");
            require(amounts[i] <= MAX_MINT_PER_TX, "RoarPoints: amount exceeds max per transaction");
        }

        uint256 totalAmount = 0;
        for (uint256 i = 0; i < amounts.length; i++) {
            totalAmount += amounts[i];
        }
        require(totalSupply() + totalAmount <= MAX_SUPPLY, "RoarPoints: would exceed max supply");

        for (uint256 i = 0; i < recipients.length; i++) {
            _mint(recipients[i], amounts[i]);
            lastMintTime[recipients[i]] = block.timestamp;
            totalMinted[recipients[i]] += amounts[i];
            emit PointsMinted(recipients[i], amounts[i], reasons[i]);
        }
    }

    /**
     * @dev Burn des points d'un utilisateur (pour sanctions, etc.)
     * @param from Adresse de l'utilisateur
     * @param amount Montant à burn
     * @param reason Raison du burn
     */
    function burn(
        address from, 
        uint256 amount, 
        string memory reason
    ) external onlyOwner nonReentrant {
        require(from != address(0), "RoarPoints: cannot burn from zero address");
        require(amount > 0, "RoarPoints: amount must be greater than 0");
        require(balanceOf(from) >= amount, "RoarPoints: insufficient balance");

        _burn(from, amount);
        emit PointsBurned(from, amount, reason);
    }

    /**
     * @dev Ajouter un minter
     * @param minter Adresse du nouveau minter
     */
    function addMinter(address minter) external onlyOwner {
        require(minter != address(0), "RoarPoints: cannot add zero address as minter");
        require(!minters[minter], "RoarPoints: already a minter");
        
        minters[minter] = true;
        emit MinterAdded(minter);
    }

    /**
     * @dev Retirer un minter
     * @param minter Adresse du minter à retirer
     */
    function removeMinter(address minter) external onlyOwner {
        require(minters[minter], "RoarPoints: not a minter");
        require(minter != owner(), "RoarPoints: cannot remove owner as minter");
        
        minters[minter] = false;
        emit MinterRemoved(minter);
    }

    /**
     * @dev Mettre en pause le contrat
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Reprendre le contrat
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @dev Récupérer les statistiques d'un utilisateur
     * @param user Adresse de l'utilisateur
     * @return balance Solde actuel
     * @return totalMinted Total minté pour cet utilisateur
     * @return lastMint Dernier mint
     */
    function getUserStats(address user) external view returns (
        uint256 balance,
        uint256 totalMinted,
        uint256 lastMint
    ) {
        return (
            balanceOf(user),
            totalMinted[user],
            lastMintTime[user]
        );
    }

    /**
     * @dev Vérifier si une adresse peut mint
     * @param user Adresse à vérifier
     * @return canMint Si l'utilisateur peut mint
     * @return timeUntilNextMint Temps restant avant le prochain mint possible
     */
    function canUserMint(address user) external view returns (bool canMint, uint256 timeUntilNextMint) {
        if (lastMintTime[user] == 0) {
            return (true, 0);
        }
        
        uint256 timeSinceLastMint = block.timestamp - lastMintTime[user];
        if (timeSinceLastMint >= MINT_COOLDOWN) {
            return (true, 0);
        } else {
            return (false, MINT_COOLDOWN - timeSinceLastMint);
        }
    }

    // Override de la fonction transfer pour ajouter des vérifications
    function transfer(address to, uint256 amount) public override whenNotPaused returns (bool) {
        return super.transfer(to, amount);
    }

    function transferFrom(address from, address to, uint256 amount) public override whenNotPaused returns (bool) {
        return super.transferFrom(from, to, amount);
    }

    // Fonction d'urgence pour récupérer les tokens envoyés par erreur
    function emergencyWithdraw(address token, address to) external onlyOwner {
        require(token != address(this), "RoarPoints: cannot withdraw own tokens");
        require(to != address(0), "RoarPoints: cannot withdraw to zero address");
        
        uint256 balance = IERC20(token).balanceOf(address(this));
        require(balance > 0, "RoarPoints: no tokens to withdraw");
        
        IERC20(token).transfer(to, balance);
    }
}
