import React, { useState, useEffect } from 'react'

const Message = ({ message }) => {
  const [imageURL, setImageURL] = useState(null)

  const getFile = async (id) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/file/${id}`, {
        method: 'GET',
        headers: {
          'x-auth-token': sessionStorage.getItem('token')
        }
      })
      if (response.status !== 200) {
        throw new Error("Erreur lors de l'envoi du message.")
      } else {
        return response.url
      }
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    if (message.contentType === 'file') {
      getFile(message.file)
        .then((data) => {
          console.log(data)
          setImageURL(data)
        })
        .catch((error) => {
          console.error('Error fetching file:', error)
        })
    }
  }, [message])

  return (
    <div className='message'>
      <div className='message-header'>
        <span className='message-username'>{message.username}</span>
        <span className='message-time'>{message.time}</span>
      </div>
      <div className='message-content'>
        {message.contentType === 'text'
          ? (
              message.content
            )
          : (
            <div>
              {imageURL
                ? (
                  <img src={imageURL} alt='Error : Unable to load Image' />
                  )
                : (
                  <p>Loading image...</p>
                  )}
              <p>{message.content}</p>
            </div>
            )}
      </div>
    </div>
  )
}

export default Message
