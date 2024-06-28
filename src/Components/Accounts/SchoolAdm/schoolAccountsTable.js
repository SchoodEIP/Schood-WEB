import { React, useState, useEffect } from 'react'
import '../../../css/Components/Accounts/accountsTable.css'
import userIcon from '../../../assets/userIcon.png'
import { disconnect } from '../../../functions/disconnect'

export default function SchoolAccountsTable () {
  const [teacherList, setTeacherList] = useState([])
  const [studentList, setStudentList] = useState([])

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

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
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
                {/* <th className='valHead2'>Titre</th> */}
                <th className='valHead5'>Classe(s)</th>
              </tr>
            </thead>
            <tbody className='tableBody'>
              {
                teacherList.map((data, index) =>
                  <tr key={index} title='Accéder au profil' onClick={() => handleShowProfile(data._id)}>
                    <td><img style={{ width: '50px', borderRadius: '50%' }} src={data.picture ? data.picture : userIcon} alt='img de profil' /></td>
                    <td>{data.firstname}</td>
                    <td>{data.lastname}</td>
                    <td>{data.email}</td>
                    {/* <td>{data.title}</td> */}
                    <td>{showClasses(data.classes)}</td>
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
              </tr>
            </thead>
            <tbody className='tableBody'>
              {
                studentList.map((data, index) =>
                  <tr key={index} title='Accéder au profil' onClick={() => handleShowProfile(data._id)}>
                    <td><img style={{ width: '50px', borderRadius: '50%' }} src={data.picture ? data.picture : userIcon} alt='profil' /></td>
                    <td>{data.firstname}</td>
                    <td>{data.lastname}</td>
                    <td>{data.email}</td>
                    <td>{showClasses(data.classes)}</td>
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
