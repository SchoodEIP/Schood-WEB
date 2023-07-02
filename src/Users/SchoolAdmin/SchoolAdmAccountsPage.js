import React from 'react';
import HeaderComp from '../../Components/Header/HeaderComp';
import Sidebar from '../../Components/Sidebar/Sidebar';
import SchoolAccountsTable from '../../Components/Accounts/SchoolAdm/SchoolAccountsTable';
import SchoolAdmAccountCreation from '../../Components/Accounts/SchoolAdm/SchoolAdmAccountCreation';
import '../../css/Users/SchoolAdmin/SchoolAdmAccountsPage.css'

export default function SchoolAdmAccountsPage () {
  return (
    <div>
      <div>
        <HeaderComp />
      </div>
      <div
        className='page-body' style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          height: '100vh'
        }}
      >
        <div className='left-half' style={{ gridColumn: '1 / 2' }}>
          <Sidebar />
        </div>
        <div className='center-half' style={{ gridColumn: '2 / 3' }}>
          <SchoolAccountsTable />
        </div>
        <div className='right-half' style={{ gridColumn: '3 / 4' }}>
          <SchoolAdmAccountCreation />
        </div>
      </div>
    </div>
  )
}
