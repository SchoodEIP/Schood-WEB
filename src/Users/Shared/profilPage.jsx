import React from 'react'
import Profil from '../../Components/Profil/profilPage'
import HeaderComp from '../../Components/Header/headerComp'
import Sidebar from '../../Components/Sidebar/sidebar'
import Feelings from '../../Components/Feelings/feelingsShared'
import '../../css/pages/profilPage.scss'

const ProfilPage = () => {
  const isStudent = sessionStorage.getItem('role') === 'student'
  return (
    <div>
      <div>
        <HeaderComp />
      </div>
      <div className='different-page-content'>
        <div>
          <Sidebar />
        </div>
        <div className='left-half'>
          <div>
            <Profil />
            {isStudent && <Feelings />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilPage
