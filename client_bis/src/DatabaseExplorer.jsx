import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
  groupBySpecies,
  toggleStatusForSpecies,
  toggleStatusForMaterial,
  updateMaterialsStatus,
  updateSpeciesStatus,
} from './explorer.js'
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

const toggleSelected = (list, itemIndex) => {
  const newList = list.map((item, index) => {
    if (index === itemIndex) {
      const updatedItem = {
        ...item,
        selected: !item.selected,
      }
      return updatedItem
    }
    return item
  })
  return newList
}

const DatabaseExplorer = ({ hardiness }) => {
  const [assoAndStatus, setAssoAndStatus] = useState({})

  const [materials, setMaterials] = useState([])
  const [species, setSpecies] = useState([])

  const [associationsToDisplay, setAssociationsToDisplay] = useState([])

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
        const assoAndStatus = associations.map(item => {
          return {
            association: item,
            selected: true,
          }
        })
        setAssoAndStatus(assoAndStatus)

        // build an array of all species
        const species = associations.reduce(
          (unique, item) =>
            unique.some(species => species.name === item.species_name)
              ? unique
              : [...unique, { name: item.species_name, selected: true }],
          []
        )
        setSpecies(species)

        // build an array of all materials
        const materials = associations.reduce(
          (unique, item) =>
            unique.some(material => material.name === item.material_name)
              ? unique
              : [...unique, { name: item.material_name, selected: true }],
          []
        )
        setMaterials(materials)

        //group associations by species
        const groupedAssociations = groupBySpecies(assoAndStatus)
        setAssociationsToDisplay(groupedAssociations)
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
          {species.map((item, i) => {
            return (
              <div
                key={i}
                className={item.selected ? `${styles.explorerMenuText} ${styles.selected}` : styles.explorerMenuText}
                onClick={() => {
                  //update species list with new selected status
                  setSpecies(toggleSelected(species, i))
                  //update associations list with selected status
                  const updatedAssoStatus = toggleStatusForSpecies(item, assoAndStatus, !item.selected)
                  setAssoAndStatus(updatedAssoStatus)
                  //compute new association to display
                  setAssociationsToDisplay(groupBySpecies(updatedAssoStatus))
                  //update material status
                  const updatedMaterials = updateMaterialsStatus(materials, updatedAssoStatus)
                  setMaterials(updatedMaterials)
                }}
              >
                {item.name}
              </div>
            )
          })}
        </aside>

        <main>
          {Object.entries(associationsToDisplay).map(([key, value], index) => {
            return (
              <div key={index}>
                <div className={styles.gridTitle}>{key}</div>
                <div className={styles.materialGrid}>
                  {value.map((item, index) => {
                    return (
                      <div key={index} className={styles.gridItem}>
                        <img src={item.imageUrl} />
                        <div>{item.material}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </main>

        <aside className={styles.explorerRightMenu}>
          <div className={styles.explorerMenuTitle}>materials</div>
          {materials.map((item, index) => (
            <div
              key={index}
              className={item.selected ? `${styles.explorerMenuText} ${styles.selected}` : styles.explorerMenuText}
              onClick={() => {
                //update material list with new selected status
                setMaterials(toggleSelected(materials, index))
                //update associations list with selected status
                const updatedAssoStatus = toggleStatusForMaterial(item, assoAndStatus, !item.selected)
                setAssoAndStatus(updatedAssoStatus)
                //compute new association to display
                setAssociationsToDisplay(groupBySpecies(updatedAssoStatus))
                //update species status
                const updatedSpecies = updateSpeciesStatus(species, updatedAssoStatus)
                setSpecies(updatedSpecies)
              }}
            >
              {item.name}
            </div>
          ))}
        </aside>
      </div>
    </div>
  )
}

export default DatabaseExplorer
