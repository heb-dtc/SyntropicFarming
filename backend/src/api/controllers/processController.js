const { processRepository } = require('../../repository')

function getProcesses(req, res) {
    processRepository.getAllProcesses()
        .then((rows) => {
            res.send(rows);
        })
}

module.exports = {
    getProcesses
}

