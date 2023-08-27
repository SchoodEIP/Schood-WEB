import { useEffect, useState } from 'react'
import '../../../css/Components/Accounts/Adm/AdmAccountsTable.css'

export default function AdmAccountsTable () {
  const [accountList, setAccountList] = useState([]) // list of accounts

  // get request for account list
  async function getAccountList () {
    const baseUrl = process.env.REACT_APP_BACKEND_URL + '/administration/admin'
    const token = sessionStorage.getItem('token')

    const resp = await fetch(baseUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
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
      <div id='tableBlock'>
        <table id='accountTable'>
          <thead id='tableHead'>
            <tr id='topTable'>
              <th id='valHead1'>Prénom</th>
              <th id='valHead2'>Nom</th>
              <th id='valHead3'>Email</th>
            </tr>
          </thead>
          <tbody id='tableBody'>
            {
                        accountList.map((data, index) =>
                          <tr key={index}>
                            <td>{data.firstName}</td>
                            <td>{data.lastName}</td>
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
