const {pool} = require('./database');

exports.getAllSpecies = async () => {
    const res = await pool.query('SELECT * from species');
    return res.rows;
}

exports.getSpeciesById = async (id) => {
    const res = await pool.query(`SELECT * from species where uid = ${id}`);
    return res.rows;
}

//TODO: clarify!
const groupBy = key => array =>
    array.reduce((objectsByKeyValue, obj) => {
        const value = obj[key];
        objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
        return objectsByKeyValue;
    }, {});

const buildOperationsMaterialTree = async (operations) => {
    //get material and process names for each operations
    const operationsPromises = operations.map(async operation => {

        let res = await pool.query('SELECT * from processes where uid = $1', [operation.process_id]);
        const process = res.rows[0]

        res = await pool.query('SELECT * from materials where uid = $1', [operation.output_material_id]);
        const material = res.rows[0]

        //go down the tree if material isnt final
        if (material.is_final) {
            return {
                data: process,
                children: Array.of({data: material})
            }
        } else {
            res = await buildMaterialTree(material);
            return {
                data: process,
                children: Array.of(res)
            }
        }
    })

    return Promise.all(operationsPromises);
}

const buildProcessTree = async (material) => {
    //get all processes applicable to material
    let res = await pool.query('SELECT * from material_process where input_material_id = $1', [material.uid]);
    const operations = res.rows;
    return await buildOperationsMaterialTree(operations);
}

const buildMaterialTree = async (material) => {
    //go down the tree if material isnt final
    if (material.is_final) {
        return {
            data: material,
        }
    } else {
        const res = await buildProcessTree(material);
        return {
            data: material,
            children: res
        }
    }
}

const buildMaterialProcessAssociationTree = async (materialProcessAssociations) => {
    //loop on all associations
    const materials = materialProcessAssociations.map(async association => {
        //get material
        let res = await pool.query('SELECT * from materials where uid = $1', [association.material_id]);
        const material = res.rows[0]
        return await buildMaterialTree(material)
    })

    return Promise.all(materials);
}

const buildPartProcessTree = async (operations) => {
    //group operations by process id
    const groupByProcess = groupBy('process_id')
    const groupedOperations = groupByProcess(operations)

    //loop on each processId
    const promises = Object.keys(groupedOperations).map(async processId => {
        //get process
        let res = await pool.query('SELECT * from processes where uid = $1', [processId]);
        const process = res.rows[0]

        //get all material resulting from that process
        const materialProcessAssociations = groupedOperations[processId];
        const materials = await buildMaterialProcessAssociationTree(materialProcessAssociations)

        return {
            data: process,
            children: materials
        }
    })

    return Promise.all(promises);
}

exports.getSpeciesSchema = async (speciesId) => {
    //get specie data
    let res = await pool.query('SELECT * from species where uid = $1', [speciesId]);
    const species = res.rows[0];

    let json = {
        data: species
    }

    //list parts for specie
    res = await pool.query('SELECT * from parts where parts.species = $1', [speciesId]);
    const parts = res.rows;

    const promises = parts.map(async (part, index) => {
        let result = {
            data: part
        }

        //get processes applied to part
        res = await pool.query('SELECT process_id, material_id from part_process where part_id = $1', [part.uid]);
        const operations = res.rows;
        const operationsTree = await buildPartProcessTree(operations)

        return {
            ...result,
            children: operationsTree
        }
    })

    const partsTree = await Promise.all(promises);

    json = {
        ...json,
        children: partsTree
    };

    console.info(JSON.stringify(json));
    return json;
}