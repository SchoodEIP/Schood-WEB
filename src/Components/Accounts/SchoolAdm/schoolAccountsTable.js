import { React, useState, useEffect } from 'react'
import '../../../css/Components/Accounts/accountsTable.css'
import userIcon from '../../../assets/userIcon.png'
import { disconnect } from '../../../functions/disconnect'
import { toast } from 'react-toastify'
import DeleteAccountPopupContent from '../../Popup/deleteAccount'
import Popup from 'reactjs-popup'
import cross from '../../../assets/Cross.png'
import deleteButton from '../../../assets/deleteIcon.png'
import suspendButton from '../../../assets/suspendIcon.png'
import restoreButton from '../../../assets/restoreIcon.png'
import Select from 'react-select'

export default function SchoolAccountsTable ({ status }) {
  const [teacherList, setTeacherList] = useState([])
  const [studentList, setStudentList] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [fileImage, setFileImage] = useState(null)
  const [userId, setUserId] = useState('')
  const [isMultiStatus, setIsMultiStatus] = useState(true)
  const [classesList, setClassesList] = useState([])
  const [actionType, setActionType] = useState('delete')
  const [classError, setClassError] = useState(false)
  const [updatedUser, setUpdatedUser] = useState({
    firstname: '',
    lastname: '',
    email: '',
    classes: [],
    picture: null,
    role: ''
  })

  async function getSuspendedAccountList (accounts) {
    const baseUrl = process.env.REACT_APP_BACKEND_URL + '/user/getDisabled'
    const token = sessionStorage.getItem('token')

    const resp = await fetch(baseUrl, {
      method: 'GET',
      headers: {
        'x-auth-token': token,
        'Content-Type': 'application/json'
      }
    })
    if (resp.status === 401) {
      disconnect()
    } else {
      const data = await resp.json()

      if (data.message !== 'Access Forbidden') {
        const array = [...accounts, ...data]

        const teacherAccounts = array.filter(account => account.role.name === 'teacher')
        const studentAccounts = array.filter(account => account.role.name === 'student')
        setTeacherList(teacherAccounts)
        setStudentList(studentAccounts)
      }
    }
  }

  async function getAccountList () {
    const baseUrl = `${process.env.REACT_APP_BACKEND_URL}/user/all`
    const token = sessionStorage.getItem('token')

    const resp = await fetch(baseUrl, {
      method: 'GET',
      headers: {
        'x-auth-token': token,
        'Content-Type': 'application/json'
      }
    })

    if (resp.status === 401) {
      disconnect()
    } else {
      const data = await resp.json()

      const teacherAccounts = data.filter(account => account.role.name === 'teacher')
      const studentAccounts = data.filter(account => account.role.name === 'student')

      setTeacherList(teacherAccounts)
      setStudentList(studentAccounts)
      getSuspendedAccountList(data)
    }

    fetch(process.env.REACT_APP_BACKEND_URL + '/shared/classes', {
      method: 'GET',
      headers: {
        'x-auth-token': sessionStorage.getItem('token'),
        'Content-Type': 'application/json'
      }
    })
      .then((response) => {
        if (response.status === 401) {
          disconnect()
        }
        return response.json()
      })
      .then((data) => setClassesList(data))
      .catch((error) => {
        toast.error(error.message)
      })
  }

  const showClasses = (classes) => {
    if (!Array.isArray(classes)) {
      return ''
    }
    const names = classes.map(obj => obj.name)
    return names.join(', ')
  }

  const handleShowProfile = (id) => {
    window.location.href = '/profile/' + id
  }

  // account list request on mounted
  useEffect(() => {
    getAccountList()
  }, [])

  const handleEditClick = (user) => {
    setSelectedUser(user)
    setUpdatedUser({
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      classes: user.classes,
      picture: user.picture,
      role: user.role._id
    })
    setIsMultiStatus(user.role.name === 'teacher')
    setIsEditing(true)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setUpdatedUser(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleClassChange = (e) => {
    setUpdatedUser(prevState => ({
      ...prevState,
      classes: e
    }))
  }

  const handleFileChange = (e) => {
    setFileImage(e.target.files[0])
    setUpdatedUser(prevState => ({
      ...prevState,
      picture: e.target.files[0]
    }))
  }

  function callAction (classe, action) {
    fetch(process.env.REACT_APP_BACKEND_URL + '/adm/classes/' + classe._id + action, {
      method: 'PATCH',
      headers: {
        'x-auth-token': sessionStorage.getItem('token'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(action === '/updateStudent' ? { studentId: selectedUser._id } : { teacherId: selectedUser._id })
    })
      .then((response) => {
        if (response.status === 401) {
          disconnect()
        }
      })
      .catch((error) => {
        setClassError(true)
        toast.error('Un problème est survenu avec la classe.', error.message)
      })
  }

  const handleUltimateClassChange = () => {
    if (selectedUser.role.name === 'teacher') {
      const removeClasses = []
      const addClasses = []

      // Assuming selectedUser and updatedUser have a `classes` property that is an array
      const selectedUserClasses = selectedUser.classes || []
      const updatedUserClasses = updatedUser.classes || []

      addClasses.push(...updatedUserClasses.filter((cls) => !selectedUserClasses.includes(cls)))

      removeClasses.push(...selectedUserClasses.filter((cls) => !updatedUserClasses.includes(cls)))

      removeClasses.map((classe) => { return callAction(classe, '/removeTeacher') })
      addClasses.map(classe => { return callAction(classe, '/addTeacher') })
    } else {
      const studentClass = []
      studentClass.push(updatedUser.classes)

      studentClass.map(classe => { return callAction(classe, '/updateStudent') })
    }
    if (!classError) { toast.success('Le profil a été mis à jour avec succès.') }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()

    try {
      const formData = new FormData()
      formData.append('firstname', updatedUser.firstname)
      formData.append('lastname', updatedUser.lastname)
      formData.append('role', updatedUser.role)
      formData.append('email', updatedUser.email)

      if (fileImage) {
        formData.append('file', fileImage)
      }

      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/modifyProfile/${selectedUser._id}`, {
        method: 'PATCH',
        headers: {
          'x-auth-token': sessionStorage.getItem('token')
        },
        body: formData
      })

      if (response.status === 401) {
        disconnect()
      } else if (response.ok) {
        setIsEditing(false)
        setFileImage(null)
        handleUltimateClassChange()
        getAccountList() // Refresh the list
        setClassError(false)
      } else {
        toast.error('Erreur lors de la mise à jour du profil: ' + response.statusText)
      }
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du profil: ', error.message)
    }
  }

  async function deleteAccount (deleteType, accountId) {
    const baseUrl = process.env.REACT_APP_BACKEND_URL + '/adm/deleteUser/' + accountId
    const token = sessionStorage.getItem('token')

    const resp = await fetch(baseUrl, {
      method: 'DELETE',
      headers: {
        'x-auth-token': token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        deletePermanently: deleteType
      })
    })
    if (resp.status === 401) {
      disconnect()
    } else if (resp.status === 200) {
      toast.success(deleteType ? 'Le compte a été supprimé' : 'Le compte a été suspendu')
      getAccountList()
      setIsPopupOpen(false)
    } else {
      toast.error("une alerte s'est produite")
      getAccountList()
    }
  }

  async function activateAccount (accountId) {
    const baseUrl = process.env.REACT_APP_BACKEND_URL + '/adm/activateUser/' + accountId
    const token = sessionStorage.getItem('token')

    const resp = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'x-auth-token': token,
        'Content-Type': 'application/json'
      }
    })
    if (resp.status === 401) {
      disconnect()
    } else if (resp.status === 200) {
      toast.success('Le compte a été restauré')
      getAccountList()
      setIsPopupOpen(false)
    } else {
      toast.error("une alerte s'est produite")
      getAccountList()
    }
  }

  const openPopup = () => {
    setUserId('')
    setIsPopupOpen(!isPopupOpen)
  }

  const openEditing = () => {
    setIsEditing(!isEditing)
  }

  const callDeleteAccount = (userIdValue, action) => {
    setActionType(action)
    setUserId(userIdValue)
    setIsPopupOpen(!isPopupOpen)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Popup open={isPopupOpen} onClose={openPopup} modal>
        {(close) => (
          <div className='popup-modal-container' style={{ alignItems: 'center' }}>
            <button className='close-btn' onClick={close}><img src={cross} alt='Close' /></button>
            <DeleteAccountPopupContent userIdValue={userId} actionType={actionType} deleteUserAccount={deleteAccount} activateAccount={activateAccount} closeDeleteAccountPopup={close} />
          </div>
        )}
      </Popup>
      <Popup open={isEditing} onClose={openEditing} modal>
        {(close) => (
          <div className='popup-modal-container' style={{ alignItems: 'center' }}>
            <button className='close-btn' onClick={close}><img src={cross} alt='Close' /></button>
            <div className='editProfileForm'>
              <h2>Modifier Profil</h2>
              <form className='form-profile-modif' onSubmit={handleUpdate}>
                <div>
                  <label className='input-label' htmlFor='firstname'>Prénom:
                    <input
                      type='text'
                      id='firstname'
                      name='firstname'
                      value={updatedUser.firstname}
                      onChange={handleInputChange}
                    />
                  </label>
                </div>
                <div>
                  <label className='input-label' htmlFor='lastname'>Nom:
                    <input
                      type='text'
                      id='lastname'
                      name='lastname'
                      value={updatedUser.lastname}
                      onChange={handleInputChange}
                    />
                  </label>
                </div>
                <div>
                  <label className='input-label' htmlFor='email'>Email:
                    <input
                      type='email'
                      id='email'
                      name='email'
                      value={updatedUser.email}
                      onChange={handleInputChange}
                    />
                  </label>
                </div>
                <div>
                  <label className='input-label' htmlFor='classes'>Classes:
                    <Select
                      isMulti={isMultiStatus}
                      data-testid='classes'
                      id='classes'
                      placeholder='Sélectionner une ou plusieurs classes'
                      options={classesList}
                      value={updatedUser.classes}
                      onChange={handleClassChange}
                      getOptionValue={(option) => option._id}
                      getOptionLabel={(option) => option.name}
                    />
                  </label>
                </div>
                <div>
                  <label className='input-label' htmlFor='picture'>Photo de profil:
                    <input
                      type='file'
                      id='picture'
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
                <button type='submit'>Mettre à jour</button>
              </form>
            </div>
          </div>
        )}
      </Popup>
      <div className='AccountsTable'>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <h2 className='tableTitle'>Professeur</h2>
          <div className='newBreak' />
        </div>
        <div className='tableBlock'>
          <table className='accountTable'>
            <thead className='tableHead'>
              <tr className='topTable'>
                <th className='valHead1' />
                <th className='valHead2'>Prénom</th>
                <th className='valHead3'>Nom</th>
                <th className='valHead4'>Email</th>
                <th className='valHead5'>Classe(s)</th>
                {status && <th className='valHead6'>Modifier</th>}
                {status ? <th className='valHead5' /> : ''}
              </tr>
            </thead>
            <tbody className='tableBody'>
              {
                teacherList.map((data, index) =>
                  <tr key={index} title='Accéder au profil' onClick={() => handleShowProfile(data._id)}>
                    <td title={`${data.firstname} ${data.lastname}`}><img style={{ width: '50px', borderRadius: '50%' }} src={data.picture ? data.picture : userIcon} alt='img de profil' /></td>
                    <td title={`${data.firstname} ${data.lastname}`}>{data.firstname}</td>
                    <td title={`${data.firstname} ${data.lastname}`}>{data.lastname}</td>
                    <td title={`${data.email}`}>{data.email}</td>
                    <td>{showClasses(data.classes)}</td>
                    {status && <td>{data.active && <button style={{ fontFamily: 'Inter' }} onClick={(e) => { e.stopPropagation(); handleEditClick(data) }} title='Modifier le profil'>Modifier</button>}</td>}
                    {status &&
                      <td>
                        {
                          data.active
                            ? <img data-testid='suspendBtn' className='suspendBtn' onClick={(e) => { e.stopPropagation(); callDeleteAccount(data._id, 'suspend') }} src={suspendButton} alt='delete' title='Suspendre le compte' />
                            : <img data-testid='suspendBtn' className='suspendBtn' onClick={(e) => { e.stopPropagation(); callDeleteAccount(data._id, 'restore') }} src={restoreButton} alt='delete' title='Restaurer le compte' />
                        }
                        <img data-testid='suspendBtn' className='suspendBtn' onClick={(e) => { e.stopPropagation(); callDeleteAccount(data._id, 'delete') }} src={deleteButton} alt='delete' title='Supprimer le compte' />
                      </td>}
                  </tr>
                )
              }
            </tbody>
          </table>
        </div>
      </div>
      <div className='AccountsTable'>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <h2 className='tableTitle'>Etudiant</h2>
          <div className='newBreak' />
        </div>
        <div className='tableBlock'>
          <table className='accountTable'>
            <thead className='tableHead'>
              <tr className='topTable'>
                <th className='valHead1' />
                <th className='valHead2'>Prénom</th>
                <th className='valHead3'>Nom</th>
                <th className='valHead4'>Email</th>
                <th className='valHead5'>Classe</th>
                {status && <th className='valHead6'>Modifier</th>}
                {status ? <th className='valHead5' /> : ''}
              </tr>
            </thead>
            <tbody className='tableBody'>
              {
                studentList.map((data, index) =>
                  <tr key={index} title='Accéder au profil' onClick={() => handleShowProfile(data._id)}>
                    <td title={`${data.firstname} ${data.lastname}`}><img style={{ width: '50px', borderRadius: '50%' }} src={data.picture ? data.picture : userIcon} alt='img de profil' /></td>
                    <td title={`${data.firstname} ${data.lastname}`}>{data.firstname}</td>
                    <td title={`${data.firstname} ${data.lastname}`}>{data.lastname}</td>
                    <td title={`${data.email}`}>{data.email}</td>
                    <td>{showClasses(data.classes)}</td>
                    {status && <td>{data.active && <button style={{ fontFamily: 'Inter' }} onClick={(e) => { e.stopPropagation(); handleEditClick(data) }} title='Modifier le profil'>Modifier</button>}</td>}
                    {status &&
                      <td>
                        {
                          data.active
                            ? <img data-testid='suspendBtn' className='suspendBtn' onClick={(e) => { e.stopPropagation(); callDeleteAccount(data._id, 'suspend') }} src={suspendButton} alt='delete' title='Suspendre le compte' />
                            : <img data-testid='suspendBtn' className='suspendBtn' onClick={(e) => { e.stopPropagation(); callDeleteAccount(data._id, 'restore') }} src={restoreButton} alt='delete' title='Restaurer le compte' />
                        }
                        <img data-testid='suspendBtn' className='suspendBtn' onClick={(e) => { e.stopPropagation(); callDeleteAccount(data._id, 'delete') }} src={deleteButton} alt='delete' title='Supprimer le compte' />
                      </td>}
                  </tr>
                )
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
