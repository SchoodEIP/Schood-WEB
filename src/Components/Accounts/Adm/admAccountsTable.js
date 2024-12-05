import { useEffect, useState } from 'react'
import '../../../css/Components/Accounts/accountsTable.css'
import { disconnect } from '../../../functions/disconnect'
import { toast } from 'react-toastify'
import DeleteAccountPopupContent from '../../Popup/deleteAccount'
import Popup from 'reactjs-popup'
import cross from '../../../assets/Cross.png'
import deleteButton from '../../../assets/deleteIcon.png'
import suspendButton from '../../../assets/suspendIcon.png'
import restoreButton from '../../../assets/restoreIcon.png'

export default function AdmAccountsTable ({handleUpdateContent, isUpdated}) {
  const [accountList, setAccountList] = useState([]) // list of accounts
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [userId, setUserId] = useState('')
  const [actionType, setActionType] = useState('delete')

  async function getAccountList () {
    const baseUrl = process.env.REACT_APP_BACKEND_URL + '/user/all'
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
      setAccountList(data)
      getSuspendedAccountList(data)
    }
  }

  useEffect(() => {
    if (isUpdated) {
      getAccountList()
      handleUpdateContent()
    }
  }, [isUpdated])

  async function getSuspendedAccountList (list) {
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
      const array = [...list, ...data]
      setAccountList(array)
    }
  }

  useEffect(() => {
    getAccountList()
  }, [])

  const openPopup = () => {
    setIsPopupOpen(!isPopupOpen)
  }

  const callDeleteAccount = (userIdValue, action) => {
    setActionType(action)
    setUserId(userIdValue)
    setIsPopupOpen(!isPopupOpen)
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
      setIsPopupOpen(false)
      toast.success(deleteType ? 'Le compte a été supprimé' : 'Le compte a été suspendu')
      getAccountList()
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
      setIsPopupOpen(false)
      toast.success('Le compte a été restauré')
      getAccountList()
    } else {
      toast.error("une alerte s'est produite")
      getAccountList()
    }
  }

  return (
    <div className='AccountsTable'>
      <Popup open={isPopupOpen} onClose={openPopup} modal>
        {(close) => (
          <div className='popup-modal-container' style={{ alignItems: 'center' }}>
            <button className='close-btn' onClick={close}><img src={cross} alt='Close' /></button>
            <DeleteAccountPopupContent userIdValue={userId} actionType={actionType} deleteUserAccount={deleteAccount} activateAccount={activateAccount} closeDeleteAccountPopup={close} />
          </div>
        )}
      </Popup>
      <div className='tableBlock'>
        <table className='accountTable'>
          <thead className='tableHead'>
            <tr className='topTable'>
              <th className='valHead1bis'>Prénom</th>
              <th className='valHead2'>Nom</th>
              <th className='valHead2'>Email</th>
              <th className='valHead5' />
            </tr>
          </thead>
          <tbody className='tableBody'>
            {
              accountList.map((data, index) =>
                <tr key={index}>
                  <td>{data.firstname}</td>
                  <td>{data.lastname}</td>
                  <td>{data.email}</td>
                  <td className='action-td'>
                    {
                      data.active
                        ? <img data-testid='suspendBtn' className='suspendBtn' onClick={(e) => { e.stopPropagation(); callDeleteAccount(data._id, 'suspend') }} src={suspendButton} alt='delete' title='Suspendre le compte' />
                        : <img data-testid='suspendBtn' className='suspendBtn' onClick={(e) => { e.stopPropagation(); callDeleteAccount(data._id, 'restore') }} src={restoreButton} alt='delete' title='Restaurer le compte' />
                    }
                    <img data-testid='suspendBtn' className='suspendBtn' onClick={(e) => { e.stopPropagation(); callDeleteAccount(data._id, 'delete') }} src={deleteButton} alt='delete' title='Supprimer le compte' />
                  </td>
                </tr>
              )
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}
