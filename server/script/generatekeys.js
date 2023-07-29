const secp256k1 = require("@noble/curves/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");
const fs = require("fs");

const keys = [];

for (let i = 0; i < 5; i++) {
  const privateKey = secp256k1.secp256k1.utils.randomPrivateKey();
  const publicKey = secp256k1.secp256k1.getPublicKey(privateKey);
  const privateKeyHex = toHex(privateKey);
  const publicKeyHex = toHex(publicKey);
  const balance = Math.floor(Math.random() * 91) + 10; // Random number between 10 and 100
  keys.push({ privateKey: privateKeyHex, publicKey: publicKeyHex, balance });
}

const data = `module.exports = ${JSON.stringify(keys)};`;

fs.writeFile("keys.js", data, (err) => {
  if (err) throw err;
  console.log("Keys saved to keys.json");
});
