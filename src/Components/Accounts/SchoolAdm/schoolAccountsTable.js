import { React, useState, useEffect } from 'react'
import '../../../css/Components/Accounts/accountsTable.css'
import userIcon from '../../../assets/userIcon.png'
import { disconnect } from '../../../functions/disconnect'
import { toast } from 'react-toastify'
import DeleteAccountPopupContent from '../../Popup/deleteAccount'
import Popup from 'reactjs-popup'
import cross from '../../../assets/Cross.png'
import minusButton from '../../../assets/minus-button.png'

export default function SchoolAccountsTable () {
  const [teacherList, setTeacherList] = useState([])
  const [studentList, setStudentList] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [userId, setUserId] = useState('')
  const [updatedUser, setUpdatedUser] = useState({
    firstname: '',
    lastname: '',
    email: '',
    picture: null
  })

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
    }
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
      picture: user.picture
    })
    setIsEditing(true)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setUpdatedUser(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleFileChange = (e) => {
    setUpdatedUser(prevState => ({
      ...prevState,
      picture: e.target.files[0]
    }))
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      const formData = new FormData()
      formData.append('firstname', updatedUser.firstname)
      formData.append('lastname', updatedUser.lastname)
      formData.append('email', updatedUser.email)
      if (updatedUser.picture) {
        formData.append('file', updatedUser.picture)
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
        setSelectedUser(null)
        setUpdatedUser({
          firstname: '',
          lastname: '',
          email: '',
          picture: null
        })
        getAccountList() // Refresh the list
      } else {
        const text = await response.text()
        console.error('Erreur lors de la mise à jour du profil:', text)
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error.message)
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
    } else {
      toast.error("une alerte s'est produite")
      getAccountList()
    }
  }

  const openPopup = () => {
    setUserId('')
    setIsPopupOpen(!isPopupOpen)
  }

  const callDeleteAccount = (userIdValue) => {
    setUserId(userIdValue)
    setIsPopupOpen(!isPopupOpen)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Popup open={isPopupOpen} onClose={openPopup} modal>
        {(close) => (
          <div className='popup-modal-container' style={{ alignItems: 'center' }}>
            <button className='close-btn' onClick={close}><img src={cross} alt='Close' /></button>
            <DeleteAccountPopupContent userIdValue={userId} deleteUserAccount={deleteAccount} closeDeleteAccountPopup={close} />
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
                <th className='valHead6'>Modifier</th>
                {sessionStorage.getItem('role') !== 'teacher' ? <th className='valHead5' /> : ''}
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
                    <td><button onClick={(e) => {e.stopPropagation(); handleEditClick(data)}} title="Modifier le profil">Modifier</button></td>
                    {sessionStorage.getItem('role') !== 'teacher' && <td><img data-testid='suspendBtn' className='suspendBtn' onClick={(e) => { e.stopPropagation(); callDeleteAccount(data._id) }} src={minusButton} alt='delete' title='Supprimer ou suspendre le compte' /></td>}
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
                <th className='valHead6'>Modifier</th>
                {sessionStorage.getItem('role') !== 'teacher' ? <th className='valHead5' /> : ''}
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
                    <td><button onClick={(e) => {e.stopPropagation(); handleEditClick(data)}} title="Modifier le Profil">Modifier</button></td>
                    {sessionStorage.getItem('role') !== 'teacher' && <td><img data-testid='suspendBtn' className='suspendBtn' onClick={(e) => { e.stopPropagation(); callDeleteAccount(data._id) }} src={minusButton} alt='delete' title='Supprimer ou suspendre le compte' /></td>}
                  </tr>
                )
              }
            </tbody>
          </table>
        </div>
      </div>

      {isEditing && selectedUser && (
        <div className='editProfileForm'>
          <h2>Modifier Profil</h2>
          <form onSubmit={handleUpdate}>
            <div>
              <label htmlFor='firstname'>Prénom:</label>
              <input
                type='text'
                id='firstname'
                name='firstname'
                value={updatedUser.firstname}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor='lastname'>Nom:</label>
              <input
                type='text'
                id='lastname'
                name='lastname'
                value={updatedUser.lastname}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor='email'>Email:</label>
              <input
                type='email'
                id='email'
                name='email'
                value={updatedUser.email}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor='picture'>Photo de profil:</label>
              <input
                type='file'
                id='picture'
                onChange={handleFileChange}
              />
            </div>
            <button type='submit'>Mettre à jour</button>
            <button type='button' onClick={() => setIsEditing(false)}>Annuler</button>
          </form>
        </div>
      )}
    </div>
  )
}
