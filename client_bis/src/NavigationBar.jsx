import React from 'react'
import { NavLink } from 'react-router-dom'
import styles from './style.css'

const NavigationBar = () => (
  <div className={styles.header}>
    <ul className={styles.navigationBar}>
      <li className={styles.navigationBarTitle}>
        <NavLink activeClassName={styles.selectedNav} exact to="/">
          SYNTROPIC MATERIALS
        </NavLink>
      </li>
      {/*<li>
        <NavLink activeClassName={styles.selectedNav} to="/database">
          DATABASE
        </NavLink>
      </li>
      <li>
        <NavLink activeClassName={styles.selectedNav} to="/polycultures">
          POLYCULTURES
        </NavLink>
      </li>
      <li>
        <NavLink activeClassName={styles.selectedNav} to="/program">
          PROGRAM
        </NavLink>
      </li>
      */}
    </ul>
  </div>
)

export default NavigationBar
