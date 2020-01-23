import React, {useState} from "react";
import Box from './Box'

const MaterialBox = () => {
    const [items, setItems] = useState([]);

    return (
        <Box title={'materials'} itemsEndpoint={'materials'} setItems={(items) => setItems(items)}>
            <div>
                {
                    items.map(item => {
                        return <div>{item.material}</div>
                    })
                }
            </div>
        </Box>
    );
}

export default MaterialBox