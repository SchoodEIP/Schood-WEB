import '../../../css/Components/Accounts/accountsTable.css'
import { React, useState, useEffect } from 'react'

export default function SchoolAccountsTable () {
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

  const showClasses = (classes) => {
    if (!Array.isArray(classes)) {
      return '';
    }
    const names = classes.map(obj => obj.name)
    return names.join(", ")
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
              <th id='valHead4'>Rôle</th>
              <th id='valHead5'>Classe</th>
            </tr>
          </thead>
          <tbody id='tableBody'>
            {
              accountList.map((data, index) =>
                <tr key={index}>
                  <td>{data.firstname}</td>
                  <td>{data.lastname}</td>
                  <td>{data.email}</td>
                  <td>{data.role.name}</td>
                  <td>{showClasses(data.classes)}</td>
                </tr>
              )
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}
