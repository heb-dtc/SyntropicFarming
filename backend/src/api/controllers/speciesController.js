const { speciesRepository } = require('../../repository')

function getSpecies(req, res) {
    speciesRepository.getAllSpecies()
        .then((rows) => {
            res.send(rows);
        })
}

module.exports = {
    getSpecies
}

