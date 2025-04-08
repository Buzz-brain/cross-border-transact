// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;


contract CrossBorderTransaction {
    // Mapping of user profiles to wallet addresses
    mapping(address => UserProfile) public userProfiles;

    // Struct to represent user profiles
    struct UserProfile {
        address walletAddress;
        string username;
        string fullName;
        string withdrawalBankDetails;
        string emailAddress;
        string chosenCurrency;
    }

    // Mapping of currency conversion rates
    mapping(string => mapping(string => uint256)) public conversionRates;

    // Event emitted when a user registers
    event UserRegistered(address indexed walletAddress, string username);

    // Event emitted when a transaction occurs
    event TransactionOccurred(address indexed sender, address indexed recipient, uint256 amount);

    // Event emitted when a conversion occurs
    event ConversionOccurred(address indexed user, string fromCurrency, string toCurrency, uint256 amount, uint256 convertedAmount);

    // Event emitted when a withdrawal occurs
    event WithdrawalOccurred(address indexed user, uint256 amount);
    
    address public admin;

    constructor() {
        admin = msg.sender;
    }

    function registerUser(string memory _username, string memory _fullName, string memory _withdrawalBankDetails, string memory _emailAddress, string memory _chosenCurrency) public {
        // Check if the user is already registered
        require(userProfiles[msg.sender].walletAddress == address(0), "User already registered");

        // Create a new user profile
        userProfiles[msg.sender] = UserProfile(msg.sender, _username, _fullName, _withdrawalBankDetails, _emailAddress, _chosenCurrency);

        // Emit the UserRegistered event
        emit UserRegistered(msg.sender, _username);
    }
    receive() external payable {}

    // Function to get a specific user's profile by address
    function getUserProfile(address _user) public view returns (UserProfile memory) {
        require(userProfiles[_user].walletAddress != address(0), "User not found");
        return userProfiles[_user];
    }

    // Function to get the user's balance
    function getUserBalance() public view returns (uint256) {
        return msg.sender.balance;
    }

    // Convert Currency
    function convertCurrency(string memory fromCurrency, string memory toCurrency, uint256 amount) public view returns (uint256) {
        require(conversionRates[fromCurrency][toCurrency] > 0, "Conversion rate not available");
        
        // Convert using rate scaled up to 1e18
        uint256 convertedAmount = (amount * conversionRates[fromCurrency][toCurrency]) / 1e18;
        return convertedAmount;
    }

    // Function to initiate a transaction
    function initiateTransaction(address _recipient, uint256 _amountInETH) public payable {
        require(userProfiles[_recipient].walletAddress != address(0), "Recipient not registered");
        require(_amountInETH > 0, "Invalid transaction amount");
        require(msg.value >= _amountInETH, "Insufficient funds sent");  // Fix: Convert _amountInETH to Wei

        // Transfer ETH
        (bool sent, ) = payable(_recipient).call{value: msg.value}("");
        require(sent, "Failed to send Ether");

        emit TransactionOccurred(msg.sender, _recipient, _amountInETH);
    }


    // Function to initialize the conversion rates
    function initializeConversionRates() public {
        // USD to ETH conversion (Assume 1 USD = 0.000496 ETH, scaled up)
        conversionRates["USD"]["ETH"] = 496 * 1e18 / 1e6;

        // NGN to ETH conversion (Assume 1 NGN = 0.0000003259 ETH, scaled up)
        conversionRates["NGN"]["ETH"] = 3259 * 1e18 / 1e10;

        // ETH to USD conversion (Assume 1 ETH = 1986.13 USD, scaled up)
        conversionRates["ETH"]["USD"] = 198613 * 1e18 / 1e2;

        // ETH to NGN conversion (Assume 1 ETH = 3043254.56 NGN, scaled up)
        conversionRates["ETH"]["NGN"] = 304325456 * 1e18 / 1e2;
    }

     // New function to withdraw funds
    function withdraw(uint256 amount) public payable {
        require(msg.value >= amount, "Insufficient funds sent");
        require(msg.sender.balance >= amount, "Insufficient balance");
        
        // Transfer the withdrawn amount to the admin's address
        payable(admin).transfer(amount);
        
        emit WithdrawalOccurred(msg.sender, amount);
    }

}
