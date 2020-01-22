import React, { useState, useEffect } from "react";
import axios from 'axios';

function Box(props) {
    const [showItems, setShowItems] = useState(false);
    const [items, setItems] = useState([]);
    const baseUrl = 'http://localhost:3001/api';

        useEffect(() => {
            const fetchItems = async () => {
                const response = await axios(`${baseUrl}/${props.itemsEndpoint}`);
                setItems(response.data);
            };
            fetchItems();
        }, []);

    return (
        <div>
            <div className="outline bg-white pv4 center" onClick={() => setShowItems(!showItems)}>
            {
                props.title
            }
            </div>
            { showItems &&
                <div>
                {
                    items.map(item => {return <div>{item.species}</div>})
                }
                </div>
            }
        </div>
    );
}

export default Box