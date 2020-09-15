import { groupBySelectedSpecies, updateModelsWithItemStatus, updateItemsStatusFromModels } from './explorer.js'

const createAssociationModel = (species, material, imageUrl, link, selected) => ({
  association: {
    species_name: species,
    material_name: material,
    image_url: imageUrl,
    link,
  },
  selected,
})

describe('Library explorer data tests', () => {
  it('associations are grouped by selected models only', () => {
    const models = [
      createAssociationModel('corn', 'wood', 'http://image.png', 'http://info.html', true),
      createAssociationModel('corn', 'wood', 'http://image.png', 'http://info.html', true),
      createAssociationModel('abaca', 'wood', 'http://image.png', 'http://info.html', true),
      createAssociationModel('abaca', 'wood', 'http://image.png', 'http://info.html', true),
      createAssociationModel('colza', 'wood', 'http://image.png', 'http://info.html', false),
      createAssociationModel('banana', 'wood', 'http://image.png', 'http://info.html', true),
      createAssociationModel('corn', 'wood', 'http://image.png', 'http://info.html', true),
      createAssociationModel('corn', 'wood', 'http://image.png', 'http://info.html', true),
      createAssociationModel('corn', 'wood', 'http://image.png', 'http://info.html', false),
    ]

    const groupedAssociations = groupBySelectedSpecies(models)

    expect(groupedAssociations.corn).toHaveLength(4)
    expect(groupedAssociations.abaca).toHaveLength(2)
    expect(groupedAssociations.banana).toHaveLength(1)
    expect(groupedAssociations.colzar).toBeUndefined()
  })

  it('material item status is set on all matching models', () => {
    const models = [
      createAssociationModel('corn', 'wood', 'http://image.png', 'http://info.html', true),
      createAssociationModel('corn', 'paper', 'http://image.png', 'http://info.html', true),
      createAssociationModel('abaca', 'wood', 'http://image.png', 'http://info.html', true),
      createAssociationModel('abaca', 'timber', 'http://image.png', 'http://info.html', true),
      createAssociationModel('banana', 'dye', 'http://image.png', 'http://info.html', true),
      createAssociationModel('corn', 'wood', 'http://image.png', 'http://info.html', true),
      createAssociationModel('corn', 'veneer', 'http://image.png', 'http://info.html', false),
    ]

    const materialItem = {
      name: 'wood',
    }
    const updatedModels = updateModelsWithItemStatus(models, materialItem, false)

    // all wood models are now set to selected false
    expect(models[0].selected).toBeFalse
    expect(models[2].selected).toBeFalse
    expect(models[5].selected).toBeFalse

    // all other models are left untouched
    expect(models[1].selected).toBeTrue
    expect(models[3].selected).toBeTrue
    expect(models[4].selected).toBeTrue
    expect(models[6].selected).toBeFalse
  })

  it('species item status is set on all matching models', () => {
    const models = [
      createAssociationModel('corn', 'wood', 'http://image.png', 'http://info.html', true),
      createAssociationModel('corn', 'paper', 'http://image.png', 'http://info.html', true),
      createAssociationModel('abaca', 'wood', 'http://image.png', 'http://info.html', true),
      createAssociationModel('abaca', 'timber', 'http://image.png', 'http://info.html', true),
      createAssociationModel('banana', 'dye', 'http://image.png', 'http://info.html', true),
      createAssociationModel('corn', 'wood', 'http://image.png', 'http://info.html', true),
      createAssociationModel('corn', 'veneer', 'http://image.png', 'http://info.html', false),
    ]

    const speciesItem = {
      name: 'corn',
    }
    const updatedModels = updateModelsWithItemStatus(models, speciesItem, false)

    // all wood models are now set to selected false
    expect(models[0].selected).toBeFalse
    expect(models[1].selected).toBeFalse
    expect(models[5].selected).toBeFalse
    expect(models[6].selected).toBeFalse

    // all other models are left untouched
    expect(models[2].selected).toBeTrue
    expect(models[3].selected).toBeTrue
    expect(models[4].selected).toBeTrue
  })

  it('species items status are updated according to models', () => {
    const associationModels = [
      createAssociationModel('corn', 'wood', 'http://image.png', 'http://info.html', true),
      createAssociationModel('avocado', 'paper', 'http://image.png', 'http://info.html', true),
      createAssociationModel('abaca', 'wood', 'http://image.png', 'http://info.html', false),
      createAssociationModel('abaca', 'timber', 'http://image.png', 'http://info.html', false),
      createAssociationModel('banana', 'dye', 'http://image.png', 'http://info.html', true),
      createAssociationModel('corn', 'dye', 'http://image.png', 'http://info.html', true),
      createAssociationModel('corn', 'veneer', 'http://image.png', 'http://info.html', true),
      createAssociationModel('sisal', 'veneer', 'http://image.png', 'http://info.html', false),
      createAssociationModel('avocado', 'veneer', 'http://image.png', 'http://info.html', false),
    ]

    const itemModels = [
      { name: 'corn', selected: true },
      { name: 'abaca', selected: true },
      { name: 'banana', selected: false },
      { name: 'avocado', selected: true },
      { name: 'sisal', selected: false },
    ]

    const updatedModels = updateItemsStatusFromModels(itemModels, associationModels)

    expect(updatedModels[0].selected).toBeTrue
    expect(updatedModels[1].selected).toBeFalse
    expect(updatedModels[2].selected).toBeTrue
    expect(updatedModels[3].selected).toBeFalse
    expect(updatedModels[4].selected).toBeFalse
  })

  it('material items status are updated according to models', () => {
    const associationModels = [
      createAssociationModel('corn', 'wood', 'http://image.png', 'http://info.html', true),
      createAssociationModel('avocado', 'paper', 'http://image.png', 'http://info.html', true),
      createAssociationModel('abaca', 'wood', 'http://image.png', 'http://info.html', false),
      createAssociationModel('abaca', 'timber', 'http://image.png', 'http://info.html', false),
      createAssociationModel('banana', 'dye', 'http://image.png', 'http://info.html', false),
      createAssociationModel('corn', 'dye', 'http://image.png', 'http://info.html', true),
      createAssociationModel('corn', 'veneer', 'http://image.png', 'http://info.html', false),
      createAssociationModel('sisal', 'veneer', 'http://image.png', 'http://info.html', false),
      createAssociationModel('avocado', 'veneer', 'http://image.png', 'http://info.html', false),
    ]

    const itemModels = [
      { name: 'wood', selected: true },
      { name: 'paper', selected: true },
      { name: 'timber', selected: true },
      { name: 'veneer', selected: true },
      { name: 'dye', selected: false },
    ]

    const updatedModels = updateItemsStatusFromModels(itemModels, associationModels)

    expect(updatedModels[0].selected).toBeTrue
    expect(updatedModels[1].selected).toBeTrue
    expect(updatedModels[2].selected).toBeFalse
    expect(updatedModels[3].selected).toBeFalse
    expect(updatedModels[4].selected).toBeTrue
  })
})
