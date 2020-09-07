import React from 'react'
import styles from './style.css'

const NavigationBar = () => (
  <div className={styles.header}>
    <ul>
      <li className={styles.title}>SYNTROPIC MATERIALS</li>
      <li>DATABASE</li>
      <li>POLYCULTURES</li>
      <li>PROGRAM</li>
    </ul>
  </div>
)

export default NavigationBar
