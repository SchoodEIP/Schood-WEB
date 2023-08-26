import React from "react";
import "../../css/Components/Popup/Popup.css";

export default function Popup(props) {
    return (
        <div id="popup-box">
            <div id="p-box">
                <div className="pop-content">
                    <div className="pop-header">
                        <button className="btn-close" onClick={props.toggle}>x</button>
                        <h2>{props.title}</h2>
                    </div>
                    <div className='pop-body'>
                        {props.content}
                        <p>{props.errMessage}</p>
                        <button className="account-submit-btn" type="submit" onClick={props.accountCreation}>{props.btn_text}</button>
                    </div>
                </div>
            </div>
        </div>
    )
}