import { React, useState, useEffect } from 'react'
import HeaderComp from '../../Components/Header/headerComp'
import Sidebar from '../../Components/Sidebar/sidebar'
import SchoolAccountsTable from '../../Components/Accounts/SchoolAdm/schoolAccountsTable'
import ButtonsAccountCreation from '../../Components/Buttons/buttonsAccountCreation'
import '../../css/pages/accountsPage.scss'
import Popup from '../../Components/Popup/popup'
import '../../css/Components/Popup/popup.css'

export default function SchoolAdmAccountsPage () {
  const [isOpenSingle, setIsOpenSingle] = useState(false)
  const [isOpenMany, setIsOpenMany] = useState(false)
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [classes, setClasses] = useState([])
  const [fileName, setFile] = useState()
  const [errMessage, setErrMessage] = useState('')
  const [classesList, setClassesList] = useState([])
  const [rolesList, setRolesList] = useState([])
  const singleCreationUrl = process.env.REACT_APP_BACKEND_URL + '/adm/register'
  const csvCreationUrl = process.env.REACT_APP_BACKEND_URL + '/adm/csvRegisterUser'

  useEffect(() => {
    const rolesUrl = process.env.REACT_APP_BACKEND_URL + '/adm/classes'

    fetch(rolesUrl, {
      method: 'GET',
      headers: {
        'x-auth-token': sessionStorage.getItem('token'),
        'Content-Type': 'application/json'
      }
    }).then(response => response.json())
      .then(data => setClassesList(data))
      .catch(error => setErrMessage(error.message))
  }, [])

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
        .then(data => {
          setRolesList(data.roles)
        })
        .catch(error => setErrMessage(error.message))
    } catch (e) /* istanbul ignore next */ {
      setErrMessage(e.message)
    }
  }, [])

  const handleSingleAccount = () => {
    setIsOpenSingle(!isOpenSingle)
    setFirstName('')
    setName('')
    setEmail('')
    if (rolesList[0] !== undefined) { setRole(rolesList[0]._id) }
    setClasses([])
    setErrMessage('')
    if (isOpenMany) {
      setIsOpenMany(!isOpenMany)
    }
  }

  const handleManyAccounts = () => {
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
  }

  const handleClasseChange = (event) => {
    const selectedValue = event.target.value

    if (classes.includes(selectedValue)) {
    // If the value is already in the array, filter it out and update the state
      const updatedClasses = classes.filter(item => item !== selectedValue)
      setClasses(updatedClasses)
    } else {
    // If the value is not in the array, add it and update the state
      setClasses(oldArray => [...oldArray, selectedValue])
    }
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
      if (response.ok) {
        setErrMessage('Compte créé avec succès')
      } else /* istanbul ignore next */ {
        const data = response.json()

        setErrMessage(data.message)
      }
    } catch (e) /* istanbul ignore next */ {
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
      if (response.ok) {
        setErrMessage('Compte(s) créé(s) avec succès')
      } else /* istanbul ignore next */ {
        const data = response.json()

        setErrMessage(data.message)
      }
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
          <SchoolAccountsTable />
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
          title={"Création d'un compte Etudiant/Professeur"}
          errMessage={errMessage}
          handleCreation={singleAccountCreation}
          btn_text='Créer un nouveau compte'
          content={
            <form className='pop-form'>
              <input className='pop-input' name='firstName' placeholder='Prénom' onChange={handleFirstNameChange} />
              <input className='pop-input' name='lastName' placeholder='Nom' onChange={handleNameChange} />
              <input className='pop-input' name='email' placeholder='Email' onChange={handleEmailChange} />
              {
                (rolesList[0] !== undefined)
                  ? (
                    <div>
                      <select defaultValue={role} className='pop-input' name='role' placeholder='Rôle' onChange={handleRoleChange}>
                        <option value={rolesList[0]._id}>{rolesList[0].name}</option>
                        <option value={rolesList[1]._id}>{rolesList[1].name}</option>
                      </select>
                    </div>
                    )
                  : ''
              }
              <select multiple value={classes} id='classe-select' className='pop-input' name='Classe' placeholder='Classes' onChange={handleClasseChange}>
                {classesList.map((classe_) => (
                  <option key={classe_._id} value={classe_._id}>
                    {classe_.name}
                  </option>
                ))}
              </select>
            </form>
          }
                        />
      }
      {
        isOpenMany && <Popup
          handleClose={handleManyAccounts}
          title={"Création d'une liste de comptes Etudiant/Professeur"}
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
                <p>firstname,lastname,email,role,class</p>
                <p>jeanne,dupont,jeanne@schood.fr,student,200</p>
                <p>jean,dupond,jean@schood.fr,teacher,200:201</p>
              </div>
            </div>
          }
                      />
      }
    </div>
  )
}
