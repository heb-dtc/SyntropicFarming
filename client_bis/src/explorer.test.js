import { groupBySelectedSpecies } from './explorer.js'

const createAssociation = (species, material, imageUrl, link, selected) => ({
  association: {
    species_name: species,
    material_name: material,
    image_url: imageUrl,
    link: link,
  },
  selected: selected,
})

describe('Library explorer data tests', () => {
  it('group associations by selected species', () => {
    const associations = [
      createAssociation('corn', 'wood', 'http://image.png', 'http://info.html', true),
      createAssociation('corn', 'wood', 'http://image.png', 'http://info.html', true),
      createAssociation('abaca', 'wood', 'http://image.png', 'http://info.html', true),
      createAssociation('abaca', 'wood', 'http://image.png', 'http://info.html', true),
      createAssociation('colza', 'wood', 'http://image.png', 'http://info.html', false),
      createAssociation('banana', 'wood', 'http://image.png', 'http://info.html', true),
      createAssociation('corn', 'wood', 'http://image.png', 'http://info.html', true),
      createAssociation('corn', 'wood', 'http://image.png', 'http://info.html', true),
      createAssociation('corn', 'wood', 'http://image.png', 'http://info.html', false),
    ]

    const groupedAssociations = groupBySelectedSpecies(associations)

    expect(groupedAssociations['corn']).toHaveLength(4)
    expect(groupedAssociations['abaca']).toHaveLength(2)
    expect(groupedAssociations['banana']).toHaveLength(1)
    expect(groupedAssociations['colzar']).toBeUndefined()
  })
})
