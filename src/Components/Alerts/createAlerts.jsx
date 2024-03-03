import React, { useEffect, useState, useRef } from 'react';
import '../../css/pages/createAlerts.scss';

const AlertPage = () => {
  const [userRoles, setUserRoles] = useState([]);
  const [userClasses, setUserClasses] = useState([]);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [role, setRole] = useState('');
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [file, setFile] = useState({});
  const [isClass, setIsClass] = useState(false);
  const [alertResponse, setAlertResponse] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Requête GET : récupération de la liste des types d’utilisateurs
    fetch(`${process.env.REACT_APP_BACKEND_URL}/adm/rolesList`, {
      method: 'GET',
      headers: {
        'x-auth-token': sessionStorage.getItem('token'),
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setRole(data.roles[0]._id);
        setUserRoles(data.roles);
      })
      .catch((error) => {
        setAlertResponse('Erreur lors de la récupération des roles');
      });

    // Requête GET : récupération des classes dont l’utilisateur est en charge
    fetch(`${process.env.REACT_APP_BACKEND_URL}/adm/classes`, {
      method: 'GET',
      headers: {
        'x-auth-token': sessionStorage.getItem('token'),
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => setUserClasses(data))
      .catch((error) => {
        setAlertResponse('Erreur lors de la récupération des classes');
      });
  }, []);

  const handleAlertSubmit = () => {
    // Requête POST: envoyer l’alerte
    const data = {
      title,
      message,
      role: !isClass ? role : null,
      classes: isClass ? selectedClasses : [],
    };

    const fileData = new FormData();
    if (file) {
      fileData.append('file', file);
    }

    fetch(`${process.env.REACT_APP_BACKEND_URL}/shared/alert`, {
      method: 'POST',
      headers: {
        'x-auth-token': sessionStorage.getItem('token'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((responseData) => {
        if (file) {
          // Si un fichier est joint, envoyer le fichier avec l'ID de l'alerte
          const fileId = responseData._id
          return fetch(`${process.env.REACT_APP_BACKEND_URL}/shared/alert/file/${responseData._id}`, {
            method: 'POST',
            headers: {
              'x-auth-token': sessionStorage.getItem('token'),
            },
            body: fileData,
          });
        }
        return Promise.resolve()
      })
      .then(() => {
        console.log('File uploaded successfully')
        let successMessage = file ? 'Alerte et fichier envoyés avec succès' : 'Alerte envoyée avec succès';
        setAlertResponse(successMessage);
        setShowPopup(true);
        resetForm();
      })
      .catch((error) => {
        setAlertResponse(`Erreur lors de l'envoi de l'alerte : ${error.message}`);
        setShowPopup(true);
      });
  };

  const resetForm = () => {
    setTitle('');
    setMessage('');
    setRole('');
    setSelectedClasses([]);
    setIsClass(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    setTimeout(() => {
      setAlertResponse('');
      setShowPopup(false);
    }, 3000); // Réinitialiser le message et masquer la popup après 3 secondes
  };

  const handleAlertType = () => {
    const rolesContainer = document.getElementById('roles-container');
    const classesContainer = document.getElementById('classes-container');
    if (isClass) {
      classesContainer.style.display = 'none';
      rolesContainer.style.display = 'flex';
      setIsClass(false);
    } else {
      classesContainer.style.display = 'flex';
      rolesContainer.style.display = 'none';
      setIsClass(true);
    }
  };

  return (
    <div className='alert-page'>
      <h1 id='alert-title'>Créer une alerte</h1>

      {sessionStorage.getItem('role') === 'teacher' ? null : (
        <div>
          <button className={!isClass ? 'no-interaction-btn' : ''} onClick={handleAlertType}>
            Rôles
          </button>
          <button className={isClass ? 'no-interaction-btn' : ''} onClick={handleAlertType}>
            Classes
          </button>
        </div>
      )}
      <div id='roles-container' data-testid='roles-container'>
        <label htmlFor='roles-select'>Type d'utilisateur visé:</label>
        <select className='alert-page-box' data-testid='roles-select' id='roles-select' onChange={(e) => setRole(e.target.value)}>
          {userRoles.map((role, index) => (
            <option key={index} value={role._id}>
              {role.name}
            </option>
          ))}
        </select>
      </div>

      {sessionStorage.getItem('role') === 'teacher' ? null : (
        <div id='classes-container' data-testid='classes-container'>
          <label htmlFor='classes-select'>Classes:</label>
          <div id='classes-select' className='checkbox-list'>
            {userClasses.map((classe, index) => (
              <div key={index} className='checkbox-item'>
                <input
                  className='alert-page-box'
                  type='checkbox'
                  id={`class-check-${index}`}
                  data-testid={`class-check-${index}`}
                  value={classe._id}
                  checked={selectedClasses.includes(classe._id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedClasses([...selectedClasses, classe._id]);
                    } else {
                      setSelectedClasses(selectedClasses.filter((id) => id !== classe._id));
                    }
                  }}
                />
                <label htmlFor={`class-check-${index}`}>{classe.name}</label>
              </div>
            ))}
          </div>
        </div>
      )}

      <label>Titre:</label>
      <input className='alert-page-box' data-testid='alert-title' value={title} onChange={(e) => setTitle(e.target.value)} />

      <label>Message:</label>
      <textarea className='alert-page-box' data-testid='alert-message' value={message} onChange={(e) => setMessage(e.target.value)} />

      <label>Fichier joint (optionnel):</label>
      <input ref={fileInputRef} className='alert-page-box' data-testid='alert-file-input' type='file' onChange={(e) => setFile(e.target.files[0])} />

      {showPopup && <div className='popup' onClick={() => setShowPopup(false)}>{alertResponse}</div>}
      <button className='alert-btn' onClick={handleAlertSubmit}>
        Envoyer l'alerte
      </button>
    </div>
  );
};

export default AlertPage;
