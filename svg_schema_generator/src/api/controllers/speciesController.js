const {generateSchema} = require('./schema/schemaGenerator')
const {speciesRepository} = require('../../repository')

function getSpecies(req, res) {
    speciesRepository.getAllSpecies()
        .then((rows) => {
            res.send(rows);
        })
}

function getSpeciesSchema(req, res) {
    speciesRepository.getSpeciesSchema(req.params.speciesId)
        .then((json) => generateSchema(json))
        .then((svg) => {
            res.setHeader('content-type', 'image/svg+xml');
            res.status(200).send(svg);
        })
}

module.exports = {
    getSpecies,
    getSpeciesSchema,
}

