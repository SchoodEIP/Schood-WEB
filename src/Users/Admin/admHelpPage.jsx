import '../../css/pages/homePage.css'
import HeaderComp from '../../Components/Header/headerComp'
import Sidebar from '../../Components/Sidebar/sidebar'
import AidePage from '../../Components/Aides/aides'
import ButtonsPopupCreation from '../../Components/Buttons/buttonsPopupCreation.js'
import { React, useState, useEffect } from 'react'
import Popup from '../../Components/Popup/popup'

const AdmHelpPage = () => {
  const [isOpenCategory, setIsOpenCategory] = useState(false)
  const [isOpenNumber, setIsOpenNumber] = useState(false)
  const [errMessage, setErrMessage] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [categoryID, setCategoryID] = useState('')
  const [telephone, setTelephone] = useState('')
  const [description, setDescription] = useState('')
  const [categories, setCategories] = useState([])

  useEffect(() => {
    const categoryUrl = process.env.REACT_APP_BACKEND_URL + '/user/helpNumbersCategories'
    fetch(categoryUrl, {
      method: 'GET',
      headers: {
        'x-auth-token': sessionStorage.getItem('token'),
        'Content-Type': 'application/json'
      }
    }).then(response => response.json())
      .then(data => {
        setCategories(data)
        setCategoryID(data[0]._id)
      })
      .catch(error => setErrMessage(error.message))
  }, [])

  const handleCategoryPopup = () => {
    setIsOpenCategory(!isOpenCategory)
    setErrMessage('')
    setName('')
    if (isOpenNumber) {
      setIsOpenNumber(!isOpenNumber)
    }
  }

  const handleNumberPopup = () => {
    setIsOpenNumber(!isOpenNumber)
    setErrMessage('')
    setName('')
    setCategoryID(categories[0]._id)
    setEmail('')
    setTelephone('')
    setDescription('')
    if (isOpenCategory) {
      setIsOpenCategory(!isOpenCategory)
    }
  }

  const handleNameChange = (event) => {
    setName(event.target.value)
  }

  const handleTelephoneChange = (event) => {
    setTelephone(event.target.value)
  }

  const handleEmailChange = (event) => {
    setEmail(event.target.value)
  }

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value)
  }

  const handleCategoryChange = (event) => {
    setCategoryID(event.target.value)
  }

  const categoryCreation = async (event) => {
    const categoryRegisterUrl = process.env.REACT_APP_BACKEND_URL + '/adm/helpNumbersCategory/register'
    const response = await fetch(categoryRegisterUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': sessionStorage.getItem('token')
      },
      body: JSON.stringify({
        name
      })
    })
    if (response.status === 200) {
      setErrMessage('Catégorie créée avec succès')
    } else {
      const data = response.json()

      setErrMessage(data.message)
    }
  }

  const helpNumberCreation = async (event) => {
    const helpNumberRegisterUrl = process.env.REACT_APP_BACKEND_URL + '/adm/helpNumber/register'

    const response = await fetch(helpNumberRegisterUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': sessionStorage.getItem('token')
      },
      body: JSON.stringify({
        email,
        name,
        telephone,
        helpNumbersCategory: categoryID,
        description
      })
    })
    if (response.status === 200) {
      setErrMessage("Numéro d'aide créé avec succès")
    } else {
      const data = response.json()

      setErrMessage(data.message)
    }
  }

  return (
    <div className='dashboard'>
      <div>
        <HeaderComp />
      </div>
      <div className='page-content'>
        <div>
          <Sidebar />
        </div>
        <div className='left-half'>
          <div>
            <AidePage />
          </div>
        </div>
        <div className='right-half'>
          <ButtonsPopupCreation
            isOpenSingle={isOpenCategory}
            isOpenMany={isOpenNumber}
            handleSingleAccount={handleCategoryPopup}
            handleManyAccounts={handleNumberPopup}
            singleContent='Ajouter une Catégorie'
            manyContent='Ajouter un Contact'
          />
        </div>
      </div>
      {
        isOpenCategory && <Popup
          handleClose={handleCategoryPopup}
          title='Ajouter une nouvelle Catégorie'
          errMessage={errMessage}
          handleCreation={categoryCreation}
          btn_text='Créer la catégorie'
          content={
            <div>
              <input className='pop-input' name='name' placeholder='Nom' onChange={handleNameChange} />
            </div>
          }
                          />
      }
      {
        isOpenNumber && <Popup
          handleClose={handleNumberPopup}
          title='Ajouter un nouveau Contact'
          errMessage={errMessage}
          handleCreation={helpNumberCreation}
          btn_text='Créer le contact'
          content={
            <form className='pop-form'>
              <select className='pop-input' data-testid='category-select' value={categoryID} onChange={handleCategoryChange}>
                {categories.map((option, index) => (
                  <option key={index} value={option._id}>
                    {option.name}
                  </option>
                ))}
              </select>
              <input className='pop-input' name='name' placeholder='Nom' onChange={handleNameChange} />
              <input className='pop-input' name='telephone' placeholder='0000000000' onChange={handleTelephoneChange} />
              <input className='pop-input' name='email' placeholder='example@schood.fr' onChange={handleEmailChange} />
              <textarea className='pop-input' name='description' placeholder="Une description à propos de l'aide fournie" onChange={handleDescriptionChange} />
            </form>
          }
                        />
      }
    </div>
  )
}

export default AdmHelpPage
