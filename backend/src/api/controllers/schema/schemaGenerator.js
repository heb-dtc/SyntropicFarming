const {buildTree} = require('./treeBuilder')
const {writeSvg} = require('./svgWriter')

const generateSchema = (json) => {
    const tree = buildTree(json)
    return writeSvg(tree)
}

module.exports = {
    generateSchema
}