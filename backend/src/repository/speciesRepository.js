const { pool } = require('./database');

exports.getAllSpecies = async () => {
    const res = await pool.query('SELECT * from species');
    return res.rows;
}

exports.getSpeciesById = async (id) => {
    const res = await pool.query(`SELECT * from species where uid = ${id}`);
    return res.rows;
}

const buildOperationsPartTree = async (operations) => {
    //get material and process names for each operations
    const operationsPromises = operations.map(async operation => {

        let res = await pool.query('SELECT * from processes where uid = $1', [operation.process_id]);
        const process = res.rows[0]

        res = await pool.query('SELECT * from materials where uid = $1', [operation.material_id]);
        const material = res.rows[0]
        console.log(material)

        //go down the tree if material isnt final
        if (material.is_final) {
            return {
                process: process,
                material: material
            }
        } else {
            res = await buildMaterialTree(material);
            return {
                process: process,
                material: material,
                operations: res
            }
        }
    })

    return Promise.all(operationsPromises);
}

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
                process: process,
                material: material
            }
        } else {
            res = await buildMaterialTree(material);
            return {
                process: process,
                material: material,
                operations: res
            }
        }
    })

    return Promise.all(operationsPromises);
}

const buildMaterialTree = async (material) => {
    //get all processes applicable to material
    let res = await pool.query('SELECT * from material_process where input_material_id = $1', [material.uid]);
    const operations = res.rows;
    return await buildOperationsMaterialTree(operations);
}

exports.getSpeciesSchema = async (speciesId) => {
    //get specie data
    let res = await pool.query('SELECT * from species where uid = $1', [speciesId]);
    const species = res.rows[0];
    let json = {
        species: species.species
    }

    //list parts for specie
    res = await pool.query('SELECT * from parts where parts.species = $1', [speciesId]);
    const parts = res.rows;

    const promises = parts.map(async part => {
        let result = {
            part_name: part.part
        }

        //get processes applied to part
        res = await pool.query('SELECT * from part_process where part_id = $1', [part.uid]);
        const operations = res.rows;
        const operationsTree = await buildOperationsPartTree(operations)

        return {
            ...result,
            operations: operationsTree
        }
    })

    const partsTree = await Promise.all(promises);

    return {
        ...json,
        parts: partsTree
    };
}