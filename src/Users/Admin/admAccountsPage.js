import { React, useState, useEffect } from 'react'
import HeaderComp from '../../Components/Header/headerComp'
import AdmAccountsTable from '../../Components/Accounts/Adm/admAccountsTable.js'
import ButtonsPopupCreation from '../../Components/Buttons/buttonsPopupCreation.js'
import '../../css/pages/accountsPage.scss'
import Popup from 'reactjs-popup'
import userIcon from '../../assets/userIcon.png'
import cross from "../../assets/Cross.png"


export default function AdmAccountsPage () {
  const [isOpenSingle, setIsOpenSingle] = useState(false)
  const [isOpenMany, setIsOpenMany] = useState(false)
  const [email, setEmail] = useState('')
  const [firstname, setFirstName] = useState('')
  const [lastname, setLastName] = useState('')
  const [fileName, setFile] = useState('')
  const [rolesList, setRolesList] = useState([])
  const [errMessage, setErrMessage] = useState('')
  const singleCreationUrl = process.env.REACT_APP_BACKEND_URL + '/adm/register'
  const csvCreationUrl = process.env.REACT_APP_BACKEND_URL + '/adm/csvRegisterUser'

  useEffect(() => {
    const rolesUrl = process.env.REACT_APP_BACKEND_URL + '/shared/roles'

    fetch(rolesUrl, {
      method: 'GET',
      headers: {
        'x-auth-token': sessionStorage.getItem('token'),
        'Content-Type': 'application/json'
      }
    }).then(response => response.json())
      .then(data => setRolesList(data.roles))
      .catch(error => /* istanbul ignore next */ { setErrMessage(error.message) })
  }, [])

  const handleSingleAccount = () => {
    setIsOpenSingle(!isOpenSingle)
    setFirstName('')
    setLastName('')
    setEmail('')
    setErrMessage('')
    if (isOpenMany) {
      setIsOpenMany(false)
    }
  }

  const handleManyAccounts = () => {
    setIsOpenMany(!isOpenMany)
    setFile()
    setErrMessage('')
    if (isOpenSingle) {
      setIsOpenSingle(false)
    }
  }

  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value)
  }

  const handleLastNameChange = (event) => {
    setLastName(event.target.value)
  }

  const handleEmailChange = (event) => {
    setEmail(event.target.value)
  }

  const handleFileChange = (event) => {
    setFile(event.target.files[0])
  }

  const singleAccountCreation = async (event) => {
    event.preventDefault()

    const filteredArray = rolesList.filter(item => item.levelOfAccess === 2)
    const roleId = filteredArray.map(item => item._id)

    const payload = {
      firstname,
      lastname,
      email,
      role: roleId[0],
      classes: []
    }

    await fetch(singleCreationUrl, {
      method: 'POST',
      headers: {
        'x-auth-token': sessionStorage.getItem('token'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }).then(response => {
      if (response.ok) {
        setErrMessage('Compte créé avec succès')
        window.location.reload()
      } else {
        const data = response.json()
        setErrMessage(data)
      }
    })
      .catch((e) =>/* istanbul ignore next */ { setErrMessage(e.message) })
  }

  const csvAccountCreation = async (event) => {
    event.preventDefault()
    const formData = new FormData()

    formData.append('csv', fileName)

    await fetch(csvCreationUrl, {
      method: 'POST',
      headers: {
        'x-auth-token': sessionStorage.getItem('token')
      },
      body: formData
    }).then(response => {
      if (response.ok) {
        setErrMessage('Compte(s) créé(s) avec succès')
        window.location.reload()
      } else {
        const data = response.json()

        setErrMessage(data.message)
      }
    })
      .catch((e) => /* istanbul ignore next */ { setErrMessage(e.message) })
  }

  const buttonComponent = [
    {
      name: 'Ajouter un Compte',
      function: handleSingleAccount
    },
    {
      name: 'Ajouter une Liste de Comptes',
      function: handleManyAccounts
    }
  ]

  return (
    <div>
      <div>
        <HeaderComp
          title="Gestion des Comptes"
          withLogo={true}
          showButtons={true}
          buttonComponent={buttonComponent}
        />
      </div>
      <div className='page-content' style={{alignContent: "center", justifyContent: "center"}}>
        <AdmAccountsTable />
      </div>
      <Popup open={isOpenSingle} close={handleSingleAccount} modal>
        {(close) => (
          <div className="popup-modal-container" style={{padding: "50px", gap: "20px", alignItems: 'center'}} >
            <button className="close-btn" onClick={close}><img src={cross} alt="Close"></img></button>
            <label style={{gap: "10px"}}>
              <span className="label-content">Prénom <span style={{color: "red"}}>*</span></span>
              <input placeholder='Prénom' value={firstname} onChange={handleFirstNameChange} type='text' />
            </label>
            <label style={{gap: "10px"}}>
              <span className="label-content">Nom <span style={{color: "red"}}>*</span></span>
              <input placeholder='Nom' value={lastname} onChange={handleLastNameChange} type='text' />
            </label>
            <label style={{gap: "10px"}}>
              <span className="label-content">Adresse Email <span style={{color: "red"}}>*</span></span>
              <input placeholder='Email' value={email} onChange={handleEmailChange} type='text' />
            </label>
            {errMessage ? <span style={{color: "red"}}>{errMessage}</span> : ''}
            <button className="popup-btn" onClick={singleAccountCreation}>Créer le Compte</button>
          </div>
        )}
      </Popup>
      <Popup open={isOpenMany} close={handleManyAccounts} modal>
        {(close) => (
          <div className="popup-modal-container" style={{padding: "50px", gap: "50px", alignItems: 'center'}} >
            <button className="close-btn" onClick={close}><img src={cross} alt="Close"></img></button>
            <label style={{alignItems: 'center', gap: "25px"}}>
              <input className='input-csv' placeholder='exemple.csv' onChange={handleFileChange} type='file' accept='.csv' />
              <span className="label-content-warning">Le fichier attendu est un fichier .csv suivant le format: firstname,lastname,email</span>
            </label>
            {errMessage ? <span style={{color: "red"}}>{errMessage}</span> : ''}
            <button className="popup-btn" onClick={csvAccountCreation}>Créer le(s) Compte(s)</button>
          </div>
        )}
      </Popup>
    </div>
  )
}
