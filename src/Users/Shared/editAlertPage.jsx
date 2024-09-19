import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditAlertPage = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // Utiliser useNavigate pour redirection
  const [alert, setAlert] = useState({ title: '', message: '', file: '' });

  useEffect(() => {
    // Récupérer les données de l'alerte à modifier
    fetch(`${process.env.REACT_APP_BACKEND_URL}/shared/alert/${id}`, {
      method: 'GET',
      headers: {
        'x-auth-token': sessionStorage.getItem('token'),
      },
    })
      .then((response) => response.json())
      .then((data) => setAlert(data))
      .catch((error) => console.error('Erreur : ', error));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${process.env.REACT_APP_BACKEND_URL}/shared/alert/${id}`, {
      method: 'PATCH',
      headers: {
        'x-auth-token': sessionStorage.getItem('token'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(alert),
    })
      .then((response) => {
        if (response.ok) {
          navigate('/alerts'); // Redirection après la mise à jour
        } else {
          console.error('Erreur lors de la mise à jour');
        }
      })
      .catch((error) => console.error('Erreur : ', error));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={alert.title}
        onChange={(e) => setAlert({ ...alert, title: e.target.value })}
        placeholder="Titre"
      />
      <textarea
        value={alert.message}
        onChange={(e) => setAlert({ ...alert, message: e.target.value })}
        placeholder="Message"
      />
      <button type="submit">Modifier l'alerte</button>
    </form>
  );
};

export default EditAlertPage;
