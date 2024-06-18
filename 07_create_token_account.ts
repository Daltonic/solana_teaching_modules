import 'dotenv/config'
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js'
import {
  getExplorerLink,
  getKeypairFromEnvironment,
} from '@solana-developers/helpers'
import { getOrCreateAssociatedTokenAccount } from '@solana/spl-token'

const ownerKeyPair = process.env.KEY_PAIR || null
if (!ownerKeyPair) {
  console.log(`Please provide a key to send to`)
  process.exit(1)
}

const OWNER = getKeypairFromEnvironment('KEY_PAIR')
const connection = new Connection(clusterApiUrl('devnet'))

const tokenMintAccount = new PublicKey(
  'VngJvuAUsRYnjLLQi3jZzQpFSaFbKCdxBQxinKjA2rL'
)

const recipientAssociatedTokenAccount = new PublicKey(
  'A7Xk9uSVMBu4gTJDSo9F2PVxCQbZqVddk5AA7X5HseTT'
)

const tokenAccount = await getOrCreateAssociatedTokenAccount(
  connection,
  OWNER,
  tokenMintAccount,
  recipientAssociatedTokenAccount
)

console.log(`Token Account: ${tokenAccount.address.toBase58()}`)

const link = getExplorerLink(
  'address',
  tokenAccount.address.toBase58(),
  'devnet'
)

console.log(`✅ Created token Account: ${link}`)
