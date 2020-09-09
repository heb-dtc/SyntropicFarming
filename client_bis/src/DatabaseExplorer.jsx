import React, { useState, useEffect } from 'react'
import axios from 'axios'
import styles from './style.css'

const baseUrl = 'https://syntropic-api.hebus.net/api'

const filterSpecies = async hardiness => {
  const response = await axios(`${baseUrl}/species`)
  const species = response.data.filter(
    species => species.min_hardiness >= hardiness && species.max_hardiness <= hardiness
  )
  return species
}

const DatabaseExplorer = ({ hardiness }) => {
  const [associations, setAssociations] = useState([])

  useEffect(() => {
    const fetchValues = async () => {
      const response = await axios(`${baseUrl}/associations/filter/${hardiness}`)
      setAssociations(response.data)
    }
    fetchValues()
  }, [hardiness])

  return (
    <div className={styles.explorer}>
      <ul className={styles.explorerNavigationBar}>
        <li className={styles.navigationBarTitle}>Hardiness zone</li>
        <li>{hardiness}</li>
      </ul>
      <div className={styles.explorerContainer}>
        <aside className={styles.explorerLeftMenu}>
          <div>SPECIES</div>
          {associations.map(association => (
            <div className={styles.explorerMenuText}>{association.species_name}</div>
          ))}
        </aside>

        <main>
          <div> abaca </div>
          <div className={styles.materialGrid}>
            <img src="https://syntropic-api.hebus.net/uploads/Abaca-paper.jpg" />
            <img src="https://Syntropic-api.hebus.net/uploads/Abaca-paper.jpg" />
            <img src="https://syntropic-api.hebus.net/uploads/Abaca-paper.jpg" />
            <img src="https://syntropic-api.hebus.net/uploads/Abaca-paper.jpg" />
          </div>
        </main>

        <aside className={styles.explorerRightMenu}>
          <div>MATERIALS</div>
          {associations.map(association => (
            <div className={styles.explorerMenuText}>{association.material_name}</div>
          ))}
        </aside>
      </div>
    </div>
  )
}

export default DatabaseExplorer
