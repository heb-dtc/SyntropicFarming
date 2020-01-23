import React from "react";
import SpeciesBox from './SpeciesBox'
import ProcessBox from './ProcessBox'
import MaterialBox from './MaterialBox'
import ClimateBox from './ClimateBox'

export const SearchContext = React.createContext();
const initialState = {
    item: null,
};

const reducer = (state, action) => {
    switch (action.type) {
        case "SEARCH_SPECIES":
            return {
                ...state,
                item: action.payload
            };
        case "CLEAR_SEARCH":
            return {
                ...state,
                item: null
            };
        default:
            return state;
    }
};

function Main() {
    const [state, dispatch] = React.useReducer(reducer, initialState);

    return (
        <SearchContext.Provider value={{
            state,
            dispatch
        }}>
            <div className="mw9 center ph3-ns">

                <div className="cf ph2-ns">

                    <div className="fl w-20 pa2 tc">
                        <SpeciesBox/>
                        <ProcessBox/>
                        <MaterialBox/>
                        <ClimateBox/>
                    </div>

                    <div className="fl w-60 pa2">
                        <div className="outline bg-white pv4"></div>
                    </div>

                    <div className="fl w-20 pa2">
                        <div className="outline bg-white pv4"></div>
                    </div>

                </div>
            </div>
        </SearchContext.Provider>
    );
}

export default Main
