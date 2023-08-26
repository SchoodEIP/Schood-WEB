import '../../../css/Components/Accounts/AccountsTable.css'
import { React, useState, useEffect } from 'react'

export default function SchoolAccountsTable () {
  const [accountList, setAccountList] = useState([]); // list of accounts


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
    console.log(resp);
    const data = await resp.json();
    console.log(data);

    setAccountList(data);
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
                  <td>{data.classes.name}</td>
                </tr>
              )
            }
            {/* {
              studentAccountList.map((data, index) =>
                <tr key={index}>
                  <td>{data.firstName}</td>
                  <td>{data.lastName}</td>
                  <td>{data.email}</td>
                  <td>{data.role}</td>
                  <td>{data.classe}</td>
                </tr>
              )
            } */}
          </tbody>
        </table>
      </div>
    </div>
  )
}
