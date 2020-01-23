const { speciesRepository } = require('../../repository')

function getSpecies(req, res) {
    speciesRepository.getAllSpecies()
        .then((rows) => {
            res.send(rows);
        })
}

function getSpeciesSchema(req, res) {
    speciesRepository.getSpeciesSchema(req.params.speciesId)
        .then((rows) => {
            res.send(rows);
        })
}

module.exports = {
    getSpecies,
    getSpeciesSchema,
}

