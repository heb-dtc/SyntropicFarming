import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import NavigationBar from '@/NavigationBar'
import LandingPage from '@/LandingPage'
import Library from '@/Library'
import Polyculture from '@/Polyculture'
import Program from '@/Program'
import styles from '@/style.css'

const App = () => (
  <Router>
    <div className={styles['page']}>
      <NavigationBar />
      <Switch>
        <Route path="/database">
          <Library />
        </Route>
        <Route path="/polycultures">
          <Polyculture />
        </Route>
        <Route path="/program">
          <Program />
        </Route>
        <Route path="/">
          <LandingPage />
        </Route>
      </Switch>
    </div>
  </Router>
)

export default App
