import React from 'react'
import Profil from '../../Components/Profil/profilPage'
import HeaderComp from '../../Components/Header/headerComp'
import Sidebar from '../../Components/Sidebar/sidebar'
import '../../css/pages/profilPage.scss'

const ProfilPage = () => {
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
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilPage
