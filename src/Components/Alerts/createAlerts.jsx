import axios from 'axios';
import React, { useEffect, useState } from 'react';
import '../../css/pages/createAlerts.scss';

const AlertPage = () => {
    const [userTypes, setUserTypes] = useState([]);
    const [userClasses, setUserClasses] = useState([
        { id: 'class1', name: 'Classe A' },
        { id: 'class2', name: 'Classe B' },
        { id: 'class3', name: 'Classe C' },
    ]);
    const [message, setMessage] = useState('');
    const [selectedUserType, setSelectedUserType] = useState('');
    const [selectedClasses, setSelectedClasses] = useState([]);
    const [file, setFile] = useState(null);
    const [questionnaires, setQuestionnaires] = useState([]);
    const [selectedQuestionnaire, setSelectedQuestionnaire] = useState('');

    useEffect(() => {
        // Requête GET : récupération de la liste des types d’utilisateurs
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/adm/rolesList`, {
            headers: {
                'x-auth-token': sessionStorage.getItem('token'),
                'Content-Type': 'application/json'
            }
        })
        .then(response => setUserTypes(response.data))
        .catch(error => console.error('Erreur lors de la récupération des types d\'utilisateurs', error.message));

        // Requête GET : récupération des classes dont l’utilisateur est en charge
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/user/all`, { // cette route n'existe pas
            headers: {
                'x-auth-token': sessionStorage.getItem('token'),
                'Content-Type': 'application/json'
            }
        })
        .then(response => setUserClasses(response.data))
        .catch(error => console.error('Erreur lors de la récupération des classes', error.message));

        // Requête GET : liste des questionnaires à venir et en cours
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/shared/questionnaire/`, {
            headers: {
                'x-auth-token': sessionStorage.getItem('token'),
                'Content-Type': 'application/json'
            }
        })
        .then(response => setQuestionnaires(response.data))
        .catch(error => console.error('Erreur lors de la récupération des questionnaires', error.message));
    }, []);

    const handleAlertSubmit = () => {
        // Requête POST: envoyer l’alerte
        const data = {
            message,
            selectedUserType,
            file,
            selectedClasses,
            selectedQuestionnaire
        };

        axios.post(`${process.env.REACT_APP_BACKEND_URL}/alerts`, data, {
            headers: {
                'x-auth-token': sessionStorage.getItem('token')
            }
        })
        .then(response => {
            console.log('Alerte envoyée avec succès', response.data);
        })
        .catch(error => console.error('Erreur lors de l\'envoi de l\'alerte', error));
    };

    return (
        <div className='alert-page'>
            <h1>Créer une alerte</h1>

            <label>Type d'utilisateur visé:</label>
            <select onChange={(e) => setSelectedUserType(e.target.value)}>
                {userTypes.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
                ))}
            </select>

            <label>Classes:</label>
                <div className="checkbox-list">
                    {userClasses.map((classe) => (
                    <div key={classe.id} className="checkbox-item">
                        <input
                        type="checkbox"
                        id={classe.id}
                        value={classe.id}
                        checked={selectedClasses.includes(classe.id)}
                        onChange={(e) => {
                            if (e.target.checked) {
                            setSelectedClasses([...selectedClasses, classe.id]);
                            } else {
                            setSelectedClasses(selectedClasses.filter((id) => id !== classe.id));
                            }
                        }}
                        />
                        <label htmlFor={classe.id}>{classe.name}</label>
                    </div>
                    ))}
                </div>

            <label>Message:</label>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} />

            <label>Fichier joint (optionnel):</label>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />

            <label>Questionnaire (optionnel):</label>
            <select onChange={(e) => setSelectedQuestionnaire(e.target.value)}>
                {questionnaires.map((questionnaire, index) => (
                    <option key={index} value={questionnaire._id}>{questionnaire.title}</option>
                ))}
            </select>
            {}

            <button onClick={handleAlertSubmit}>Envoyer l'alerte</button>
        </div>
    );
};

export default AlertPage;