import 'dotenv/config'
import {
  Connection,
  clusterApiUrl,
  PublicKey,
  Transaction,
  SystemProgram,
  Keypair,
} from '@solana/web3.js'
import { getKeypairFromEnvironment } from '@solana-developers/helpers'
import {
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  createInitializeAccountInstruction,
  createInitializeMintInstruction,
  createMintToInstruction,
  createTransferInstruction,
  getAccountLenForMint,
  getAssociatedTokenAddress,
  getMinimumBalanceForRentExemptMint,
  getMint,
} from '@solana/spl-token'

const suppliedPublicKey = process.env.KEY_PAIR || null
if (!suppliedPublicKey) {
  console.log(`Please provide a public key to send to`)
  process.exit(1)
}

const KEY_PAIR = getKeypairFromEnvironment('KEY_PAIR')
const connection = new Connection(clusterApiUrl('devnet'))

const SENDER = KEY_PAIR.publicKey || null
const RECEIVER = new PublicKey('MJKqp326RZCHnAAbew9MDdui3iCKWco7fsK9sVuZTX2')

async function buildCreateMintTransaction(
  connection: Connection,
  payer: PublicKey,
  decimals: number
): Promise<Transaction> {
  const lamports = await getMinimumBalanceForRentExemptMint(connection)
  const accountKeypair = Keypair.generate()
  const programId = TOKEN_PROGRAM_ID

  const transaction = new Transaction().add(
    SystemProgram.createAccount({
      fromPubkey: payer,
      newAccountPubkey: accountKeypair.publicKey,
      space: MINT_SIZE,
      lamports,
      programId,
    }),
    createInitializeMintInstruction(
      accountKeypair.publicKey,
      decimals,
      payer,
      payer,
      programId
    )
  )

  return transaction
}

async function buildCreateTokenAccountTransaction(
  connection: Connection,
  payer: PublicKey,
  mint: PublicKey
): Promise<Transaction> {
  const mintState = await getMint(connection, mint)
  const accountKeypair = Keypair.generate()
  const space = getAccountLenForMint(mintState)
  const lamports = await connection.getMinimumBalanceForRentExemption(space)
  const programId = TOKEN_PROGRAM_ID

  const transaction = new Transaction().add(
    SystemProgram.createAccount({
      fromPubkey: payer,
      newAccountPubkey: accountKeypair.publicKey,
      space,
      lamports,
      programId,
    }),
    createInitializeAccountInstruction(
      accountKeypair.publicKey,
      mint,
      payer,
      programId
    )
  )

  return transaction
}

async function buildCreateAssociatedTokenAccountTransaction(
  payer: PublicKey,
  mint: PublicKey
): Promise<Transaction> {
  const associatedTokenAddress = await getAssociatedTokenAddress(
    mint,
    payer,
    false
  )

  const transaction = new Transaction().add(
    createAssociatedTokenAccountInstruction(
      payer,
      associatedTokenAddress,
      payer,
      mint
    )
  )

  return transaction
}

async function buildMintToTransaction(
  authority: PublicKey,
  mint: PublicKey,
  amount: number,
  destination: PublicKey
): Promise<Transaction> {
  const transaction = new Transaction().add(
    createMintToInstruction(mint, destination, authority, amount)
  )

  return transaction
}

async function buildTransferTransaction(
  source: PublicKey,
  destination: PublicKey,
  owner: PublicKey,
  amount: number
): Promise<Transaction> {
  const transaction = new Transaction().add(
    createTransferInstruction(source, destination, owner, amount)
  )

  return transaction
}
