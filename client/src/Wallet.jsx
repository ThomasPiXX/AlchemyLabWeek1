import { useState, useEffect } from "react";
import server from "./server";
import { toHex } from "ethereum-cryptography/utils";
import * as secp from "ethereum-cryptography/secp256k1";

function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey }) {
  // This useEffect hook fetches the balance when the component mounts and when dependencies change.
  useEffect(() => {
    async function fetchBalance() {
      try {
        if (privateKey) {
          const publicKey = secp.secp256k1.getPublicKey(privateKey);
          const addressFromKey = toHex(publicKey);

          setAddress(addressFromKey);

          const { data: { balance } } = await server.get(`balance/${addressFromKey}`);
          setBalance(balance);
        } else {
          setBalance(0);
          setAddress("");
        }
      } catch (error) {
        console.error(error);
        // Handle errors gracefully
      }
    }

    fetchBalance();
  }, [privateKey, setAddress, setBalance]);

  const truncatedAddress = (address.slice(0, 5)) + "....." + address.slice(-5);

  const onChange = (evt) => {
    const newPrivateKey = evt.target.value;
    setPrivateKey(newPrivateKey);
  };

  return (
    <div className="container wallet">
      <h1>Wallet</h1>
      <h5>Authentication</h5>

      <label>
        Private Key:
        <input
          placeholder="Private Key"
          value={privateKey}
          onChange={onChange}
        ></input>
      </label>

      <div className='publicKey'>
        Account Public Key: {truncatedAddress}
      </div>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
