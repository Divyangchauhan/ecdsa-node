import { useState } from "react";
import server from "./server";
import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { toHex, utf8ToBytes } from "ethereum-cryptography/utils";
import { sha256 } from "ethereum-cryptography/sha256";
// import { ecdsaSign } from "ethereum-cryptography/secp256k1-compat";
// const secp = require("ethereum-cryptography/secp256k1");
// const { keccak256 } = require("ethereum-cryptography/keccak");

function Transfer({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    // sign the transaction
    const data = {
      sender: address,
      amount: parseInt(sendAmount),
      recipient: recipient,
    };

    const msgHash = keccak256(
      utf8ToBytes(recipient + sendAmount + JSON.stringify(nonce))
    );
    const signTxn = await secp.sign(msgHash, privateKey, { recovered: true });

    console.log(JSON.stringify(data));

    const hash = sha256(utf8ToBytes(JSON.stringify(data)));
    console.log(toHex(hash));
    const signature = secp256k1.sign(hash, privateKey);

    const jsonsignature = JSON.stringify({
      r: String(signature.r),
      s: String(signature.s),
    });

    console.log(signature);

    console.log(jsonsignature);

    try {
      const { data } = await server.post(`send`, {
        sender: address,
        amount: parseInt(sendAmount),
        recipient: recipient,
        signature: jsonsignature,
      });
      console.log(data["balance"]);
      console.log("calling api");
    } catch (ex) {
      console.log(ex);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>
      <h2>{privateKey}</h2>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
