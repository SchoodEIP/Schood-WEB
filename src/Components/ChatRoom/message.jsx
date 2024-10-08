import React, { useEffect, useState } from 'react'
import { FaDownload } from 'react-icons/fa'
import moment from 'moment'
import '../../css/pages/chatRoomPage.scss'
import { disconnect } from '../../functions/disconnect'
import userIcon from '../../assets/userIcon.png'

const Message = ({ message, participants, next }) => {
  const [fileURL, setFileURL] = useState(null)
  const [isMyMessage, setIsMyMessage] = useState(message.user === localStorage.getItem('id'))
  const messageUser = participants.find(item => item._id === message.user)

  useEffect(() => {
    setIsMyMessage(message.user === localStorage.getItem('id'))
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
      if (response.status === 401) {
        disconnect()
      }
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
    <div>
      <div className={[isMyMessage ? 'my-messages' : 'other-messages']}>
        <div className='message-content'>
          {message.contentType === 'text'
            ? (
              <div className='message-content2'>{message.content}</div>
              )
            : (
              <div className='with-file'>
                <div className='message-content2'>
                  {message.content}
                </div>
                {fileURL
                  ? (
                    <a className='file' href={fileURL} target='_blank' rel='noopener noreferrer'>
                      <FaDownload size={24} />
                    </a>
                    )
                  : (
                    <div className='file'>Chargement du fichier...</div>
                    )}
              </div>
              )}
        </div>
      </div>
      <div className='message-identification' style={isMyMessage ? { flexDirection: 'row-reverse' } : { flexDirection: 'row' }}>
        {
          (next !== undefined && next.user === message.user) ? <span className='img image-right' /> : (isMyMessage ? <img className='img image-right' src={messageUser?.picture ? messageUser.picture : userIcon} alt={userIcon} /> : <img className='img image-left' src={messageUser?.picture ? messageUser.picture : userIcon} alt={userIcon} />)
        }
        <span className='message-time'>{(next !== undefined && moment(message.date).format('DD/MM/YY HH:mm') === moment(next.date).format('DD/MM/YY HH:mm')) ? '' : moment(message.date).format('DD/MM/YY HH:mm')}</span>
      </div>
    </div>
  )
}

export default Message
