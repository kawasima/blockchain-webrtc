import Blockchain from 'blockchain'
import uuidv4 from 'uuid/v4'

describe('test1', () => {
  test('genesis block', () => {
    const blockchain = new Blockchain()
    const block = blockchain.lastBlock
    expect(block.proof).toBe(100)
    expect(block.previousHash).toBe(1)
  })

  test('new transaction', () => {
    const blockchain = new Blockchain()
    const sender = uuidv4()
    const recipient = uuidv4()

    blockchain.newTransaction(sender, recipient, 1000)
    expect(blockchain.currentTransaction.length).toBe(1)

    blockchain.newTransaction(sender, recipient, 2000)
    expect(blockchain.currentTransaction.length).toBe(2)

  })

  test('mining', () => {
    const blockchain = new Blockchain()
    const lastBlock = blockchain.lastBlock
    const lastProof = lastBlock.proof
    const proof = blockchain.proofOfWork(lastProof)

    console.log(proof)
    const sender = uuidv4()
    const recipient = uuidv4()

    blockchain.newTransaction(sender, recipient, 1000)
    expect(blockchain.currentTransaction.length).toBe(1)

  })
})
