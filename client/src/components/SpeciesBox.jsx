import React, {useState} from "react";
import Box from './Box'
import {SearchContext} from '@/components/Main'

const SpeciesBox = () => {
    const [items, setItems] = useState([]);
    const {dispatch} = React.useContext(SearchContext);

    return (
        <Box title={'species'} itemsEndpoint={'species'} setItems={(items) => setItems(items)}>
            <div>
                {
                    items.map(item => {
                        return <div onClick={() => dispatch({
                            type: "SEARCH_SPECIES",
                            payload: item
                        })}>
                            {item.species}
                        </div>
                    })
                }
            </div>
        </Box>
    );
}

export default SpeciesBox