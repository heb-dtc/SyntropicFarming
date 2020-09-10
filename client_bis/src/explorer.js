const findSpecies = (associations, species) => {
  const item = Object.entries(associations).find(([key, value]) => key.name === species.name)
  return item.material
}

export const groupBySpecies = array => {
  return array.reduce((accumulator, item) => {
    const selected = item['selected']

    if (selected) {
      const association = item['association']

      let key = association['species_name']
      if (!accumulator[key]) {
        accumulator[key] = []
      }
      accumulator[key].push({
        material: association.material_name,
        imageUrl: `https://syntropic-api.hebus.net/${association.image_url}`,
      })
    }
    return accumulator
  }, {})
}

export const toggleStatusForSpecies = (species, associations, selected) => {
  return associations.map(item => {
    if (item.association.species_name === species.name) {
      return {
        ...item,
        selected: selected,
      }
    }
    return item
  })
}

export const toggleStatusForMaterial = (material, associations, selected) => {
  return associations.map(item => {
    if (item.association.material_name === material.name) {
      return {
        ...item,
        selected: selected,
      }
    }
    return item
  })
}

// update material selected status according to selected associations
// setting to false by default and switching back to true if finding one selected association
export const updateMaterialsStatus = (materials, associations) => {
  return materials.map(material => {
    let updatedMaterial = {
      ...material,
      selected: false
    }
    associations.map(item => {
      if (item.association.material_name === material.name) {
        if (item.selected) {
          updatedMaterial = {
            ...material,
            selected: true,
          }
        }
      }
    })
    return updatedMaterial
  })
}

// update species selected status according to selected associations
// setting to false by default and switching back to true if finding one selected association
export const updateSpeciesStatus = (speciesList, associations) => {
  return speciesList.map(species => {
    let updatedSpecies = {
      ...species,
      selected: false
    }
    associations.map(item => {
      if (item.association.species_name === species.name) {
        if (item.selected) {
          updatedSpecies = {
            ...species,
            selected: true,
          }
        }
      }
    })
    return updatedSpecies
  })
}

const hasSpecies = (associations, species) => {
  return Object.entries(associations).some(([key, value]) => key === species.name)
}

export const updateSpeciesSelectedStatus = (speciesList, associations) => {
  return speciesList.map(species => {
    if (hasSpecies(associations, species)) {
      return { ...species, selected: false }
    } else {
      return { ...species, selected: false }
    }
  })
}
