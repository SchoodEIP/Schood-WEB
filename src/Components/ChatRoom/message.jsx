import React from "react";

const Message = ({ message }) => {
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
              <a href={message.fileUrl} target='_blank' rel='noopener noreferrer'>
                Fichier joint
              </a>
              )}
        </div>
      </div>
    )
  }

export default Message;