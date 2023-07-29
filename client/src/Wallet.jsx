import server from "./server";
// import { secp256k1 } from "@noble/curves/secp256k1";
import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { toHex } from "ethereum-cryptography/utils";

function Wallet({
  privateKey,
  setPrivateKey,
  address,
  setAddress,
  balance,
  setBalance,
}) {
  async function onChange(evt) {
    setPrivateKey(evt.target.value);
    try {
      const address = toHex(secp256k1.getPublicKey(evt.target.value));
      //  evt.target.value;
      // setPrivateKey(evt.target.value);
      setAddress(address);
    } catch (err) {
      console.log(err);
    }
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Wallet Private Key
        <input
          placeholder="Type an address, for example: 0x1"
          value={privateKey}
          onChange={onChange}
        ></input>
      </label>

      <label>
        Wallet Public Address
        <input
          placeholder="Please Enter private key"
          value={address}
          readOnly
        ></input>
      </label>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
