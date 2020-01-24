import React from "react";
import SpeciesBox from '@/components/SpeciesBox'
import ProcessBox from '@/components/ProcessBox'
import MaterialBox from '@/components/MaterialBox'
import ClimateBox from '@/components/ClimateBox'
import Schema from '@/components/schema/Schema'

export const SearchContext = React.createContext();
const initialState = {
    item: null,
    itemType: ''
};

const reducer = (state, action) => {
    switch (action.type) {
        case "SEARCH_SPECIES":
            return {
                ...state,
                item: action.payload,
                itemType: action.type
            };
        case "CLEAR_SEARCH":
            return {
                ...state,
                item: null,
                itemType: ''
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
                        <p>your search</p>
                        <SpeciesBox/>
                        <ProcessBox/>
                        <MaterialBox/>
                        <ClimateBox/>
                    </div>

                    <div className="fl w-60 pa2">
                        <p className="tc" onClick={() => dispatch({
                            type: "CLEAR_SEARCH"
                        })}>clear search</p>
                        <Schema searchItem={state}/>
                    </div>

                    <div className="fl w-20 pa2 tc">
                        <p>connections</p>
                    </div>

                </div>
            </div>
        </SearchContext.Provider>
    );
}

export default Main
