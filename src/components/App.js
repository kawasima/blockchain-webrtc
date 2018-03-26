import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import HomeContainer from '../containers/HomeContainer'

import Layout from './Layout'

const App = () => {
  const routing = (
    <Switch>
      <Route exact path='/' component={HomeContainer} />
    </Switch>)

  return (
    <Router>
      <Layout children={routing}/>
    </Router>
  )
}

export default App
