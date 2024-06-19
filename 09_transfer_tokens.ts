import 'dotenv/config'
import {
  getExplorerLink,
  getKeypairFromEnvironment,
} from '@solana-developers/helpers'
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js'
import { getOrCreateAssociatedTokenAccount, transfer } from '@solana/spl-token'

const ownerKeyPair = process.env.KEY_PAIR || null

if (!ownerKeyPair) {
  console.log(`Please provide a key to send to`)
  process.exit(1)
}

const OWNER = getKeypairFromEnvironment('KEY_PAIR')
const connection = new Connection(clusterApiUrl('devnet'))

const MINOR_UNITS_PER_MAJOR_UNITS = Math.pow(10, 2)
const amount = 2

const tokenMintAccount = new PublicKey(
  'VngJvuAUsRYnjLLQi3jZzQpFSaFbKCdxBQxinKjA2rL'
)

const recipientAccount = new PublicKey(
  'A7Xk9uSVMBu4gTJDSo9F2PVxCQbZqVddk5AA7X5HseTT'
)

console.log(`💸 Sending 1 token from ${OWNER.publicKey} to ${recipientAccount}...`)

const tokenSource = await getOrCreateAssociatedTokenAccount(
  connection,
  OWNER,
  tokenMintAccount,
  OWNER.publicKey
)

const tokenDestination = await getOrCreateAssociatedTokenAccount(
  connection,
  OWNER,
  tokenMintAccount,
  recipientAccount
)

const signature = await transfer(
  connection,
  OWNER,
  tokenSource.address,
  tokenDestination.address,
  OWNER,
  amount * MINOR_UNITS_PER_MAJOR_UNITS
)

const link = getExplorerLink('transaction', signature, 'devnet')
console.log(`✅ Token successfully sent to ${tokenDestination.address}`)
console.log(`Link: ${link}`)