import { React, useState, useEffect } from 'react'
import HeaderComp from '../../Components/Header/headerComp'
import Sidebar from '../../Components/Sidebar/sidebar'
import AdmAccountsTable from '../../Components/Accounts/Adm/admAccountsTable.js'
import ButtonsAccountCreation from '../../Components/Buttons/buttonsAccountCreation.js'
import '../../css/pages/accountsPage.scss'
import Popup from '../../Components/Popup/popup'

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
    const rolesUrl = process.env.REACT_APP_BACKEND_URL + '/adm/rolesList'

    try {
      fetch(rolesUrl, {
        method: 'GET',
        headers: {
          'x-auth-token': sessionStorage.getItem('token'),
          'Content-Type': 'application/json'
        }
      }).then(response => response.json())
        .then(data => setRolesList(data.roles))
        .catch(error => setErrMessage(error.message))
    } catch (e) /* istanbul ignore next */ {
      setErrMessage(e.message)
    }
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

    try {
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
        } else {
          const data = response.json()

          setErrMessage(data.message)
        }
      })
    } catch (e) /* istanbul ignore next */ {
      setErrMessage(e.message)
    }
  }

  const csvAccountCreation = async (event) => {
    event.preventDefault()
    const formData = new FormData()

    formData.append('csv', fileName)

    try {
      await fetch(csvCreationUrl, {
        method: 'POST',
        headers: {
          'x-auth-token': sessionStorage.getItem('token')
        },
        body: formData
      }).then(response => {
        if (response.ok) {
          setErrMessage('Compte(s) créé(s) avec succès')
        } else {
          const data = response.json()

          setErrMessage(data.message)
        }
      })
    } catch (e) /* istanbul ignore next */ {
      setErrMessage(e.message)
    }
  }

  return (
    <div>
      <div>
        <HeaderComp />
      </div>
      <div className='page-content'>
        <div>
          <Sidebar />
        </div>
        <div className='table-div'>
          <AdmAccountsTable />
        </div>
        <div className='account-div'>
          <ButtonsAccountCreation
            isOpenSingle={isOpenSingle}
            isOpenMany={isOpenMany}
            handleSingleAccount={handleSingleAccount}
            handleManyAccounts={handleManyAccounts}
          />
        </div>
      </div>
      {
        isOpenSingle && <Popup
          handleClose={handleSingleAccount}
          title={"Création d'un compte Administrateur Scolaire"}
          errMessage={errMessage}
          handleCreation={singleAccountCreation}
          btn_text='Créer un nouveau compte'
          content={
            <div>
              <form className='pop-form'>
                <input className='pop-input' placeholder='Prénom' onChange={handleFirstNameChange} />
                <input className='pop-input' placeholder='Nom' onChange={handleLastNameChange} />
                <input className='pop-input' placeholder='Email' onChange={handleEmailChange} />
              </form>
            </div>
          }
                        />
      }
      {
        isOpenMany && <Popup
          handleClose={handleManyAccounts}
          title={"Création d'une liste de comptes Administrateur Scolaire"}
          errMessage={errMessage}
          handleCreation={csvAccountCreation}
          btn_text='Créer de nouveaux comptes'
          content={
            <div>
              <form className='pop-form'>
                <input className='pop-input-file' placeholder='exemple.csv' onChange={handleFileChange} type='file' accept='.csv' />
              </form>
              <div className='pop-info'>
                <p>Le fichier attendu est un fichier .csv suivant le format:</p>
                <p>firstName,lastName,email</p>
              </div>
            </div>
          }
                      />
      }
    </div>
  )
}
