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

const groupBy = (array, property) => {
  return array.reduce((accumulator, item) => {
    let key = item[property]
    if (!accumulator[key]) {
      accumulator[key] = []
    }
    accumulator[key].push({
      material: item.material_name,
      image: item.image_url,
    })
    return accumulator
  }, {})
}

const groupByMap = (array, property) => {
  return array.reduce((accumulator, item) => {
    let key = item[property]
    if (!accumulator.has(key)) {
      accumulator.set(key, [])
    }
    accumulator.get(key).push({
      material: item.material_name,
      image: item.image_url,
    })
    return accumulator
  }, new Map())
}

const DatabaseExplorer = ({ hardiness }) => {
  const [associations, setAssociations] = useState({})
  const [materials, setMaterials] = useState([])

  useEffect(() => {
    const fetchValues = async () => {
      const response = await axios(`${baseUrl}/associations/filter/${hardiness}`)
      const associations = response.data
      if (associations != null) {
        //group associations by species
        const groupedAssociations = groupBy(associations, 'species_name')
        setAssociations(groupedAssociations)

        // build an array of all materials
        const materials = associations.reduce(
          (unique, item) => (unique.includes(item.material_name) ? unique : [...unique, item.material_name]),
          []
        )
        setMaterials(materials)
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
          <div>SPECIES</div>
          {Object.keys(associations).map((item, i) => (
            <div key={i} className={styles.explorerMenuText}>
              {item}
            </div>
          ))}
        </aside>

        <main>
          {Object.entries(associations).map(([key, value]) => {
            return (
              <div>
                <div>{key}</div>
                <div className={styles.materialGrid}>
                  {value.map(item => (
                    <img src={`https://syntropic-api.hebus.net/${item.image}`} />
                  ))}
                </div>
              </div>
            )
          })}
        </main>

        <aside className={styles.explorerRightMenu}>
          <div>MATERIALS</div>
          {materials.map(material => (
            <div className={styles.explorerMenuText}>{material}</div>
          ))}
        </aside>
      </div>
    </div>
  )
}

export default DatabaseExplorer
