import React, { useState, useEffect } from 'react'
import '../../css/Components/Aides/aides.scss'
import { disconnect } from '../../functions/disconnect'
import phoneIcon from "../../assets/phoneIcon.png"
import mailIcon from "../../assets/mailIcon.png"

export default function AidePage (props) {
  const [categories, setCategories] = useState([])
  const [contacts, setContacts] = useState([])
  const [chosenContact, setChosenContact] = useState([])
  const [filteredContacts, setFilteredContacts] = useState([])
  const [errMessage, setErrMessage] = useState('')
  const [defaultID, setDefaultID] = useState(null)
  const [selectedCat, setSelectedCat] = useState(null)
  const [selectedContact, setSelectedContact] = useState(null)

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
        console.log(data)
        const filterID = data.filter((category) => category.name === 'Autres')
        if (filterID.length !== 0) {
          setDefaultID(filterID[0]._id)
          setSelectedCat(filterID[0]._id)
        }
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
        setChosenContact(data[0])
        setSelectedContact(data[0]._id)
      })
      .catch(error => setErrMessage('Erreur ' + error.status + ': ' + error.message))
  }, [])

  const filterContactsByCategory = (category) => {
    const filtered = contacts.filter((contact) => category !== defaultID ? contact.helpNumbersCategory === category : contact)
    setFilteredContacts(filtered)
    setSelectedCat(category)
    setSelectedContact(filtered[0]._id)
    setChosenContact(filtered[0])
    if (defaultID && category === defaultID) {
      setFilteredContacts(contacts)
    }
  }

  const filterContact = (contactID) => {
    const filtered = filteredContacts.filter((contact) => contact._id === contactID)
    setChosenContact(filtered[0])
    setSelectedContact(contactID)
  }

  return (
    <div style={{display: "flex", flexDirection: "column"}}>
      <p>{errMessage || ''}</p>
      <div id='category-container'>
        {categories.map((category) => (
          <button key={category._id} className={selectedCat === category._id ? 'selected-btn category-btn' : 'category-btn'} data-testid={'category-btn-' + category.id} onClick={() => filterContactsByCategory(category._id)}>
            {category.name}
          </button>
        ))}
      </div>
      <div id="help-container">
        <div id='filtered-contacts-container'>
          {filteredContacts.map((contact) =>
            <div key={contact._id} className={selectedContact === contact._id ? 'selected-contact-btn contact-btn' : 'contact-btn' } data-testid={'contact-btn-' + contact.id} onClick={() => filterContact(contact._id)}>
              {contact.name}
            </div>
          )}
        </div>
        <div className='contact-content-container' id='contact-profile'>
          <h3 id='contact-title'>{chosenContact.name}</h3>
          <p>{chosenContact.description}</p>
          {
            chosenContact.telephone
              ? (
                <div className='contact-element-container'>
                  <img src={phoneIcon} alt='Telephone' className='contact-element-title' />
                  <p className='contact-element-content'>{chosenContact.telephone}</p>
                </div>
                )
              : ''
          }
          {
            chosenContact.email
              ? (
                <div className='contact-element-container'>
                  <img src={mailIcon} alt='Adresse Email' className='contact-element-title'/>
                  <p className='contact-element-content'>{chosenContact.email}</p>
                </div>
                )
              : ''
          }
        </div>
      </div>
    </div>
  )
}
