import React, { useState } from 'react'
import Profil from '../../Components/Profil/profilPage'
import HeaderComp from '../../Components/Header/headerComp'
import '../../css/pages/profilPage.scss'

const ProfilPage = () => {
  const [isModif, setIsModif] = useState(false)

  const handleProfileModification = () => {
    setIsModif(!isModif)
  }

  const buttonComponent = [
    {
      name: 'Modifier',
      handleFunction: handleProfileModification
    }
  ]

  return (
    <div>
      <div>
        <HeaderComp
          title='Mon Profil'
          withLogo
          showButtons
          buttonComponent={buttonComponent}
        />
      </div>
      <Profil isModif={isModif} handleProfileModification={handleProfileModification} />
    </div>
  )
}

export default ProfilPage
