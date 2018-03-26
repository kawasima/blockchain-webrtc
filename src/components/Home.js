import React from 'react'
import { Link } from 'react-router-dom'
import { Form, Field } from 'react-final-form'

const renderAmount=({ input, meta }) => (
  <span>
    <input type="number" {...input} />
    {meta.touched && meta.error && <span>{meta.error}</span>}
  </span>
)

const renderTransferForm = ({ handleSubmit, pristine, invalid }) => (
  <form onSubmit={handleSubmit}>
    <Field
      name="amount"
      render={renderAmount}/>
    <button type="submit" disabled={pristine || invalid}>
      Send
    </button>
  </form>
)

const renderPeerId = (id, onSend, node) => (
  <li key={id}>
    {id}:
    <Form
      onSubmit={values => onSend(id, values.amount, node)}
      render={renderTransferForm} />
  </li>
)

const renderBlocks = (node, onSend) => {
  return (
    <ul>
      {node.connections.map(conn => renderPeerId(conn.peer, onSend, node))}
    </ul>
  )
}

export default ({node, onSend}) => {
  const blocks = (node) ? renderBlocks(node, onSend) : null
  return (
    <div>
      {blocks}
    </div>
  )
}
