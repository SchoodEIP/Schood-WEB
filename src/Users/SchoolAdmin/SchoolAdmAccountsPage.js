import { React, useState } from 'react'
import HeaderComp from '../../Components/Header/HeaderComp'
import Sidebar from '../../Components/Sidebar/Sidebar'
import SchoolAccountsTable from '../../Components/Accounts/SchoolAdm/SchoolAccountsTable'
import ButtonsAccountCreation from '../../Components/Buttons/ButtonsAccountCreation'
import '../../css/pages/accountsPage.scss'
import Popup from '../../Components/Popup/Popup'
import '../../css/Components/Popup/Popup.css'

export default function SchoolAdmAccountsPage () {
  const [isOpenSingle, setIsOpenSingle] = useState(false)
  const [isOpenMany, setIsOpenMany] = useState(false)
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState('student')
  const [classes, setClasses] = useState([])
  const [fileName, setFile] = useState()
  const [errMessage, setErrMessage] = useState('')
  const singleCreationUrl = process.env.REACT_APP_BACKEND_URL + '/adm/register'
  const csvCreationUrl = process.env.REACT_APP_BACKEND_URL + '/adm/csvRegisterUser'

  const toggleSingleAccount = () => {
    setIsOpenSingle(!isOpenSingle)
    setFirstName('')
    setName('')
    setEmail('')
    setRole('')
    setClasses([])
    setErrMessage('')
    if (isOpenMany) {
      setIsOpenMany(!isOpenMany)
    }
  }

  const toggleManyAccounts = () => {
    setIsOpenMany(!isOpenMany)
    setErrMessage('')
    setFile()
    if (isOpenSingle) {
      setIsOpenSingle(!isOpenSingle)
    }
  }

  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value)
  }

  const handleNameChange = (event) => {
    setName(event.target.value)
  }

  const handleEmailChange = (event) => {
    setEmail(event.target.value)
  }

  const handleRoleChange = (event) => {
    setRole(event.target.value)
    console.log(role)
  }

  const handleClasseChange = (event) => {
    setClasses(oldArray => [...oldArray, event.target.value])
    console.log(classes)
  }

  const handleFileChange = (event) => {
    setFile(event.target.files[0])
  }

  const singleAccountCreation = async (event) => {
    event.preventDefault()

    try {
      const response = await fetch(singleCreationUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': sessionStorage.getItem('token')
        },
        body: JSON.stringify({
          firstname: firstName,
          lastname: name,
          email,
          role,
          classes
        })
      })

      const data = await response.json()
      setErrMessage(data.message)
    } catch (e) {
      setErrMessage(e.message)
    }
  }

  const csvAccountCreation = async (event) => {
    event.preventDefault()
    const formData = new FormData()

    formData.append('csv', fileName)

    try {
      const response = await fetch(csvCreationUrl, {
        method: 'POST',
        headers: {
          'x-auth-token': sessionStorage.getItem('token')
        },
        body: formData
      })

      const data = await response.json()

      console.log(data.message)
      setErrMessage(data.message)
    } catch (e) {
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
          <SchoolAccountsTable />
        </div>
        <div className='account-div'>
          <ButtonsAccountCreation
            isOpenSingle={isOpenSingle}
            isOpenMany={isOpenMany}
            toggleSingleAccount={toggleSingleAccount}
            toggleManyAccounts={toggleManyAccounts}
          />
        </div>
      </div>
      {
        isOpenSingle && <Popup
          toggle={toggleSingleAccount}
          title={"Création d'un compte Etudiant/Professeur"}
          errMessage={errMessage}
          accountCreation={singleAccountCreation}
          btn_text='Créer un nouveau compte'
          content={
            <form className='pop-form'>
              <input className='pop-input' name='firstName' placeholder='Prénom' onChange={handleFirstNameChange} />
              <input className='pop-input' name='lastName' placeholder='Nom' onChange={handleNameChange} />
              <input className='pop-input' name='email' placeholder='Email' onChange={handleEmailChange} />
              <select defaultValue='student' className='pop-input' name='role' placeholder='Rôle' onChange={handleRoleChange}>
                <option value='student'>Etudiant</option>
                <option value='teacher'>Professeur</option>
              </select>
              {/* <input className="pop-input" name="role" placeholder="Rôle" onChange={handleRoleChange}></input> */}
              <input className='pop-input' name='classe' placeholder='Classe' onChange={handleClasseChange} />
            </form>
          }
                        />
      }
      {
        isOpenMany && <Popup
          toggle={toggleManyAccounts}
          title={"Création d'une liste de comptes Etudiant/Professeur"}
          errMessage={errMessage}
          accountCreation={csvAccountCreation}
          btn_text='Créer de nouveaux comptes'
          content={
            <div>
              <form className='pop-form'>
                <input className='pop-input-file' placeholder='exemple.csv' onChange={handleFileChange} type='file' accept='.csv' />
              </form>
              <div className='pop-info'>
                <p>Le fichier attendu est un fichier .csv suivant le format:</p>
                <p>firstName,lastName,email,role,classe</p>
              </div>
            </div>
          }
                      />
      }
    </div>
  )
}
