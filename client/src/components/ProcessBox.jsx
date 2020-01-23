import React, {useState} from "react";
import Box from './Box'

const ProcessBox = () => {
    const [items, setItems] = useState([]);

    return (
        <Box title={'processes'} itemsEndpoint={'processes'} setItems={(items) => setItems(items)}>
            <div>
                {
                    items.map(item => {
                        return <div>{item.process}</div>
                    })
                }
            </div>
        </Box>
    );
}

export default ProcessBox