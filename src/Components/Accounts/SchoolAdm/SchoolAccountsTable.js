import '../../../css/Components/Accounts/AccountsTable.css'
import { React, useState, useEffect } from 'react'

export default function SchoolAccountsTable () {
  const [teacherAccountList, setTeacherAccountList] = useState([]) // list of accounts
  const [studentAccountList, setStudentAccountList] = useState([]) // list of accounts


  // get request for account list
  async function getAccountList () {
    const baseUrl = process.env.REACT_APP_BACKEND_URL + '/api/profiles/by/'
    const token = sessionStorage.getItem('token')

    const respTeacher = await fetch(baseUrl + 'teacher', {
      method: 'GET',
      headers: {
        'x-auth-token': token
      }
    })
    console.log(respTeacher);
    const tdata = await respTeacher.json()

    const respStudent = await fetch(baseUrl + 'student', {
      method: 'GET',
      headers: {
        'x-auth-token': token
      }
    })
    console.log(respStudent);
    const sdata = await respStudent.json()
    // const data = [
    //   {
    //     'firstName': 'Teacher',
    //     'lastName': '1',
    //     'email': 'teacher1@schood.fr',
    //     'role': 'Teacher',
    //     'classe': '1'
    //   },
    //   {
    //     'firstName': 'Student',
    //     'lastName': '1',
    //     'email': 'student1@schood.fr',
    //     'role': 'Student',
    //     'classe': '1'
    //   },
    // ];
    setTeacherAccountList(tdata);
    setStudentAccountList(sdata);
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
              teacherAccountList.map((data, index) =>
                <tr key={index}>
                  <td>{data.firstName}</td>
                  <td>{data.lastName}</td>
                  <td>{data.email}</td>
                  <td>{data.role}</td>
                  <td>{data.classe}</td>
                </tr>
              )
            }
            {
              studentAccountList.map((data, index) =>
                <tr key={index}>
                  <td>{data.firstName}</td>
                  <td>{data.lastName}</td>
                  <td>{data.email}</td>
                  <td>{data.role}</td>
                  <td>{data.classe}</td>
                </tr>
              )
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}
