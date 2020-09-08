import React from 'react'
import styles from './style.css'

const DatabaseExplorer = ({hardiness}) => (
  <div>
    <ul className={styles.explorerNavigationBar}>
      <li className={styles.navigationBarTitle}>Hardiness zone</li>
      <li>{hardiness}</li>
    </ul>
    <div className={styles.explorerContainer}>
      <aside className={styles.explorerLeftMenu}>
        <div>SPECIES</div>
        <div className={styles.explorerMenuText}>amaranth</div>
        <div className={styles.explorerMenuText}>amaranth</div>
        <div className={styles.explorerMenuText}>amaranth</div>
        <div className={styles.explorerMenuText}>amaranth</div>
        <div className={styles.explorerMenuText}>amaranth</div>
        <div className={styles.explorerMenuText}>amaranth</div>
        <div className={styles.explorerMenuText}>amaranth</div>
        <div className={styles.explorerMenuText}>amaranth</div>
      </aside>

      <main>
        <div> abaca </div>
        <div className={styles.materialGrid}>
          <div className={styles.gridItem}>
            <img src="https://syntropic-api.hebus.net/uploads/Abaca-paper.jpg" />
          </div>
          <div className={styles.gridItem}>
            <img src="https://Syntropic-api.hebus.net/uploads/Abaca-paper.jpg" />
          </div>
          <div className={styles.gridItem}>
            <img src="https://syntropic-api.hebus.net/uploads/Abaca-paper.jpg" />
          </div>
          <div className={styles.gridItem}>
            <img src="https://syntropic-api.hebus.net/uploads/Abaca-paper.jpg" />
          </div>
        </div>
      </main>

      <aside className={styles.explorerRightMenu}>
        <div>MATERIALS</div>
        <div className={styles.explorerMenuText}>amaranth</div>
        <div className={styles.explorerMenuText}>amaranth</div>
        <div className={styles.explorerMenuText}>amaranth</div>
        <div className={styles.explorerMenuText}>amaranth</div>
        <div className={styles.explorerMenuText}>amaranth</div>
        <div className={styles.explorerMenuText}>amaranth</div>
        <div className={styles.explorerMenuText}>amaranth</div>
        <div className={styles.explorerMenuText}>amaranth</div>
      </aside>
    </div>
  </div>
)

export default DatabaseExplorer
