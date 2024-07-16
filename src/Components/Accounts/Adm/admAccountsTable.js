import { useEffect, useState } from 'react'
import '../../../css/Components/Accounts/accountsTable.css'
import { disconnect } from '../../../functions/disconnect'
import { toast } from 'react-toastify'
import DeleteAccountPopupContent from '../../Popup/deleteAccount'
import Popup from 'reactjs-popup'
import cross from '../../../assets/Cross.png'

export default function AdmAccountsTable () {
  const [accountList, setAccountList] = useState([]) // list of accounts
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [userId, setUserId] = useState("")

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
    }
  }

  useEffect(() => {
    getAccountList()
  }, [])

  const openPopup = () => {
    if (isPopupOpen)
      setUserId('')
    setIsPopupOpen(!isPopupOpen)
  }

  const callDeleteAccount = (deleteType, user_id) => {
    setUserId(user_id)
    if (deleteType)
      setIsPopupOpen(!isPopupOpen)
    else
      deleteAccount(deleteType, user_id)
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

  return (
    <div className='AccountsTable'>
      <Popup open={isPopupOpen} onClose={openPopup} modal>
        {(close) => (
          <div className='popup-modal-container' style={{ alignItems: 'center' }}>
            <button className='close-btn' onClick={close}><img src={cross} alt='Close' /></button>
            <DeleteAccountPopupContent user_id={userId} deleteUserAccount={deleteAccount} closeDeleteAccountPopup={close} />
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
              <th className='valHead2'>Suspendre le Compte</th>
              <th className='valHead3bis'>Supprimer le Compte</th>
            </tr>
          </thead>
          <tbody className='tableBody'>
            {
              accountList.map((data, index) =>
                <tr key={index}>
                  <td>{data.firstname}</td>
                  <td>{data.lastname}</td>
                  <td>{data.email}</td>
                  <td><button onClick={() => callDeleteAccount(false, data._id)} >Suspendre le Compte</button></td>
                  <td><button onClick={() => callDeleteAccount(true, data._id)} >Supprimer le Compte</button></td>
                </tr>
              )
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}
