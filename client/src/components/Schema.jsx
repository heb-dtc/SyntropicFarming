import React from 'react'

const Schema = (props) => {
    return (
        <div className="outline bg-white pv4">
        {(props.searchItem.item && props.searchItem.itemType === "SEARCH_SPECIES")  &&
            props.searchItem.item.species
        }
        </div>
    )
}

export default Schema