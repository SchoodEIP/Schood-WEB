import { useEffect, useState } from 'react'
import '../../../css/Components/Accounts/accountsTable.css'

export default function AdmAccountsTable () {
  const [accountList, setAccountList] = useState([]) // list of accounts

  // get request for account list
  async function getAccountList () {
    const baseUrl = process.env.REACT_APP_BACKEND_URL + '/user/all'
    const token = sessionStorage.getItem('token')

    const resp = await fetch(baseUrl, {
      method: 'GET',
      headers: {
        'x-auth-token': token
      }
    })
    const data = await resp.json()

    setAccountList(data)
  }

  // account list request on mounted
  useEffect(() => {
    getAccountList()
  }, [])

  return (
    <div className='AccountsTable'>
      <div className='tableBlock'>
        <table className='accountTable'>
          <thead className='tableHead'>
            <tr className='topTable'>
              <th className='valHead1bis'>Prénom</th>
              <th className='valHead2'>Nom</th>
              <th className='valHead3bis'>Email</th>
            </tr>
          </thead>
          <tbody className='tableBody'>
            {
              accountList.map((data, index) =>
                <tr key={index}>
                  <td>{data.firstname}</td>
                  <td>{data.lastname}</td>
                  <td>{data.email}</td>
                </tr>
              )
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}
