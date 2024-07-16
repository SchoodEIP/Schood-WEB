import { React } from 'react'
import HeaderComp from '../../Components/Header/headerComp'
import TeacherAccountsTable from '../../Components/Accounts/teacherAccountsTable'
import '../../css/pages/accountsPage.scss'
import '../../css/Components/Popup/popup.scss'

export default function TeacherAccountsPage () {
    return (
        <div>
          <div>
            <HeaderComp
              title='Liste des Comptes'
              withLogo
            />
          </div>
          <div className='page-content'>
            <TeacherAccountsTable />
          </div>
        </div>
      )
}