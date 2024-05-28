import React, { useState, useEffect } from 'react'
import '../../css/Components/Aides/aides.scss'
import { disconnect } from '../../functions/disconnect'

export default function AidePage (props) {
  const [categories, setCategories] = useState([])
  const [contacts, setContacts] = useState([])
  const [chosenContact, setChosenContact] = useState([])
  const [filteredContacts, setFilteredContacts] = useState([])
  const [errMessage, setErrMessage] = useState('')
  const [defaultID, setDefaultID] = useState(null)

  useEffect(() => {
    const categoryUrl = process.env.REACT_APP_BACKEND_URL + '/user/helpNumbersCategories'
    const helpNumbersUrl = process.env.REACT_APP_BACKEND_URL + '/user/helpNumbers'

    fetch(categoryUrl, {
      method: 'GET',
      headers: {
        'x-auth-token': sessionStorage.getItem('token'),
        'Content-Type': 'application/json'
      }
    }).then(response => {
      if (response.status === 401) {
        disconnect()
      }
      return response.json()
    })
      .then(data => {
        setCategories(data)
        const filterID = data.filter((category) => category.name === 'Default')
        setDefaultID(filterID.length ? filterID[0]._id : null)
      })
      .catch(error => setErrMessage(error.message))

    fetch(helpNumbersUrl, {
      method: 'GET',
      headers: {
        'x-auth-token': sessionStorage.getItem('token'),
        'Content-Type': 'application/json'
      }
    }).then(response => {
      if (response.status === 401) {
        disconnect()
      }
      return response.json()
    })
      .then(data => {
        setContacts(data)
        setFilteredContacts(data)
      })
      .catch(error => setErrMessage('Erreur ' + error.status + ': ' + error.message))
  }, [])

  const filterContactsByCategory = (category) => {
    const filtered = contacts.filter((contact) => contact.helpNumbersCategory === category)
    setFilteredContacts(filtered)
    if (defaultID && category === defaultID[0]._id) {
      setFilteredContacts(contacts)
    }
    props.upPosition()
  }

  const filterContact = (contactID) => {
    const filtered = filteredContacts.filter((contact) => contact._id === contactID)
    setChosenContact(filtered[0])
    props.upPosition()
  }

  return (
    <div>
      <p>{errMessage || ''}</p>
      {props.position === 0
        ? (
          <div id='category-container'>
            {categories.map((category) => (
              <button key={category._id} className='category-btn' data-testid={'category-btn-' + category.id} onClick={() => filterContactsByCategory(category._id)}>
                {category.name}
              </button>
            ))}
          </div>
          )
        : ''}

      {props.position === 1
        ? (
          <div id='filtered-contacts-container'>
            {filteredContacts.map((contact) =>
              <button key={contact._id} className='contact-btn' data-testid={'contact-btn-' + contact.id} onClick={() => filterContact(contact._id)}>
                {contact.name}
              </button>
            )}
          </div>
          )
        : ''}

      {props.position === 2
        ? (
          <div className='contact-container'>
            <div className='contact-content-container' id='contact-profile'>
              <h1 id='contact-title'>{chosenContact.name}</h1>
              {
                chosenContact.telephone
                  ? (
                    <div className='contact-element-container'>
                      <p className='contact-element-title'>Numéro de Téléphone</p>
                      <p className='contact-element-content'>{chosenContact.telephone}</p>
                    </div>
                  )
                  : ''
              }
              {
                chosenContact.email
                  ? (
                    <div className='contact-element-container'>
                      <p className='contact-element-title'>Adresse Email</p>
                      <p className='contact-element-content'>{chosenContact.email}</p>
                    </div>
                  )
                  : ''
              }
            </div>
            <div className='contact-content-container' id='contact-description'>
              <span>{chosenContact.description}</span>
            </div>
          </div>
          )
        : ''}
    </div>
  )
}
