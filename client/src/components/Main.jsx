import React, { useState, useEffect } from "react";
import axios from 'axios';
import Box from './Box'

function Main() {
      return (
          <div className="mw9 center ph3-ns">

            <div className="cf ph2-ns">
              <div className="fl w-third-ns pa2">
                <Box title={'species'} itemsEndpoint={'species'}/>
                <Box title={'processes'} itemsEndpoint={'processes'}/>
                <Box title={'materials'} itemsEndpoint={'materials'}/>
                <Box title={'locations'} itemsEndpoint={'locations'}/>
              </div>

              <div className="fl w-100 w-third-ns pa2">
                <div className="outline bg-white pv4"></div>
              </div>

              <div className="fl w-100 w-third-ns pa2">
                <div className="outline bg-white pv4"></div>
              </div>

            </div>
          </div>
        );
}

export default Main
