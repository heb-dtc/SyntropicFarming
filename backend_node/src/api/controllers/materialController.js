const { materialRepository } = require('../../repository')

function getMaterials(req, res) {
    materialRepository.getAll()
        .then((rows) => {
            res.send(rows);
        })
}

function addMaterial(req, res) {
    res.send({
        message: 'addMaterials called',
      });
}

module.exports = {
    getMaterials,
    addMaterial
}

