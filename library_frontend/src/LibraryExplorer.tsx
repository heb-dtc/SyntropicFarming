import React, { useState, useEffect } from 'react'
import { fetchAssociations } from '@/api'
import { buildDisplayList, updateItemsStatusFromModels, updateModelsWithItemStatus } from '@/explorer'
import { Hardiness } from '@/models'
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

const LibraryExplorer: React.FC<LibExpProps> = ({ hardinessValues, hardiness, onChangeHardiness }) => {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth)
  const [associationModels, updateAssociationModels] = useState([])
  const [materialModels, updateMaterialModels] = useState([])
  const [speciesModels, updateSpeciesModels] = useState([])
  const [associationDisplayList, updateAssociationDisplayList] = useState([])
  const [speciesMenuVisible, switchSpeciesMenuVisibility] = useState(false)
  const [materialsMenuVisible, switchMaterialsMenuVisibility] = useState(false)

  useEffect(() => {
    const handleWindowResize = () => setScreenWidth(window.innerWidth)
    window.addEventListener("resize", handleWindowResize)

    return () => window.removeEventListener("resize", handleWindowResize)
  }, [])

  useEffect(() => {
    const fetchValues = async () => {
      const associations = await fetchAssociations(hardiness)

      if (associations != null) {
        // build array of all associations
        const associationModelList = associations.map(item => {
          return {
            association: item,
            selected: true,
          }
        })
        updateAssociationModels(associationModelList)

        // build an array of all species
        const speciesModelList = associations.reduce(
          (unique, item) =>
            unique.some(species => species.name === item.species_name)
              ? unique
              : [...unique, { name: item.species_name, selected: true }],
          []
        )
        updateSpeciesModels(speciesModelList)

        // build an array of all materials
        const materialModelList = associations.reduce(
          (unique, item) =>
            unique.some(material => material.name === item.material_name)
              ? unique
              : [...unique, { name: item.material_name, selected: true }],
          []
        )
        updateMaterialModels(materialModelList)

        // build array of associations to display
        const displayList = buildDisplayList(associationModelList)
        updateAssociationDisplayList(displayList)
      } else {
        updateAssociationModels([])
        updateSpeciesModels([])
        updateMaterialModels([])
        updateAssociationDisplayList([])
      }
    }
    fetchValues()
  }, [hardiness])

  return (
    <div className={styles['pageContainer']}>
      <ul className={styles['explorerNavBar']}>
        <li className={styles['navigationBarTitle']}>Hardiness zone</li>
        <li>
          <select
            className={styles['select']}
            value={hardiness}
            onChange={e => {
              const value = parseInt(e.target.value, 10)
              onChangeHardiness(value)
            }}
          >
            <option value={0}>ALL</option>
            {hardinessValues.map((item) => (
              <option key={item.id} value={item.value}>
                {item.value}
              </option>
            ))}
          </select>
        </li>
      </ul>
      <div className={styles['explorerContainer']}>
        <aside className={`${styles['explorerMenu']} ${styles['leftMenu']} ${styles['scrollContainer']}`}>
          <div
            className={styles['explorerMenuTitle']}
            onClick={() => {
              if (screenWidth < 768) {
                const visible = !speciesMenuVisible
                switchSpeciesMenuVisibility(visible)
              }
            }}
          >
            {screenWidth > 768  ? 'species' : speciesMenuVisible ? 'species' : 'S'}
          </div>
          <div className={speciesMenuVisible ? styles['visibleItem'] : styles['hiddenItem']}>
            {speciesModels.map((item, i) => {
              return (
                <div
                  key={i}
                  className={
                    item.selected ? `${styles['explorerMenuText']} ${styles['selected']}` : styles['explorerMenuText']
                  }
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
          </div>
        </aside>

        <main className={styles['scrollContainer']}>
          {Object.entries(associationDisplayList).map(([key, value], index) => {
            return (
              <div key={index}>
                <div className={styles['gridTitle']}>{key}</div>
                <div className={styles['grid']}>
                  {value.map((item, i) => {
                    return (
                      <div key={i} className={styles['gridItem']}>
                        <a href={item.link} target="_blank" rel="noreferrer">
                          <img className={styles['explorerImage']} src={item.imageUrl} alt={value} />
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

        <aside className={`${styles['explorerMenu']} ${styles['rightMenu']} ${styles['scrollContainer']}`}>
          <div
            className={styles['explorerMenuTitle']}
            onClick={() => {
              if (screenWidth < 768) {
                const visible = !materialsMenuVisible
                switchMaterialsMenuVisibility(visible)
              }
            }}
          >
            {screenWidth > 768  ? 'materials' : materialsMenuVisible ? 'materials' : 'M'}
          </div>
          <div className={materialsMenuVisible ? styles['visibleItem'] : styles['hiddenItem']}>
            {materialModels.map((item, index) => (
              <div
                key={index}
                className={
                  item.selected ? `${styles['explorerMenuText']} ${styles['selected']}` : styles['explorerMenuText']
                }
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
          </div>
        </aside>
      </div>
    </div>
  )
}

interface LibExpProps {
  hardinessValues: Array<Hardiness>
  hardiness: number
  onChangeHardiness: (value: number) => void
}

export default LibraryExplorer
