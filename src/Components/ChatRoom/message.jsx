import React, { useEffect, useState } from 'react'
import { FaDownload } from 'react-icons/fa'
import moment from 'moment'

const Message = ({ message, participants }) => {
  const [fileURL, setFileURL] = useState(null)
  const messageUser = participants.find(item => item._id === message.user)
  useEffect(() => {
    if (message.contentType === 'file') {
      getFile(message.file)
        .then((data) => {
          setFileURL(data)
        })
        .catch((error) => /* istanbul ignore next */ {
          console.error('Erreur lors de la récupération du fichier :', error)
        })
    }
  }, [message])

  const getFile = async (id) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/file/${id}`, {
        method: 'GET',
        headers: {
          'x-auth-token': sessionStorage.getItem('token'),
          'Content-Type': 'application/json'
        }
      })
      if (response.status !== 200) /* istanbul ignore next */ {
        throw new Error("Erreur lors de l'envoi du message.")
      } else {
        const blob = await response.blob()
        const objectURL = URL.createObjectURL(blob)
        return objectURL
      }
    } catch (e) /* istanbul ignore next */ {
      console.error(e)
    }
  }

  useEffect(() => {
    if (message.contentType === 'file') {
      getFile(message.file)
        .then((data) => {
          setFileURL(data)
        })
        .catch((error) => /* istanbul ignore next */ {
          console.error('Error fetching file:', error)
        })
    }
  }, [message])

  return (
    <div className='message'>
      <div className='message-header'>
        <span className='message-username'>{messageUser ? messageUser.firstname + ' ' + messageUser.lastname : ''}</span>
        <span className='message-time'>{moment(message.date).format('DD/MM/YY HH:mm')}</span>
      </div>
      <div className='message-content'>
        {message.contentType === 'text'
          ? (
              message.content
            )
          : (
            <div>
              {fileURL
                ? (
                  <a href={fileURL} target='_blank' rel='noopener noreferrer'>
                    <FaDownload size={24} />
                  </a>
                  )
                : (
                  <p>Chargement du fichier...</p>
                  )}
              <p>{message.content}</p>
            </div>
            )}
      </div>
    </div>
  )
}

export default Message
