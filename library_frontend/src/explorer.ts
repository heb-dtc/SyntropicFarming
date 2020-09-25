import { BASE_URL } from './api'
import { AssociationModel, MenuItemModel, DisplayRow } from '@/models'

export const groupBySelectedSpecies = (array: Array<AssociationModel>): Array<DisplayRow> => {
  return array.reduce((accumulator, item: AssociationModel) => {
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
  }, [])
}

// build the associations that can be displayed, grouped by species
export const buildDisplayList = (models: Array<AssociationModel>): Array<DisplayRow> => {
  return groupBySelectedSpecies(models)
}

export const updateModelsWithItemStatus = (
  models: Array<AssociationModel>,
  item: MenuItemModel,
  status: boolean
): Array<AssociationModel> => {
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

export const updateItemsStatusFromModels = (
  itemModels: Array<MenuItemModel>,
  associationModels: Array<AssociationModel>
): Array<MenuItemModel> => {
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
