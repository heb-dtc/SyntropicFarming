import React, { useState, useEffect } from "react";
import axios from 'axios';
import Box from './Box'

const ClimateBox = () => {
    const [items, setItems] = useState([]);

    return (
        <Box title={'locations'} itemsEndpoint={'locations'} setItems={(items) => setItems(items)}>
            <div>
            {
                items.map(item => {return <div>{item.climate}</div>})
            }
            </div>
        </Box>
    );
}

export default ClimateBox