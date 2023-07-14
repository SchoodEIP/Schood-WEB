import React from "react";
import "../../css/Components/Popup/Popup.css";
export default function Popup(props) {
    return (
        <div id="popup-box">
            <div id="p-box">
                {props.content}
            </div>
        </div>
    )
}