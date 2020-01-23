import React, {useState} from "react";
import Box from './Box'

const SpeciesBox = () => {
    const [items, setItems] = useState([]);

    return (
        <Box title={'species'} itemsEndpoint={'species'} setItems={(items) => setItems(items)}>
            <div>
                {
                    items.map(item => {
                        return <div>{item.species}</div>
                    })
                }
            </div>
        </Box>
    );
}

export default SpeciesBox