const express = require("express");
const { Web3, HttpProvider } = require("web3");
const nodemailer = require("nodemailer");
const abi =
  require("../smart-contract/build/contracts/CrossBorderTransaction.json").abi;
const path = require("path");

const app = express();

// Set up Web3 provider using MetaMask
const provider = new HttpProvider("http://localhost:7545");
const web3 = new Web3(provider);

const contractAddress = "0xE8Acd5c60ACd41C361C86184EE9F3fCc551f2e22";
const contractInstance = new web3.eth.Contract(abi, contractAddress);

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dashboard.html"));
});

app.post("/register-user", async (req, res) => {
  const {
    username,
    fullName,
    withdrawalBankDetails,
    emailAddress,
    currency,
    walletAddress,
  } = req.body;
  try {
    const gasPrice = await web3.eth.getGasPrice();
    const txCount = await web3.eth.getTransactionCount(walletAddress);
    const gas = 5000000;

    const tx = {
      from: walletAddress,
      to: contractAddress,
      nonce: txCount.toString(16),
      gasPrice: gasPrice.toString(16),
      gas: gas.toString(16),
      data: contractInstance.methods
        .registerUser(
          username,
          fullName,
          withdrawalBankDetails,
          emailAddress,
          currency
        )
        .encodeABI(),
    };
    res.json({ tx });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error registering user" });
  }
});

app.get("/user-balance/:address", async (req, res) => {
  try {
    const address = req.params.address;
    const balance = await contractInstance.methods
      .getUserBalance()
      .call({ from: address });
    const ethBalance = web3.utils.fromWei(balance, "ether").toString();
    res.json({ ethBalance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error getting user balance" });
  }
});

app.get("/user-profile", async (req, res) => {
  try {
    const address = req.query.walletAddress;
    const userProfile = await contractInstance.methods
      .getUserProfile(address)
      .call();
    res.json(userProfile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error getting user profile" });
  }
});

app.post("/convert-currency", async (req, res) => {
  try {
    const { fromCurrency, toCurrency, amount, address } = req.body;
    await contractInstance.methods
      .initializeConversionRates()
      .send({ from: address, gas: 5000000 });
    const convertedAmount = await contractInstance.methods
      .convertCurrency(
        fromCurrency,
        toCurrency,
        web3.utils.toWei(amount, "ether")
      )
      .call();
    const convertedAmountValue = web3.utils.fromWei(
      convertedAmount.toString(),
      "ether"
    );
    res.json({ convertedAmountValue });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error converting currency" });
  }
});

app.post("/initiate-transaction", async (req, res) => {
  const { recipient, amountInETH, amount, walletAddress } = req.body;
  try {
    const gasPrice = await web3.eth.getGasPrice();
    const txCount = await web3.eth.getTransactionCount(walletAddress);
    const gas = 5000000;
    const tx = {
      from: walletAddress,
      to: contractAddress,
      nonce: txCount.toString(16),
      gasPrice: gasPrice.toString(16),
      gas: gas.toString(16),
      value: amountInETH.toString(16), // Add this line
      data: contractInstance.methods
        .initiateTransaction(recipient, web3.utils.toWei(amount, "ether"))
        .encodeABI(),
    };
    res.json({ tx });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error initiating transaction" });
  }
});

app.post("/withdraw-funds", async (req, res) => {
  const { amount, amountPlain, walletAddress } = req.body;
  try {
    const gasPrice = await web3.eth.getGasPrice();
    const txCount = await web3.eth.getTransactionCount(walletAddress);
    const gas = 5000000;
    const tx = {
      from: walletAddress,
      to: contractAddress,
      nonce: txCount.toString(16),
      gasPrice: gasPrice.toString(16),
      gas: gas.toString(16),
      value: amount.toString(16), // Add this line
      data: contractInstance.methods
        .withdraw(web3.utils.toWei(amountPlain, "ether"))
        .encodeABI(),
    };
    res.json({ tx });
    try {
      // Send email
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: "chinomsochristian03@gmail.com",
          pass: "lvju arpk rscp uiai",
        },
      });

      const mailOptions = {
        to: "chinomsochristian03@gmail.com",
        from: "chinomsochristian03@gmail.com",
        subject: "Cross Border App💸💰 - Withdrawal to Bank Successful",
        text: `You have Successful withdrawn ${amountPlain} ETH from the cross border app into your bank account🤩 \nFeel free to make transaction with out cross-border app and be rest assured your money is safe👌 \n \n \nPlease rate us.😁`,
      };

      await transporter.sendMail(mailOptions);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error withdrawing funds" });
  }
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
