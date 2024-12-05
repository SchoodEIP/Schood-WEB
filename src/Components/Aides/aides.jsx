import React, { useState, useEffect } from 'react'
import '../../css/Components/Aides/aides.scss'
import { disconnect } from '../../functions/disconnect'
import phoneIcon from '../../assets/phoneIcon.png'
import mailIcon from '../../assets/mailIcon.png'
import { toast } from 'react-toastify'

export default function AidePage ({ updateContent, handleUpdateContent }) {
  const [categories, setCategories] = useState([])
  const [contacts, setContacts] = useState([])
  const [chosenContact, setChosenContact] = useState([])
  const [filteredContacts, setFilteredContacts] = useState([])
  const [defaultID, setDefaultID] = useState(null)
  const [selectedCat, setSelectedCat] = useState(null)
  const [selectedContact, setSelectedContact] = useState(null)
  const [isCategoryEmpty, setIsCategoryEmpty] = useState(false) // New state for empty category

  useEffect(() => {
    const categoryUrl = process.env.REACT_APP_BACKEND_URL + '/user/helpNumbersCategories'
    const helpNumbersUrl = process.env.REACT_APP_BACKEND_URL + '/user/helpNumbers'
    if (updateContent) {
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
          const filterID = data.filter((category) => category.name === 'Autres')
          if (filterID.length !== 0) {
            setDefaultID(filterID[0]._id)
            setSelectedCat(filterID[0]._id)
          }
        })
        .catch(error => toast.error(error.message))

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
        .catch(error => toast.error('Erreur ' + error.status + ': ' + error.message))
      handleUpdateContent()
    }
  }, [updateContent])

  const filterContactsByCategory = (category) => {
    const filtered = contacts.filter((contact) => category !== defaultID ? contact.helpNumbersCategory === category : contact)

    if (filtered.length === 0) {
      setIsCategoryEmpty(true) // Set category as empty if no contacts found
    } else {
      setIsCategoryEmpty(false) // Set category as not empty
    }

    setFilteredContacts(filtered)
    setSelectedCat(category)
    setSelectedContact(filtered.length > 0 ? filtered[0]._id : null)
    setChosenContact(filtered.length > 0 ? filtered[0] : {})

    if (defaultID && category === defaultID) {
      setFilteredContacts(contacts)
      setIsCategoryEmpty(false)
    }
  }

  const filterContact = (contactID) => {
    const filtered = filteredContacts.filter((contact) => contact._id === contactID)
    setChosenContact(filtered[0])
    setSelectedContact(contactID)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div id='category-container'>
        {categories.map((category) => (
          <button key={category._id} className={selectedCat === category._id ? 'selected-btn category-btn' : 'category-btn'} data-testid={'category-btn-' + category.id} onClick={() => filterContactsByCategory(category._id)}>
            {category.name}
          </button>
        ))}
      </div>
      <div id='help-container'>
        <div id='filtered-contacts-container'>
          {filteredContacts.map((contact) =>
            <div key={contact._id} className={selectedContact === contact._id ? 'selected-contact-btn contact-btn' : 'contact-btn'} data-testid={'contact-btn-' + contact.id} onClick={() => filterContact(contact._id)}>
              {contact.name}
            </div>
          )}
        </div>
        <div className='contact-content-container' id='contact-profile'>
          {isCategoryEmpty
            ? (<p>Aucun numéro disponible dans cette catégorie.</p>)
            : (
              <>
                <h3 id='contact-title'>{chosenContact.name}</h3>
                <p>{chosenContact.description}</p>
                {chosenContact.telephone && (
                  <div className='contact-element-container'>
                    <img src={phoneIcon} alt='Telephone' className='contact-element-title' />
                    <p className='contact-element-content'>{chosenContact.telephone}</p>
                  </div>
                )}
                {chosenContact.email && (
                  <div className='contact-element-container'>
                    <img src={mailIcon} alt='Adresse Email' className='contact-element-title' />
                    <p className='contact-element-content'>{chosenContact.email}</p>
                  </div>
                )}
              </>
              )}
        </div>
      </div>
    </div>
  )
}
