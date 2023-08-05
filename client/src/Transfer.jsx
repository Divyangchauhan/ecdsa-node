import { useState } from "react";
import server from "./server";
import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { toHex, utf8ToBytes } from "ethereum-cryptography/utils";
import { sha256 } from "ethereum-cryptography/sha256";

BigInt.prototype.toJSON = function () {
  return this.toString();
};

function Transfer({ balance, setBalance, address, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    if (!address) {
      alert("Please set your private key");
      return;
    }

    if (address === recipient) {
      alert("You cannot send to yourself");
      return;
    }
    const data = {
      sender: address,
      amount: parseInt(sendAmount),
      recipient: recipient,
    };

    // sign the transaction
    const hash = sha256(utf8ToBytes(JSON.stringify(data)));
    console.log(toHex(hash));
    const signature = secp256k1.sign(hash, privateKey);

    try {
      const { data } = await server.post(`send`, {
        sender: address,
        amount: parseInt(sendAmount),
        recipient: recipient,
        signature: signature,
      });
      console.log(data["balance"]);
      setBalance(data["balance"]);
      console.log("calling api");
    } catch (ex) {
      console.log(ex);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

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
