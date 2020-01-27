import React, {useState, useEffect} from 'react'
import SVG from 'react-inlinesvg';
import axios from 'axios'
import image from "@/images/plants.svg";

const Schema = (props) => {
    const [data, setData] = useState(null);
    const baseUrl = 'http://localhost:3001/api';

    useEffect(() => {
        const fetchSchema = async () => {
            if (props.searchItem.item && props.searchItem.itemType === "SEARCH_SPECIES") {
                const response = await axios(`${baseUrl}/species/schema/${props.searchItem.item.uid}`);
                console.log(response);
                setData(response.data);
            }
        };
        fetchSchema();
    }, [props]);

    return (
        <div className="outline bg-white pv4">
            {data &&
                <SVG src={image} />
            }
        </div>
    );
}

export default Schema