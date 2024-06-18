import 'dotenv/config'
import {
  Connection,
  PublicKey,
  Transaction,
  clusterApiUrl,
  sendAndConfirmTransaction,
} from '@solana/web3.js'
import {
  getExplorerLink,
  getKeypairFromEnvironment,
} from '@solana-developers/helpers'
import { createCreateMetadataAccountV3Instruction } from '@metaplex-foundation/mpl-token-metadata'

const ownerKeyPair = process.env.KEY_PAIR || null
if (!ownerKeyPair) {
  console.log(`Please provide a key to send to`)
  process.exit(1)
}

const OWNER = getKeypairFromEnvironment('KEY_PAIR')
const connection = new Connection(clusterApiUrl('devnet'))

const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
  'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
)

const tokenMintAccount = new PublicKey(
  'VngJvuAUsRYnjLLQi3jZzQpFSaFbKCdxBQxinKjA2rL'
)

const metadataData = {
  name: 'Dapp Mentors Academy',
  symbol: 'DMA',
  // Arweave / IPFS / Pinata etc link using metaplex standard for off-chain data
  uri: 'https://dappmentors.org',
  sellerFeeBasisPoints: 0,
  creators: null,
  collection: null,
  uses: null,
}

const metadataPDAAndBump = PublicKey.findProgramAddressSync(
  [
    Buffer.from('metadata'),
    TOKEN_METADATA_PROGRAM_ID.toBuffer(),
    tokenMintAccount.toBuffer(),
  ],
  TOKEN_METADATA_PROGRAM_ID
)

const metadataPDA = metadataPDAAndBump[0]
const transaction = new Transaction()

const createMetadataAccountInstruction =
  createCreateMetadataAccountV3Instruction(
    {
      metadata: metadataPDA,
      mint: tokenMintAccount,
      mintAuthority: OWNER.publicKey,
      payer: OWNER.publicKey,
      updateAuthority: OWNER.publicKey,
    },
    {
      createMetadataAccountArgsV3: {
        collectionDetails: null,
        data: metadataData,
        isMutable: true,
      },
    }
  )

transaction.add(createMetadataAccountInstruction)

const transactionSignature = await sendAndConfirmTransaction(
  connection,
  transaction,
  [OWNER]
)

const transactionLink = getExplorerLink(
  'transaction',
  transactionSignature,
  'devnet'
)

console.log(`✅ Transaction confirmed, explorer link is: ${transactionLink}!`)

const tokenMintLink = getExplorerLink(
  'address',
  tokenMintAccount.toString(),
  'devnet'
)

console.log(`✅ Look at the token mint again: ${tokenMintLink}!`)
