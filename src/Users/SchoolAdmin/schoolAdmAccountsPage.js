import { React, useState, useEffect } from 'react'
import HeaderComp from '../../Components/Header/headerComp'
import SchoolAccountsTable from '../../Components/Accounts/SchoolAdm/schoolAccountsTable'
import '../../css/pages/accountsPage.scss'
import '../../css/Components/Popup/popup.scss'
import Select from 'react-select'
import Popup from 'reactjs-popup'
import userIcon from '../../assets/userIcon.png'
import cross from "../../assets/Cross.png"

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
  const [titlesList, setTitlesList] = useState([])
  const [isMultiStatus, setIsMultiStatus] = useState(false)
  const [picture, setPicture] = useState(null)
  const [title, setTitle] = useState(null)
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

  useEffect(() => {
    const titlesUrl = process.env.REACT_APP_BACKEND_URL + '/shared/titles'

    fetch(titlesUrl, {
      method: 'GET',
      headers: {
        'x-auth-token': sessionStorage.getItem('token'),
        'Content-Type': 'application/json'
      }
    }).then(response => response.json())
      .then(data => {
        setTitlesList(data)
      })
      .catch(error => /* istanbul ignore next */ { setErrMessage(error.message) })
  }, [])

  const handleSingleAccount = () => {
    setIsOpenSingle(!isOpenSingle)
    setFirstName('')
    setName('')
    setEmail('')
    if (rolesList[1] !== undefined) { setRole(rolesList[1]._id) }
    setClasses([])
    setTitle('')
    setErrMessage('')
    setIsMultiStatus(false)
    setPicture(null)
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

  const handleTitleChange = (event) => {
    setTitle(event.target.value)
  }

  const handleRoleChange = (event) => {
    setRole(event.target.value)
    if (event.target.value === rolesList[1]._id) {
      setIsMultiStatus(false)
    } else {
      setIsMultiStatus(true)
    }
  }

  const handleClasseChange = (selected) => /* istanbul ignore next */ {
    if (role === rolesList[1]._id) {
      setClasses([selected])
    } else {
      setClasses(selected)
    }
  }

  const handleFileChange = (event) => {
    setFile(event.target.files[0])
  }

  const handlePictureChange = (event) => {
    const selectedFile = event.target.files[0];
    setPicture(event.target.files[0])
    if (selectedFile) {
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onload = () => {
          const base64Image = reader.result;
          setPicture(base64Image);
      };
      reader.onerror = (error) => {
          console.error('Error occurred while reading the file:', error);
      };
  }
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
        classes: classesArray,
        picture: picture
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
        <Popup open={isOpenSingle} close={() => setIsOpenSingle(false)} modal>
          {(close) => (
            <div className="popup-modal-container" style={{alignItems: 'center'}} >
              <button className="close-btn" onClick={close}><img src={cross} alt="Close"></img></button>
              <div style={{display: "flex", flexDirection: "row", gap: "10px"}}>
                <img style={{width: "50px", borderRadius: "50%"}} src={picture ? picture : userIcon} alt="photo de profil"/>
                <label className="input-label">
                  <span className="label-content">Changer la photo de Profil</span>
                  <input className="picture-input" name="picture" placeholder='Changer la photo' onChange={handlePictureChange} type='file' accept='.png, .jpeg, .jpg' />
              </label>
              </div>
              <label className="input-label">
                <span className="label-content">Nom <span style={{color: "red"}}>*</span></span>
                <input name="lastName" placeholder='Nom' type="text" onChange={handleNameChange} />
              </label>
              <label className="input-label">
                <span className="label-content">Prénom <span style={{color: "red"}}>*</span></span>
                <input name="firstName" placeholder='Prénom' type="text" onChange={handleFirstNameChange} />
              </label>
              <label className="input-label">
                <span className="label-content">Adresse Email <span style={{color: "red"}}>*</span></span>
                <input name="email" placeholder='prenom.nom.schood1@schood.fr' type="emai" onChange={handleEmailChange}/>
              </label>
              <label className="input-label">
                <span className="label-content">Rôle <span style={{color: "red"}}>*</span></span>
                {
                    (rolesList[0] !== undefined)
                      ? (
                          <select defaultValue={role} name='role' placeholder='Rôle' onChange={handleRoleChange}>
                            <option value={rolesList[1]._id}>{rolesList[1].name}</option>
                            <option value={rolesList[2]._id}>{rolesList[2].name}</option>
                          </select>
                        )
                      : ''
                  }
              </label>
              {
                (rolesList[0] !== undefined && role === rolesList[2]._id && titlesList !== undefined) ? (
                  <label className="input-label">
                    <span className="label-content">Titre <span style={{color: "red"}}>*</span></span>
                    <select defaultValue={title} name='title' placeholder='Titre' onChange={handleTitleChange}>
                      {
                        titlesList.map((title, index) => {
                          return <option key={index} value={title._id}>{title.name}</option>
                        })
                      }
                    </select>
                  </label>
                ) : ''
              }
              <label className="input-label">
                <span className="label-content">Classe(s) <span style={{color: "red"}}>*</span></span>
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
              </label>
              {errMessage ? <span style={{color: "red"}}>{errMessage}</span> : ''}
              <button className="popup-btn" onClick={singleAccountCreation}>Créer le Compte</button>
            </div>
          )}
        </Popup>
        <Popup open={isOpenMany} close={() => setIsOpenMany(false)} modal>
          {(close) => (
            <div className="popup-modal-container" style={{padding: "50px", gap: "50px", alignItems: 'center'}} >
              <button className="close-btn" onClick={close}><img src={cross} alt="Close"></img></button>
              <label style={{alignItems: 'center', gap: "25px"}}>
                <input className='input-csv' placeholder='exemple.csv' onChange={handleFileChange} type='file' accept='.csv' />
                <span className="label-content-warning">Le fichier attendu est un fichier .csv suivant le format: firstname,lastname,email,role,class</span>
              </label>
              {errMessage ? <span style={{color: "red"}}>{errMessage}</span> : ''}
              <button className="popup-btn" onClick={csvAccountCreation}>Créer le(s) Compte(s)</button>
            </div>
          )}
        </Popup>
        <SchoolAccountsTable />
      </div>
    </div>
  )
}
