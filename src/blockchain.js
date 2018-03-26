import sjcl from 'sjcl'


const validProof = (lastProof, proof) => {
  const guess = `${lastProof}${proof}`
  const guessBytes = sjcl.hash.sha256.hash(guess)
  const guessHash = sjcl.codec.hex.fromBits(guessBytes)

  return guessHash.slice(0,4) === '0000'
}

export default class Blockchain {
  constructor() {
    this.chain = []
    this.currentTransaction = []
    this.newBlock({previousHash: 1, proof: 100})
  }

  newBlock({proof, previousHash}) {
    const block = {
      index: this.chain.length + 1,
      timestamp: new Date().getTime(),
      transattions: this.currentTransaction,
      proof: proof,
      previousHash: previousHash || hash(this.chain[this.chain.length-1])
    }
    this.currentTransaction = []
    this.chain.push(block)
    return block
  }

  newTransaction(sender, recipient, amount) {
    this.currentTransaction.push({
      sender,
      recipient,
      amount
    })
    return this.lastBlock['index'] + 1
  }

  hash(block) {
    const blockString = JSON.stringify(block)
    const sha256bytes = sjcl.hash.sha256.hash(blockString)
    return sjcl.codec.hex.fromBits(sha256bytes)
  }

  proofOfWork(lastProof) {
    let proof = 0
    while (validProof(lastProof, proof) === false) {
      proof += 1
    }
    return proof
  }

  validChain(chain) {
    let lastBlock = chain[0]
    let currentIndex = 1

    while(currentIndex < chain.length) {
      const block = chain[currentIndex]

      if (block.previousHash !== this.hash(lastBlock)) {
        return false
      }

      if (! validProof(lastBlock.proof, block.proof)) {
        return false
      }

      lastBlock = block
      currentIndex += 1
    }

    return true
  }

  resolveConflicts() {
  }

  get lastBlock() {
    return this.chain[this.chain.length-1]
  }
}
