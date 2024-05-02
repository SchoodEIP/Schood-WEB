import React from 'react'
import Profil from '../../Components/Profil/profilPage'
import HeaderComp from '../../Components/Header/headerComp'
import '../../css/pages/profilPage.scss'

const ProfilPage = () => {
  return (
    <div>
      <div>
        <HeaderComp
          title='Mon Profile'
          withLogo
        />
      </div>
      <Profil />
    </div>
  )
}

export default ProfilPage
