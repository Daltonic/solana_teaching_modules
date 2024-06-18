import { Connection, clusterApiUrl, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js'

const connection = new Connection(clusterApiUrl('devnet'))
const address = new PublicKey('6FP1Q5VD5kibWmwXaPrqMgsxSDnLr1wP3UhtvDkz6Net')
const balance = await connection.getBalance(address)
const solBalance = balance / LAMPORTS_PER_SOL

console.log(`The balance of the account at ${address} is ${solBalance} sol`); 
console.log(`✅ Finished!`)
