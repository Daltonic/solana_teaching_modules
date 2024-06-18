import 'dotenv/config'
import {
  Connection,
  clusterApiUrl,
  PublicKey,
  LAMPORTS_PER_SOL,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction,
} from '@solana/web3.js'
import { getKeypairFromEnvironment } from '@solana-developers/helpers'

const suppliedPublicKey = process.env.KEY_PAIR || null
if (!suppliedPublicKey) {
  console.log(`Please provide a public key to send to`)
  process.exit(1)
}

const KEY_PAIR = getKeypairFromEnvironment('KEY_PAIR')
const connection = new Connection(clusterApiUrl('devnet'))

const SENDER = KEY_PAIR.publicKey || null
const RECEIVER = new PublicKey('MJKqp326RZCHnAAbew9MDdui3iCKWco7fsK9sVuZTX2')

const transaction = new Transaction()
const amount = 1

const txInfo = SystemProgram.transfer({
  fromPubkey: SENDER,
  toPubkey: RECEIVER,
  lamports: amount * LAMPORTS_PER_SOL,
})

transaction.add(txInfo)

const signature = await sendAndConfirmTransaction(connection, transaction, [
  KEY_PAIR,
])

console.log(
  `💸 Finished! Sent ${
    amount * LAMPORTS_PER_SOL
  } sol to the address ${RECEIVER}. `
)
console.log(`Transaction signature is ${signature}!`)
