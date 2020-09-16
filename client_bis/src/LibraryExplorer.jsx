import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { fetchAssociations } from '@/api'
import { buildDisplayList, updateItemsStatusFromModels, updateModelsWithItemStatus } from '@/explorer'
import styles from '@/style.css'

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

const LibraryExplorer = ({ hardinessValues, hardiness, onChangeHardiness }) => {
  const [associationModels, updateAssociationModels] = useState({})
  const [materialModels, updateMaterialModels] = useState([])
  const [speciesModels, updateSpeciesModels] = useState([])
  const [associationDisplayList, updateAssociationDisplayList] = useState([])

  useEffect(() => {
    const fetchValues = async () => {
      const associations = await fetchAssociations(hardiness)

      if (associations != null) {
        // build array of all associations
        const associationModelList = associations.map((item) => {
          return {
            association: item,
            selected: true,
          }
        })
        updateAssociationModels(associationModelList)

        // build an array of all species
        const speciesModelList = associations.reduce(
          (unique, item) =>
            unique.some((species) => species.name === item.species_name)
              ? unique
              : [...unique, { name: item.species_name, selected: true }],
          []
        )
        updateSpeciesModels(speciesModelList)

        // build an array of all materials
        const materialModelList = associations.reduce(
          (unique, item) =>
            unique.some((material) => material.name === item.material_name)
              ? unique
              : [...unique, { name: item.material_name, selected: true }],
          []
        )
        updateMaterialModels(materialModelList)

        // build array of associations to display
        const displayList = buildDisplayList(associationModelList)
        updateAssociationDisplayList(displayList)
      } else {
        updateAssociationModels({})
        updateSpeciesModels([])
        updateMaterialModels([])
        updateAssociationDisplayList({})
      }
    }
    fetchValues()
  }, [hardiness])

  return (
    <div className={styles.explorer}>
      <ul className={styles.explorerNavigationBar}>
        <li className={styles.navigationBarTitle}>Hardiness zone</li>
        <li>
          <select
            className={styles.select}
            value={hardiness}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10)
              onChangeHardiness(value)
            }}
          >
            <option value={0}>All</option>
            {hardinessValues.map((item) => (
              <option key={item.id} value={item.value}>
                {item.value}
              </option>
            ))}
          </select>
        </li>
      </ul>
      <div className={styles.explorerContainer}>
        <aside className={styles.explorerLeftMenu}>
          <div className={styles.explorerMenuTitle}>species</div>
          {speciesModels.map((item, i) => {
            return (
              <div
                key={i}
                className={item.selected ? `${styles.explorerMenuText} ${styles.selected}` : styles.explorerMenuText}
                onClick={() => {
                  // toggle species item status
                  updateSpeciesModels(toggleSelected(speciesModels, i))
                  // update all association models matching species to new status
                  const models = updateModelsWithItemStatus(associationModels, item, !item.selected)
                  updateAssociationModels(models)
                  // check if any material item status should change and update if needed
                  const updatedMaterialModels = updateItemsStatusFromModels(materialModels, models)
                  updateMaterialModels(updatedMaterialModels)
                  // re-compute the association display list
                  updateAssociationDisplayList(buildDisplayList(models))
                }}
              >
                {item.name}
              </div>
            )
          })}
        </aside>

        <main>
          {Object.entries(associationDisplayList).map(([key, value], index) => {
            return (
              <div key={index}>
                <div className={styles.gridTitle}>{key}</div>
                <div className={styles.materialGrid}>
                  {value.map((item, i) => {
                    return (
                      <div key={i} className={styles.gridItem}>
                        <a href={item.link} target="_blank" rel="noreferrer">
                          <img class={styles.explorerImage} src={item.imageUrl} alt={value} />
                        </a>
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
          {materialModels.map((item, index) => (
            <div
              key={index}
              className={item.selected ? `${styles.explorerMenuText} ${styles.selected}` : styles.explorerMenuText}
              onClick={() => {
                // toggle material item status
                updateMaterialModels(toggleSelected(materialModels, index))
                // update all association models matching material to new status
                const models = updateModelsWithItemStatus(associationModels, item, !item.selected)
                updateAssociationModels(models)
                // check if any species item status should change and update if needed
                const updatedSpeciesModels = updateItemsStatusFromModels(speciesModels, models)
                updateSpeciesModels(updatedSpeciesModels)
                // re-compute the association display list
                updateAssociationDisplayList(buildDisplayList(models))
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

LibraryExplorer.propTypes = {
  hardinessValues: PropTypes.arrayOf(PropTypes.number).isRequired,
  hardiness: PropTypes.number.isRequired,
  onChangeHardiness: PropTypes.func.isRequired,
}

export default LibraryExplorer
