import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import NavigationBar from '@/NavigationBar'
import LandingPage from '@/LandingPage'
import Library from '@/Library'
import styles from './style.css'

const App = () => (
  <Router>
    <div className={styles.page}>
      <NavigationBar />
      <Switch>
        <Route path="/database">
          <LandingPage />
        </Route>
        <Route path="/polycultures">
          <div>polyculture</div>
        </Route>
        <Route path="/program">
          <div>program</div>
        </Route>
        <Route path="/">
          <Library />
        </Route>
      </Switch>
    </div>
  </Router>
)

export default App
