import React, { useState, useEffect } from "react";
import axios from 'axios';

function Main() {
    const [speciesItems, setSpeciesItems] = useState([]);

    useEffect(() => {
        const fetchSpecies = async () => {
          const response = await axios(`http://localhost:3001/api/species`);
          setSpeciesItems(response.data);
        };
        fetchSpecies();
      }, []);

      return (
          <div>
            {speciesItems && speciesItems.length
              ? speciesItems.length
              : 'No species found'
            }
          </div>
        );
}

export default Main
