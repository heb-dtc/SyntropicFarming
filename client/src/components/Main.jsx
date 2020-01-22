import React, { useState, useEffect } from "react";
import axios from 'axios';
import SpeciesBox from './SpeciesBox'
import ProcessBox from './ProcessBox'
import MaterialBox from './MaterialBox'
import ClimateBox from './ClimateBox'

function Main() {
      return (
          <div className="mw9 center ph3-ns">

            <div className="cf ph2-ns">

              <div className="fl w-20 pa2 tc">
                <SpeciesBox />
                <ProcessBox />
                <MaterialBox />
                <ClimateBox />
              </div>

              <div className="fl w-60 pa2">
                <div className="outline bg-white pv4"></div>
              </div>

              <div className="fl w-20 pa2">
                <div className="outline bg-white pv4"></div>
              </div>

            </div>
          </div>
      );
}

export default Main
