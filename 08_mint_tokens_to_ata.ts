import 'dotenv/config'
import {
  getExplorerLink,
  getKeypairFromEnvironment,
} from '@solana-developers/helpers'
import { mintTo } from '@solana/spl-token'
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js'

const ownerKeyPair = process.env.KEY_PAIR || null

if (!ownerKeyPair) {
  console.log(`Please provide a key to send to`)
  process.exit(1)
}

const OWNER = getKeypairFromEnvironment('KEY_PAIR')
const connection = new Connection(clusterApiUrl('devnet'))

const MINOR_UNITS_PER_MAJOR_UNITS = Math.pow(10, 2)

const tokenMintAccount = new PublicKey(
  'VngJvuAUsRYnjLLQi3jZzQpFSaFbKCdxBQxinKjA2rL'
)

const recipientAssociatedTokenAccount = new PublicKey(
  'EBtGUgvR224Nuc84k8AebNNY3m2LBWk82sUArsMFdFbS'
)

const transactionSignature = await mintTo(
  connection,
  OWNER,
  tokenMintAccount,
  recipientAssociatedTokenAccount,
  OWNER,
  10 * MINOR_UNITS_PER_MAJOR_UNITS
)

const link = getExplorerLink('transaction', transactionSignature, 'devnet')
console.log(`✅ Success! Mint Token Transaction: ${link}`)
