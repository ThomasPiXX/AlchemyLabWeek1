import * as secp from "ethereum-cryptography/secp256k1";
import { toHex, utf8ToBytes } from "ethereum-cryptography/utils";
import { keccak256 } from "ethereum-cryptography/keccak";



function hashMessage(message){
    const messageBytes = utf8ToBytes(message);
    const hash = keccak256(messageBytes);

    return hash;
}

function signMessage(msgHash, privateKey){
    const signature = secp.secp256k1.sign(msgHash, privateKey);
    
    return signature;

}

function getPublicKey(privateKey){
    return toHex(secp.secp256k1.getPublicKey(privateKey));
}

export { hashMessage, signMessage, getPublicKey}
