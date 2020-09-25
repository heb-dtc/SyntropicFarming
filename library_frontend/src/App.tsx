import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import NavigationBar from '@/NavigationBar'
import LandingPage from '@/LandingPage'
import LibraryPage from '@/LibraryPage'
import PolyculturePage from '@/PolyculturePage'
import AboutPage from '@/AboutPage'
import styles from '@/style.css'

const App: React.FC = () => (
  <Router>
    <div className={styles['page']}>
      <NavigationBar />
      <Switch>
        <Route path="/library">
          <LibraryPage />
        </Route>
        <Route path="/polycultures">
          <PolyculturePage />
        </Route>
        <Route path="/about">
          <AboutPage />
        </Route>
        <Route path="/">
          <LandingPage />
        </Route>
      </Switch>
    </div>
  </Router>
)

export default App
