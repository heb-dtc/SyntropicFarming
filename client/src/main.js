import React from "react";
import ReactDOM from "react-dom";
import Main from "@/components/Main";
import  "./style.css";

ReactDOM.render(<Main/>, document.getElementById('app'));

if (module.hot) {
    module.hot.accept();
}

