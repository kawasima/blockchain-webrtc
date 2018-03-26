import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import uuidv4 from 'uuid/v4'
import Node from '../node'
import Home from '../components/Home'

class HomeContainer extends React.Component {
  componentDidMount() {
    const node = this.props.onCreateNode()
  }

  render() {
    const props = this.props
    return (
      <Home {...props}/>
    )
  }
}

const connector = connect(
  ({ home }) => home,
  (dispatch) => {
    return {
      onCreateNode: () => {
        const node = new Node()
        dispatch({
          type: 'CREATE_NODE',
          node
        })
      },
      onSend: (id, amount, node) => {
        const blockchain = node.blockchain
        /*
        const lastBlock = blockchain.lastBlock
        const lastProof = lastBlock.proof
        const proof = blockchain.proofOfWork(lastProof)
        */

        blockchain.newTransaction(node.id, id, amount)
        node.broadcast(node.responseLast())
        console.log(id + ':' + amount)
        /*
        const previousHash = blockchain.hash(lastBlock)
        const block = blockchain.newBlock({proof, previousHash})
        */

      },
      dispatch
    }
  }
)
export default connector(HomeContainer)
