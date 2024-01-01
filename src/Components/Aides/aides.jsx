import React, { useState, useEffect } from 'react'
import '../../css/Components/Aides/aides.scss'

export default function AidePage () {
  const [categories, setCategories] = useState([])
  const [contacts, setContacts] = useState([])
  const [filteredContacts, setFilteredContacts] = useState([])
  const [errMessage, setErrMessage] = useState('')

  useEffect(() => {
    const categoryUrl = process.env.REACT_APP_BACKEND_URL + "/user/helpNumbersCategories"
    const helpNumbersUrl = process.env.REACT_APP_BACKEND_URL + "/user/helpNumbers"

    fetch(categoryUrl, {
      method: 'GET',
      headers: {
        'x-auth-token': sessionStorage.getItem('token'),
        'Content-Type': 'application/json'
      }
    }).then(response => response.json())
      .then(data => {
        console.log(data)
        setCategories(data)
      })
      .catch(error => setErrMessage(error.message))

    fetch(helpNumbersUrl, {
      method: 'GET',
      headers: {
        'x-auth-token': sessionStorage.getItem('token'),
        'Content-Type': 'application/json'
      }
    }).then(response => response.json())
      .then(data => {
        console.log(data)
        setContacts(data)
        setFilteredContacts(data)
      })
      .catch(error => setErrMessage(error.message))

  }, [])

  const filterContactsByCategory = (category) => {
    const filtered = contacts.filter((contact) => contact.helpNumbersCategory === category)
    setFilteredContacts(filtered)
  }

  return (
    <div className='aide-page'>
      <header>Numéros de Contact</header>

      <div className='categories-section'>
        <h2>Catégories</h2>
        <ul>
          {categories.map((category) => (
            <li key={category._id}>
              <button data-testid={'category-btn-' + category.id} onClick={() => filterContactsByCategory(category._id)}>
                {category.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className='contacts-section'>
        <h2>Numéros de Contact</h2>
        <ul>
          {filteredContacts.map((contact) => (
            <li key={contact._id}>
              <strong>Nom: </strong><span>{contact.name}</span><br />
              <strong>Numéro: </strong><span>{contact.telephone}</span><br />
              <strong>Email: </strong><span>{contact.email}</span><br />
              <strong>Description: </strong><span>{contact.description}</span><br />
            </li>
          ))}
        </ul>
      </div>
      <div className='clearfix' />
    </div>
  )
}
