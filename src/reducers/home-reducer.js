export default (state = {}, action) => {
  switch(action.type) {
  case 'CREATE_NODE':
    return {...state, node: action.node}
  default:
    return state
  }
}
