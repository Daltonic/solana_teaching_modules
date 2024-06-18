import 'dotenv/config'
import {
  Connection,
  clusterApiUrl,
  PublicKey,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js'
import { getKeypairFromEnvironment } from '@solana-developers/helpers'

const suppliedPublicKey = process.env.KEY_PAIR || null
if (!suppliedPublicKey) {
  console.log(`Please provide a public key to send to`)
  process.exit(1)
}

const PRIVATE_KEY = getKeypairFromEnvironment('KEY_PAIR')
const connection = new Connection(clusterApiUrl('devnet'))

const PUBLIC_KEY = PRIVATE_KEY.publicKey || null
const address = new PublicKey(PUBLIC_KEY)

const balance = await connection.getBalance(address)
const solBalance = balance / LAMPORTS_PER_SOL

console.log(`The balance of the account at ${address} is ${solBalance} sol`)
console.log(`✅ Finished!`)
