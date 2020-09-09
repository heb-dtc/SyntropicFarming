import React, { useState, useEffect } from 'react'
import axios from 'axios'
import styles from './style.css'

const baseUrl = 'https://syntropic-api.hebus.net/api'

const groupBy = (array, property) => {
  return array.reduce((accumulator, item) => {
    let key = item[property]
    if (!accumulator[key]) {
      accumulator[key] = []
    }
    accumulator[key].push({
      material: item.material_name,
      imageUrl: `https://syntropic-api.hebus.net/${item.image_url}`,
    })
    return accumulator
  }, {})
}

const DatabaseExplorer = ({ hardiness }) => {
  const [associations, setAssociations] = useState({})
  const [materials, setMaterials] = useState([])

  const [selectedSpecies, setSelectedSpecies] = useState([])
  const [selectedMaterials, setSelectedMaterials] = useState([])

  useEffect(() => {
    const fetchValues = async () => {
      let url
      if (hardiness !== -1) {
        url = `${baseUrl}/associations/filter/${hardiness}`
      } else {
        url = `${baseUrl}/associations`
      }

      const response = await axios(url)
      const associations = response.data

      if (associations != null) {
        // build an array of all species
        const species = associations.reduce(
          (unique, item) => (unique.includes(item.species_name) ? unique : [...unique, item.species_name]),
          []
        )

        // build an array of all materials
        const materials = associations.reduce(
          (unique, item) => (unique.includes(item.material_name) ? unique : [...unique, item.material_name]),
          []
        )
        setMaterials(materials)

        //group associations by species
        const groupedAssociations = groupBy(associations, 'species_name')
        setAssociations(groupedAssociations)

        setSelectedSpecies(species)
        setSelectedMaterials(materials)
      }
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
          <div className={styles.explorerMenuTitle}>species</div>
          {Object.keys(associations).map((item, i) => (
            <div key={i} className={styles.explorerMenuText}>
              {item}
            </div>
          ))}
        </aside>

        <main>
          {Object.entries(associations).map(([key, value]) => {
            if (selectedSpecies.includes(key)) {
              return (
                <div>
                  <div className={styles.gridTitle}>{key}</div>
                  <div className={styles.materialGrid}>
                    {value.map(item => {
                      if (selectedMaterials.includes(item.material)) {
                        return (
                          <div className={styles.gridItem}>
                            <img src={item.imageUrl} />
                            <div>{item.material}</div>
                          </div>
                        )
                      }
                    })}
                  </div>
                </div>
              )
            }
          })}
        </main>

        <aside className={styles.explorerRightMenu}>
          <div className={styles.explorerMenuTitle}>materials</div>
          {materials.map(material => (
            <div className={styles.explorerMenuText}>{material}</div>
          ))}
        </aside>
      </div>
    </div>
  )
}

export default DatabaseExplorer
