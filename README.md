 🌍 Cross-Border-Transact Web App (Blockchain-Based Money Transfer)

This is a decentralized cross-border web application that allows users from different countries to send and receive money in their preferred currencies (USD, NGN), using **Ethereum (ETH)** as the base currency. It leverages **blockchain technology** for transparency, immutability, and secure financial transactions.

---

## 🚀 Features

- Send and receive money across borders
- Choose preferred currency (USD or NGN)
- Ethereum used as the base currency
- Wallet integration via MetaMask
- Email receipt on withdrawal (simulated)
- Uses Ganache for local Ethereum blockchain
- Full-stack DApp integration (Solidity + Web3.js + Node.js)

---

## 🛠️ Technologies Used

- **Backend**: Node.js, Express.js, Nodemailer
- **Blockchain**: Ethereum, Solidity, Truffle, Ganache, Web3.js
- **Frontend**: HTML, CSS, JavaScript
- **Wallet**: MetaMask

---

## 📦 Installation & Setup Guide

### 📥 1. Prerequisites

- [Download Node.js](https://nodejs.org/en/download) (Ensure it's added to your system PATH)
- [Download Ganache](https://archive.trufflesuite.com/ganache/)
- [Install MetaMask Chrome Extension](https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn)

---

### 🧱 2. Clone the Repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```
Or download the ZIP file and extract.
---

### ⚙️ 3. Ganache Setup

1. Open Ganache
2. Click **"New Workspace"**
3. (Optional) Rename the workspace
4. Click **"Add Project"**, then locate and select `truffle-config.js` in `smart-contract/`
5. Click **"Save"** and then **"Start"** (top-right)

---

### 📜 4. Compile & Deploy Smart Contracts

Open two terminal windows/tabs:

**Terminal 1**

```bash
cd smart-contract
truffle migrate
```

> Copy the deployed contract address shown in the terminal output.

---

### 🛠️ 5. Configure Backend

1. Open `backend/server.js`
2. Replace the existing contract address with the new one from the previous step:

```javascript
const contractAddress = "0xYourNewContractAddressHere";
```

---

### 🖥️ 6. Run the Backend Server

**Terminal 2**

```bash
cd backend
npm install
npm start
```

> Server will run on `http://localhost:3000`

---

### 🌐 7. View the Web App

Open your browser and navigate to:

```
http://localhost:3000
```

---

## 🦊 8. Connect MetaMask to Ganache

1. Open MetaMask
2. Click network dropdown → **Add Network**
3. Fill in:

| Field            | Value               |
|------------------|---------------------|
| Network Name     | Localhost 8545      |
| RPC URL          | http://127.0.0.1:7545 |
| Chain ID         | 1337                |
| Currency Symbol  | ETH                 |

4. Save and switch to **Localhost 8545**

---

## 👤 9. Create Test Accounts

1. In **Ganache**, click the 🔑 key icon beside any address
2. Copy the **private key**
3. In **MetaMask**, click the profile icon → **Import Account**
4. Select **Private Key**, paste it, and import
5. You’ll now have a test account with 100 ETH

Repeat the process to create additional accounts

---

## 🔗 10. Use the Web App

1. Click **"Connect MetaMask"**
2. Fill out your profile info and **Save**
3. MetaMask will prompt a confirmation → Accept it
4. You’ll see your balance and profile on the app

### 🔄 Send Money

- Create another test account and connect it via MetaMask
- Use the form to transfer ETH between users

### 💸 Withdraw Funds

- Click **"Withdraw Funds"**
- Enter a valid email address
- You’ll receive a simulated withdrawal receipt via email

---

## 📧 Notes

- Withdrawal is simulated using Nodemailer (email receipt only)
- Only use the private key import method with **test accounts**
- Ensure Ganache is running while using the app

---

## 🤝 Contributing

Pull requests are welcome! If you'd like to suggest improvements, please fork the repo and submit a PR.

---

## 🧑‍💻 Author

**Nduoma Chinomso Christian**  
_AKA Buzz Brain_

---

## 📝 License

This project is licensed under the MIT License.
