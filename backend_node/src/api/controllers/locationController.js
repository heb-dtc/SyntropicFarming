const { locationRepository } = require('../../repository')

function getLocations(req, res) {
    locationRepository.getAllLocations()
        .then((rows) => {
            res.send(rows);
        })
}

module.exports = {
    getLocations
}

