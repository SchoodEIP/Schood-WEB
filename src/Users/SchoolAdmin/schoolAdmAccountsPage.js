import { React, useState, useEffect } from 'react'
import HeaderComp from '../../Components/Header/headerComp'
import SchoolAccountsTable from '../../Components/Accounts/SchoolAdm/schoolAccountsTable'
import '../../css/pages/accountsPage.scss'
import Popup from '../../Components/Popup/popup'
import '../../css/Components/Popup/popup.css'
import Select from 'react-select'

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
  const [isMultiStatus, setIsMultiStatus] = useState(false)
  const singleCreationUrl = process.env.REACT_APP_BACKEND_URL + '/adm/register'
  const csvCreationUrl = process.env.REACT_APP_BACKEND_URL + '/adm/csvRegisterUser'

  useEffect(() => {
    const rolesUrl = process.env.REACT_APP_BACKEND_URL + '/shared/classes'

    fetch(rolesUrl, {
      method: 'GET',
      headers: {
        'x-auth-token': sessionStorage.getItem('token'),
        'Content-Type': 'application/json'
      }
    }).then(response => response.json())
      .then(data => setClassesList(data))
      .catch(error => /* istanbul ignore next */ { setErrMessage(error.message) })
  }, [])

  useEffect(() => {
    const rolesUrl = process.env.REACT_APP_BACKEND_URL + '/shared/roles'

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
      .catch(error => /* istanbul ignore next */ { setErrMessage(error.message) })
  }, [])

  const handleSingleAccount = () => {
    setIsOpenSingle(!isOpenSingle)
    setFirstName('')
    setName('')
    setEmail('')
    if (rolesList[0] !== undefined) { setRole(rolesList[0]._id) }
    setClasses([])
    setErrMessage('')
    setIsMultiStatus(false)
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
    if (event.target.value === rolesList[0]._id) {
      setIsMultiStatus(false)
    } else {
      setIsMultiStatus(true)
    }
  }

  const handleClasseChange = (selected) => /* istanbul ignore next */ {
    if (role === rolesList[0]._id) {
      setClasses([selected])
    } else {
      setClasses(selected)
    }
  }

  const handleFileChange = (event) => {
    setFile(event.target.files[0])
  }

  const singleAccountCreation = async (event) => {
    event.preventDefault()

    let classesArray = []
    if (classes.length !== 0) {
      classesArray.push(classes)
    } else if (classes.length > 1) {
      classesArray = classes
    }

    await fetch(singleCreationUrl, {
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
        classes: classesArray
      })
    }).then((response) => {
      if (response.ok) {
        setErrMessage('Compte créé avec succès')
        window.location.reload()
      } else /* istanbul ignore next */ {
        const data = response.json()
        setErrMessage(data.message)
      }
    })
      .catch((error) => /* istanbul ignore next */ { setErrMessage(error.message) })
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
    }).then((response) => {
      if (response.ok) {
        setErrMessage('Compte(s) créé(s) avec succès')
        window.location.reload()
      } else /* istanbul ignore next */ {
        const data = response.json()

        setErrMessage(data.message)
      }
    })
      .catch((error) => /* istanbul ignore next */ { setErrMessage(error.message) })
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
          title="Gestion de Comptes"
          withLogo={true}
          showButtons={true}
          buttonComponent={buttonComponent}
        />
      </div>
      <div className='page-content'>
        <SchoolAccountsTable />
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
              <div style={{ marginTop: '25px' }}>
                <Select
                  isMulti={isMultiStatus}
                  data-testid='select-classes'
                  id='select-classes'
                  placeholder='Selectionner une ou plusieurs classes'
                  options={classesList}
                  value={classes}
                  onChange={handleClasseChange}
                  getOptionValue={(option) => (option._id)}
                  getOptionLabel={(option) => (option.name)}
                />
              </div>
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
                <p>jeanne,dupont,jeanne.dupont.Schood1@schood.fr,student,200</p>
                <p>jean,dupond,jean.dupond.Schood1@schood.fr,teacher,200:201</p>
                <p>L'addresse email contient le prénom, le nom et le nom de l'établissement séparés par un point.</p>
              </div>
            </div>
          }
                      />
      }
    </div>
  )
}
