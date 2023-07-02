import React from "react";
import "../../css/Components/Popup/Popup.css";
export default function Popup(props) {
    return (
        <div id="popup-box">
            <div id="p-box">
                <button className="btn-close" onClick={props.handleClose}>x</button>
                {props.content}
            </div>
        </div>
    )
}