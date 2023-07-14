import React from 'react';
import HeaderComp from '../../Components/Header/HeaderComp';
import Sidebar from '../../Components/Sidebar/Sidebar';
import SchoolAccountsTable from '../../Components/Accounts/SchoolAdm/SchoolAccountsTable';
import SchoolAdmAccountCreation from '../../Components/Accounts/SchoolAdm/SchoolAdmAccountCreation';
import '../../css/pages/accountsPage.scss'

export default function SchoolAdmAccountsPage () {
  return (
    <div>
      <div>
        <HeaderComp />
      </div>
      <div className='page-content'>
        <div>
          <Sidebar />
        </div>
        <div className="table-div">
          <SchoolAccountsTable />
        </div>
        <div className="account-div">
          <SchoolAdmAccountCreation />
        </div>
      </div>
    </div>
  )
}
