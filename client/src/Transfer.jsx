import { useState } from "react";
import server from "./server";
import { toHex } from "ethereum-cryptography/utils";
import { hashMessage, signMessage } from "./scripts/tool.js";


function Transfer({ address, setBalance, privateKey, isVerified, setVerified }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const message = "Transaction Block";

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    try {
      const hashedMessage = toHex(hashMessage(message));

      let signature = signMessage(hashedMessage, privateKey);

      // Converting sign format
      signature = JSON.stringify({
        ...signature,
        r: signature.r.toString(),
        s: signature.s.toString(),
      });

      const { 
        data: { balance, isVerified }, 
      } = await server.post(`send`, {
        sender: address,
        recipient,
        amount: parseInt(sendAmount),
        signature: signature,
        hashedMessage: hashedMessage,
        message: message,
      });


      setBalance(balance);
      setVerified(isVerified);
      console.log("isVerified: ", isVerified);
    } catch (error) {
      isVerified = false;
      setVerified(isVerified);
      console.error('Error:', error);
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
          placeholder="Public Key"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      

      <input type="submit" className="button" value="Approve Transfer" />

      <h2 className="isVerified">Status: {isVerified ? "Successful" : "Denied"}</h2>
    </form>
  );
}

export default Transfer;

