import 'dotenv/config'
import { Connection, clusterApiUrl } from '@solana/web3.js'
import {
  getExplorerLink,
  getKeypairFromEnvironment,
} from '@solana-developers/helpers'
import { createMint } from '@solana/spl-token'

const ownerKeyPair = process.env.KEY_PAIR || null
if (!ownerKeyPair) {
  console.log(`Please provide a key to send to`)
  process.exit(1)
}

const OWNER = getKeypairFromEnvironment('KEY_PAIR')
const connection = new Connection(clusterApiUrl('devnet'))

const tokenMint = await createMint(
  connection,
  OWNER,
  OWNER.publicKey,
  null,
  2
)
const link = getExplorerLink('address', tokenMint.toString(), 'devnet')

console.log(`✅ Finished! Created token mint: ${link}`)
