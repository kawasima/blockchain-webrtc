import Peer from 'peerjs'
import 'whatwg-fetch'
import Blockchain from './blockchain'

export default class Node {
  constructor() {
    this.blockchain = new Blockchain()
    this.connections = []

    const peer = new Peer({
      host: '/',
      port: 3000,
      path: '/peerjs',
      debug: 3,
    })
    peer.on('connection', conn => {
      conn.on('data', message => {
        switch (message.type) {
        case 'QUERY_LATEST':
          conn.send({
            type: 'RESPONSE_BLOCKCHAIN',
            chain: [blockchain.lastBlock]
          })
          break
        case 'QUERY_ALL':
          conn.send({
            type: 'RESPONSE_BLOCKCHAIN',
            chain: blockchain.chain
          })
          break
        case 'RESPONSE_BLOCKCHAIN':
          this.handleBlockchainResponse(message)
          break
        }
      })
    })
    peer.on('open', id => {
      fetch('/peerjs/peerjs/peers')
        .then(res => res.json())
        .then(peers => {
          this.connections = peers
                .filter(peerId => peerId !== id)
                .map(peerId => peer.connect(peerId))
        })
    })
    this.peer = peer
  }

  handleBlockchainResponse(message) {
    const receivedBlocks = message.chain.sort((b1, b2) => (b1.index - b2.index))
    const lastBlockReceived = receivedBlocks[receivedBlocks.length - 1]
    const lastBlockHeld = this.blockchain.lastBlock

    if (lastBlockReceived.index > lastBlockHeld.index) {
      if (lastBlockHeld.hash === lastBlockReceived.previousHash) {
        this.blockchain.chain.push(lastBlockReceived)
        this.broadcast(this.responseLast())
      } else if (receivedBlocks.length === 1) {
        console.log('We have to query the chain from our peer')
        this.broadcast(this.responseChain())
      } else {
        console.log('Received blockchain is longer than current blockchain')
        this.replaceChain(receivedBlocks)
      }
    } else {
      console.log('received blockchain is not longer han current blockchain. Do nothing.')
    }
  }

  responseLast() {
    return {
      type: 'RESPONSE_BLOCKCHAIN',
      chain: [ this.blockchain.lastBlock ]
    }
  }

  responseChain() {
    return {
      type: 'RESPONSE_BLOCKCHAIN',
      chain: this.blockchain.chain
    }
  }

  replaceChain(newBlocks) {
    if (this.blockchain.validChain(newBlocks) && newBlocks.length > this.blockchain.chain.length) {
      this.blockchain.chain = newBlocks
      this.connections.forEach(conn => {
        conn.send({
          type: 'RESPONSE_BLOCKCHAIN',
          chain: [blockchain.lastBlock]
        })
      })
    } else {
      console.log('Received blockchain invalid')
    }
  }

  broadcast(message) {
    this.connections.forEach(conn => {
      conn.send(message)
    })
  }
}
