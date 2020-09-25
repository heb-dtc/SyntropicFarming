import { BASE_URL } from './api'

export const groupBySelectedSpecies = (array) => {
  return array.reduce((accumulator, item) => {
    const { selected } = item

    if (selected) {
      const { association } = item

      const key = association.species_name
      if (!accumulator[key]) {
        accumulator[key] = []
      }
      accumulator[key].push({
        material: association.material_name,
        imageUrl: `${BASE_URL}/${association.image_url}`,
        link: association.link,
      })
    }
    return accumulator
  }, {})
}

// build the associations that can be displayed, grouped by species
export const buildDisplayList = (models) => {
  return groupBySelectedSpecies(models)
}

export const updateModelsWithItemStatus = (models, item, status) => {
  return models.map((model) => {
    if (model.association.species_name === item.name || model.association.material_name === item.name) {
      return {
        ...model,
        selected: status,
      }
    }
    return model
  })
}

export const updateItemsStatusFromModels = (itemModels, associationModels) => {
  return itemModels.map((item) => {
    let updatedItem = {
      ...item,
      selected: false,
    }

    associationModels.forEach((model) => {
      if (model.association.material_name === item.name || model.association.species_name === item.name) {
        if (model.selected) {
          updatedItem = {
            ...item,
            selected: true,
          }
        }
      }
    })
    return updatedItem
  })
}

// update material selected status according to selected associations
// setting to false by default and switching back to true if finding one selected association
export const updateMaterialsStatus = (materials, associations) => {
  return materials.map((material) => {
    let updatedMaterial = {
      ...material,
      selected: false,
    }
    associations.forEach((item) => {
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
  return speciesList.map((species) => {
    let updatedSpecies = {
      ...species,
      selected: false,
    }
    associations.forEach((item) => {
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
