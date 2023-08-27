import {React } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/Components/Buttons/button.css';

export default function PreviousPage () {
    const navigate = useNavigate();
    const returnToPreviousPage = () => {
        navigate(-1);
    }

    return (
        <div>
            <button onClick={returnToPreviousPage} id='previous-page-btn' label="Back">Back</button>
        </div>
    );
}