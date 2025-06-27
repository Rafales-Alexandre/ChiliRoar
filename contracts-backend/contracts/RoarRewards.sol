// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./interfaces/IRoarPoints.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title RoarRewards
 * @dev Contrat d'exemple pour montrer l'extensibilité de RoarPoints
 * Système de récompenses automatiques basé sur des événements
 */
contract RoarRewards is Ownable, Pausable, ReentrancyGuard {
    IRoarPoints public roarPoints;
    
    // Structure pour les types de récompenses
    struct RewardType {
        string name;
        uint256 points;
        bool active;
        uint256 cooldown;
        mapping(address => uint256) lastClaimed;
    }
    
    // Mapping des types de récompenses
    mapping(bytes32 => RewardType) public rewardTypes;
    bytes32[] public rewardTypeIds;
    
    // Événements
    event RewardTypeCreated(bytes32 indexed rewardId, string name, uint256 points);
    event RewardTypeUpdated(bytes32 indexed rewardId, string name, uint256 points, bool active);
    event RewardClaimed(address indexed user, bytes32 indexed rewardId, uint256 points);
    event RoarPointsContractUpdated(address indexed oldContract, address indexed newContract);
    
    // Modifiers
    modifier onlyMinter() {
        require(
            roarPoints.minters(msg.sender) || msg.sender == owner(),
            "RoarRewards: caller is not a minter"
        );
        _;
    }
    
    modifier rewardExists(bytes32 rewardId) {
        require(rewardTypes[rewardId].active, "RoarRewards: reward type does not exist or is inactive");
        _;
    }
    
    modifier cooldownRespected(bytes32 rewardId, address user) {
        uint256 lastClaimed = rewardTypes[rewardId].lastClaimed[user];
        uint256 cooldown = rewardTypes[rewardId].cooldown;
        require(
            block.timestamp >= lastClaimed + cooldown || lastClaimed == 0,
            "RoarRewards: cooldown not expired"
        );
        _;
    }
    
    constructor(address _roarPoints) Ownable(msg.sender) {
        roarPoints = IRoarPoints(_roarPoints);
    }
    
    /**
     * @dev Créer un nouveau type de récompense
     * @param rewardId Identifiant unique de la récompense
     * @param name Nom de la récompense
     * @param points Points à attribuer
     * @param cooldown Cooldown en secondes
     */
    function createRewardType(
        bytes32 rewardId,
        string memory name,
        uint256 points,
        uint256 cooldown
    ) external onlyOwner {
        require(rewardId != bytes32(0), "RoarRewards: invalid reward ID");
        require(points > 0, "RoarRewards: points must be greater than 0");
        require(!rewardTypes[rewardId].active, "RoarRewards: reward type already exists");
        
        RewardType storage newReward = rewardTypes[rewardId];
        newReward.name = name;
        newReward.points = points;
        newReward.active = true;
        newReward.cooldown = cooldown;
        
        rewardTypeIds.push(rewardId);
        
        emit RewardTypeCreated(rewardId, name, points);
    }
    
    /**
     * @dev Mettre à jour un type de récompense
     * @param rewardId Identifiant de la récompense
     * @param name Nouveau nom
     * @param points Nouveaux points
     * @param active Nouveau statut actif
     */
    function updateRewardType(
        bytes32 rewardId,
        string memory name,
        uint256 points,
        bool active
    ) external onlyOwner {
        require(rewardTypes[rewardId].active, "RoarRewards: reward type does not exist");
        
        RewardType storage reward = rewardTypes[rewardId];
        reward.name = name;
        reward.points = points;
        reward.active = active;
        
        emit RewardTypeUpdated(rewardId, name, points, active);
    }
    
    /**
     * @dev Réclamer une récompense
     * @param rewardId Identifiant de la récompense
     */
    function claimReward(bytes32 rewardId) 
        external 
        rewardExists(rewardId) 
        cooldownRespected(rewardId, msg.sender) 
        nonReentrant 
        whenNotPaused 
    {
        RewardType storage reward = rewardTypes[rewardId];
        
        // Mettre à jour le timestamp de dernière réclamation
        reward.lastClaimed[msg.sender] = block.timestamp;
        
        // Mint les points via le contrat RoarPoints
        string memory reason = string(abi.encodePacked("Reward: ", reward.name));
        roarPoints.mint(msg.sender, reward.points, reason);
        
        emit RewardClaimed(msg.sender, rewardId, reward.points);
    }
    
    /**
     * @dev Réclamer plusieurs récompenses en une fois
     * @param rewardIds Tableau des identifiants de récompenses
     */
    function claimMultipleRewards(bytes32[] memory rewardIds) 
        external 
        nonReentrant 
        whenNotPaused 
    {
        require(rewardIds.length > 0, "RoarRewards: no rewards to claim");
        require(rewardIds.length <= 10, "RoarRewards: too many rewards at once");
        
        uint256 totalPoints = 0;
        string[] memory reasons = new string[](rewardIds.length);
        
        for (uint256 i = 0; i < rewardIds.length; i++) {
            bytes32 rewardId = rewardIds[i];
            require(rewardTypes[rewardId].active, "RoarRewards: reward type does not exist or is inactive");
            
            RewardType storage reward = rewardTypes[rewardId];
            
            // Vérifier le cooldown
            uint256 lastClaimed = reward.lastClaimed[msg.sender];
            require(
                block.timestamp >= lastClaimed + reward.cooldown || lastClaimed == 0,
                "RoarRewards: cooldown not expired for one or more rewards"
            );
            
            // Mettre à jour le timestamp
            reward.lastClaimed[msg.sender] = block.timestamp;
            
            totalPoints += reward.points;
            reasons[i] = string(abi.encodePacked("Multi-reward: ", reward.name));
            
            emit RewardClaimed(msg.sender, rewardId, reward.points);
        }
        
        // Mint tous les points en une fois
        roarPoints.mint(msg.sender, totalPoints, "Multiple rewards claimed");
    }
    
    /**
     * @dev Attribuer une récompense à un utilisateur (admin)
     * @param user Adresse de l'utilisateur
     * @param rewardId Identifiant de la récompense
     */
    function awardReward(address user, bytes32 rewardId) 
        external 
        onlyMinter 
        rewardExists(rewardId) 
        nonReentrant 
    {
        RewardType storage reward = rewardTypes[rewardId];
        
        string memory reason = string(abi.encodePacked("Admin award: ", reward.name));
        roarPoints.mint(user, reward.points, reason);
        
        emit RewardClaimed(user, rewardId, reward.points);
    }
    
    /**
     * @dev Mettre à jour le contrat RoarPoints
     * @param newRoarPoints Nouvelle adresse du contrat
     */
    function updateRoarPointsContract(address newRoarPoints) external onlyOwner {
        require(newRoarPoints != address(0), "RoarRewards: invalid contract address");
        require(newRoarPoints != address(roarPoints), "RoarRewards: same contract address");
        
        address oldContract = address(roarPoints);
        roarPoints = IRoarPoints(newRoarPoints);
        
        emit RoarPointsContractUpdated(oldContract, newRoarPoints);
    }
    
    /**
     * @dev Récupérer les informations d'une récompense
     * @param rewardId Identifiant de la récompense
     * @return name Nom de la récompense
     * @return points Points attribués
     * @return active Statut actif
     * @return cooldown Cooldown en secondes
     */
    function getRewardType(bytes32 rewardId) 
        external 
        view 
        returns (string memory name, uint256 points, bool active, uint256 cooldown) 
    {
        RewardType storage reward = rewardTypes[rewardId];
        return (reward.name, reward.points, reward.active, reward.cooldown);
    }
    
    /**
     * @dev Vérifier si un utilisateur peut réclamer une récompense
     * @param user Adresse de l'utilisateur
     * @param rewardId Identifiant de la récompense
     * @return canClaim Si l'utilisateur peut réclamer
     * @return timeUntilNextClaim Temps restant avant la prochaine réclamation
     */
    function canClaimReward(address user, bytes32 rewardId) 
        external 
        view 
        returns (bool canClaim, uint256 timeUntilNextClaim) 
    {
        if (!rewardTypes[rewardId].active) {
            return (false, 0);
        }
        
        RewardType storage reward = rewardTypes[rewardId];
        uint256 lastClaimed = reward.lastClaimed[user];
        
        if (lastClaimed == 0) {
            return (true, 0);
        }
        
        uint256 timeSinceLastClaim = block.timestamp - lastClaimed;
        if (timeSinceLastClaim >= reward.cooldown) {
            return (true, 0);
        } else {
            return (false, reward.cooldown - timeSinceLastClaim);
        }
    }
    
    /**
     * @dev Récupérer tous les types de récompenses
     * @return ids Tableau des identifiants
     */
    function getAllRewardTypes() external view returns (bytes32[] memory) {
        return rewardTypeIds;
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
} 