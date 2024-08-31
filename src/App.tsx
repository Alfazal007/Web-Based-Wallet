import nacl from "tweetnacl";
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import { HDNodeWallet, Wallet } from "ethers";
import { useEffect, useState } from "react";

export default function App() {
    const [seed, setSeed] = useState<Buffer | null>(null);
    function phraseReturner(){
            const mnemonic = generateMnemonic();
            const seed = mnemonicToSeedSync(mnemonic);
            setSeed(seed);
    }
    useEffect(()=>{phraseReturner()}, [])

    function solanaAdder() {
        if (seed == null) {
            return;
        }
        const path = `m/44'/501'/${solIndex}'/0'`; // This is the derivation path
        const derivedSeed = derivePath(path, seed.toString("hex")).key;
        const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
        setSolIndex((prev) => prev + 1);
        console.log(Keypair.fromSecretKey(secret).publicKey.toBase58());
        console.log(secret);
        setSolanaPublicAddresses((prev) => [...prev,Keypair.fromSecretKey(secret).publicKey.toBase58()])
        setSolanaPrivateAddresses((prev) => [...prev,secret.toString()])
    }
    function ethAdder() {
        if(seed == null) {
            return;
        }
        const derivationPath = `m/44'/60'/${ethIndex}'/0'`;
        const hdNode = HDNodeWallet.fromSeed(seed);
        const child = hdNode.derivePath(derivationPath);
        const privateKey = child.privateKey;
        const wallet = new Wallet(privateKey);
        setEthIndex((prev) => prev + 1);
        setEthPublicAddresses((prev) => [...prev, wallet.address])
        setEthPrivateAddresses((prev) => [...prev, wallet.privateKey])
    }

    const [ethIndex, setEthIndex] = useState(0);
    const [solIndex, setSolIndex] = useState(0);

    const [solanaPublicAddresses, setSolanaPublicAddresses] = useState<string[]>([]);
    const [solanaPrivateAddresses, setSolanaPrivateAddresses] = useState<string[]>([]);
    const [ethPublicAddresses, setEthPublicAddresses] = useState<string[]>([]);
    const [ethPrivateAddresses, setEthPrivateAddresses] = useState<string[]>([]);

    return (
        <>
            <div>
                <button onClick={solanaAdder}>Solana Wallet</button>
            <br />
                Solana Private Addresses
            <br />
                {
                    solanaPrivateAddresses.map((addr)=>{
                    return (
                        <>
                            {addr}
                            <br />
                        </>
                    )
                })
                }
                            <br />

                Solana Public Addresses
            <br />    
            {
                    solanaPublicAddresses.map((addr)=>{
                    return (
                        <>
                            {addr}
                            <br />
                        </>
                    )
                })
                }
                <br />
                <button onClick={ethAdder}>Ethereum Wallet</button>
            <br />
                Ethereum Private Addresses
            <br />    
            {
                    ethPrivateAddresses.map((addr)=>{
                    return (
                        <>
                            {addr}
                            <br />
                        </>
                    )
                })
                }
            <br />
                Ethereum Public Addresses
            <br />    
            {
                    ethPublicAddresses.map((addr)=>{
                    return (
                        <>
                            {addr}
                            <br />
                        </>
                    )
                })
                }
           </div>
        </>
    )
}
