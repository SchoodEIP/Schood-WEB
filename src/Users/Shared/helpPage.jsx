import '../../css/pages/homePage.scss'
import HeaderComp from '../../Components/Header/headerComp'
import AidePage from '../../Components/Aides/aides'
import React, {useState, useEffect} from 'react'
import Popup from '../../Components/Popup/popup'

const HelpPage = () => {
  const [position, setPosition] = useState(0)
  const role = sessionStorage.getItem("role")
  const [isOpenCategory, setIsOpenCategory] = useState(false)
  const [isOpenNumber, setIsOpenNumber] = useState(false)
  const [errMessage, setErrMessage] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [categoryID, setCategoryID] = useState('')
  const [telephone, setTelephone] = useState('')
  const [description, setDescription] = useState('')
  const [categories, setCategories] = useState([])
  const [contacts, setContacts] = useState([])
  const [filteredContacts, setFilteredContacts] = useState([])


  const upPosition = () => {
    setPosition(position + 1);
  };

  const minusPosition = () => {
    setPosition(position - 1);
  };

  const fetchUpdatedCategories = async () => {
    const categoryUrl = process.env.REACT_APP_BACKEND_URL + '/user/helpNumbersCategories'
    const response = await fetch(categoryUrl, {
      method: 'GET',
      headers: {
        'x-auth-token': sessionStorage.getItem('token'),
        'Content-Type': 'application/json'
      }
    })

    if (response.ok) {
      const data = await response.json()
      return data
    } else {
      throw new Error('Erreur lors de la récupération des catégories.')
    }
  }

  const fetchHelpNumbers = async () => {
    const helpNumbersUrl = process.env.REACT_APP_BACKEND_URL + '/user/helpNumbers'
    const response = await fetch(helpNumbersUrl, {
      method: 'GET',
      headers: {
        'x-auth-token': sessionStorage.getItem('token'),
        'Content-Type': 'application/json'
      }
    })

    if (response.ok) {
      const data = await response.json()
      return data
    } else {
      throw new Error('Erreur lors de la récupération des numéros d\'aide.')
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesData = await fetchUpdatedCategories()
        setCategories(categoriesData)
        setCategoryID(categoriesData.length > 0 ? categoriesData[0]._id : '')

        const helpNumbersData = await fetchHelpNumbers()
        setContacts(helpNumbersData)
        setFilteredContacts(helpNumbersData)
      } catch (error) {
        setErrMessage(error.message)
      }
    }

    fetchData()
  }, [isOpenCategory])

  const fetchData = async () => {
    try {
      const categoriesData = await fetchUpdatedCategories()
      setCategories(categoriesData)
      setCategoryID(categoriesData.length > 0 ? categoriesData[0]._id : '')

      const helpNumbersData = await fetchHelpNumbers()
      setContacts(helpNumbersData)
      setFilteredContacts(helpNumbersData)
    } catch (error) {
      setErrMessage(error.message)
    }
  }

  const handleCategoryPopup = async () => {
    setIsOpenCategory(!isOpenCategory)
    setErrMessage('')
    setName('')
    if (isOpenNumber) {
      setIsOpenNumber(false)
    }
  }

  const handleNumberPopup = async () => {
    setIsOpenNumber(!isOpenNumber)
    setErrMessage('')
    setName('')
    setCategoryID(categories.length > 0 ? categories[0]._id : '')
    setEmail('')
    setTelephone('')
    setDescription('')
    if (isOpenCategory) {
      setIsOpenCategory(false)
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

  const categoryCreation = async () => {
    try {
      const response = await fetchCategoryRegister()
      if (response.ok) {
        setErrMessage('Catégorie créée avec succès')
        handleCategoryPopup()
        fetchData()
      } else {
        const data = await response.json()
        setErrMessage(data.message)
      }
    } catch (error) {
      setErrMessage(error.message)
    }
  }

  const helpNumberCreation = async () => {
    try {
      if (!/^\d{10}$/.test(telephone)) {
        setErrMessage('Veuillez fournir un numéro de téléphone valide (10 chiffres).')
        return
      }

      const response = await fetchHelpNumberRegister()
      if (response.ok) {
        setErrMessage("Numéro d'aide créé avec succès")
        handleNumberPopup()
        fetchData()
      } else {
        const data = await response.json()
        setErrMessage(data.message)
      }
    } catch (error) {
      setErrMessage(error.message)
    }
  }

  const fetchCategoryRegister = async () => {
    const categoryRegisterUrl = process.env.REACT_APP_BACKEND_URL + '/adm/helpNumbersCategory/register'
    return fetch(categoryRegisterUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': sessionStorage.getItem('token')
      },
      body: JSON.stringify({
        name
      })
    })
  }

  const fetchHelpNumberRegister = async () => {
    const helpNumberRegisterUrl = process.env.REACT_APP_BACKEND_URL + '/adm/helpNumber/register'
    return fetch(helpNumberRegisterUrl, {
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
  }

  const buttonComponent = [
    {
      name: 'Ajouter une Catégorie',
      function: handleCategoryPopup
    },
    {
      name: 'Ajouter un Numéro',
      function: handleNumberPopup
    }
  ]

  return (
    <div className='dashboard'>
      <div>
        <HeaderComp
          title="Mes Aides"
          withLogo={true}
          withReturnBtn={position > 0 ? true : false}
          position={position}
          returnCall={minusPosition}
          showButtons={role === "administration" || role === "admin" ? true : false}
          buttonComponent={buttonComponent}
        />
      </div>
      <div className='help-page' style={{marginLeft: "25px", marginRight: "25px", overflowY: "auto"}}>
        <AidePage upPosition={upPosition} position={position}/>
        {isOpenCategory && (
          <Popup
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
        )}
        {isOpenNumber && categories.length > 0 && (
          <Popup
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
        )}
      </div>
    </div>
  )
}

export default HelpPage
