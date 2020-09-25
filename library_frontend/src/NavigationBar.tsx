import React from 'react'
import { NavLink } from 'react-router-dom'
import styles from '@/style.css'

const NavigationBar: React.FC = () => (
  <div className={styles['pageHeader']}>
    <ul className={styles['navigationBar']}>
      <li className={styles['navigationBarTitle']}>
        <NavLink activeClassName={styles['selectedNav']} exact to="/">
          SYNTROPIC MATERIALS
        </NavLink>
      </li>
      <li>
        <NavLink activeClassName={styles['selectedNav']} to="/library">
          LIBRARY
        </NavLink>
      </li>
      <li>
        <NavLink activeClassName={styles['selectedNav']} to="/polycultures">
          POLYCULTURES
        </NavLink>
      </li>
      <li>
        <NavLink activeClassName={styles['selectedNav']} to="/about">
          ABOUT
        </NavLink>
      </li>
    </ul>
  </div>
)

export default NavigationBar
