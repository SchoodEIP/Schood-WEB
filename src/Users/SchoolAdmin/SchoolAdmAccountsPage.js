import React from 'react'
import HeaderComp from '../../Components/Header/HeaderComp'
import Sidebar from '../../Components/Sidebar/Sidebar'
import SchoolAccountsTable from '../../Components/Accounts/SchoolAdm/SchoolAccountsTable'
import './SchoolAdmAccountsPage.css'

export default function SchoolAdmAccountsPage () {
  return (
    <div>
      <div>
        <HeaderComp />
      </div>
      <div className='page-body'>
        <div className='left-half'>
          <Sidebar />
        </div>
        <div className='right-half'>
          <SchoolAccountsTable />
        </div>
      </div>
    </div>
  )
}
