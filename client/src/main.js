import React from "react";
import ReactDOM from "react-dom";
import Main from "@/components/Main";
import  "./style.scss";

ReactDOM.render(<Main/>, document.getElementById('app'));

if (module.hot) {
    module.hot.accept();
}

