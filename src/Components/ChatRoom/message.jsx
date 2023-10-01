import React, { useState, useEffect } from 'react'

const Message = ({ message }) => {
  const [fileURL, setFileURL] = useState(null);

  useEffect(() => {
    if (message.contentType === 'file') {
      getFile(message.file)
        .then((data) => {
          setFileURL(data);
        })
        .catch((error) => {
          console.error('Erreur lors de la récupération du fichier :', error);
        });
    }
  }, [message]);

  const getFile = async (id) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/file/${id}`, {
        method: 'GET',
        headers: {
          'x-auth-token': sessionStorage.getItem('token'),
        },
      });
      if (response.status !== 200) {
        throw new Error("Erreur lors de la récupération du fichier.");
      } else {
        const blob = await response.blob();
        const objectURL = URL.createObjectURL(blob);
        return objectURL;
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className='message'>
      <div className='message-header'>
        <span className='message-username'>{message.username}</span>
        <span className='message-time'>{message.time}</span>
      </div>
      <div className='message-content'>
        {message.contentType === 'text' ? (
          message.content
        ) : (
          <div>
            {fileURL ? (
              <a href={fileURL} target="_blank" rel="noopener noreferrer">
                Télécharger le fichier
              </a>
            ) : (
              <p>Chargement du fichier...</p>
            )}
            <p>{message.content}</p>
          </div>
        )}
      </div>
    </div>
  );
};


export default Message
