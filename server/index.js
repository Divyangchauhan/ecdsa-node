const express = require("express");
const app = express();
const cors = require("cors");
const balances2 = require("./keys");
const port = 3042;
const secp256k1 = require("@noble/curves/secp256k1");
const { toHex, utf8ToBytes } = require("ethereum-cryptography/utils");
const { sha256 } = require("ethereum-cryptography/sha256");

console.log(balances2);

app.use(cors());
app.use(express.json());

// const balances = {
//   "0x1": 100,
//   "0x2": 50,
//   "0x3": 75,
// };

app.get("/balance/:address", (req, res) => {
  console.log("gettign balance");
  const { address } = req.params;
  const balance =
    balances2.find((wallet) => wallet.publicKey === address).balance || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  console.log("received transaction");
  console.log(req.body);
  const { sender, recipient, amount, signature } = req.body;

  const verification = secp256k1.secp256k1.verify(
    JSON.parse(signature),
    sha256(
      utf8ToBytes(
        JSON.stringify({
          sender: sender,
          amount: parseInt(amount),
          recipient: recipient,
        })
      )
    ),
    sender
  );

  console.log(verification);

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (
    balances2.find((wallet) => wallet.publicKey === sender).balance < amount
  ) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances2.find((wallet) => wallet.publicKey === sender).balance -= amount;
    balances2.find((wallet) => wallet.publicKey === recipient).balance +=
      amount;
    res.send({
      balance: balances2.find((wallet) => wallet.publicKey === sender).balance,
    });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances2.find((wallet) => wallet.publicKey === address)) {
    balances2.push({ publicKey: address, balance: 0 });
  }
}
