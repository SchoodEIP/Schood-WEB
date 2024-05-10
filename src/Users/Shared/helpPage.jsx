import React, { useState } from 'react'
import Popup from 'reactjs-popup'
import cross from '../../assets/Cross.png'
import HeaderComp from '../../Components/Header/headerComp'
import AidePage from '../../Components/Aides/aides'
import CategoryCreationPopupContent from '../../Components/Popup/categoryCreation'
import HelpNumberCreationPopupContent from '../../Components/Popup/helpNumberCreation'
import '../../css/pages/homePage.scss'

const HelpPage = () => {
  const role = sessionStorage.getItem('role')
  const [position, setPosition] = useState(0)
  const [isOpenCategory, setIsOpenCategory] = useState(false)
  const [isOpenNumber, setIsOpenNumber] = useState(false)

  const upPosition = () => {
    setPosition(position + 1)
  }

  const minusPosition = () => {
    setPosition(position - 1)
  }

  const handleCategoryCustomPopup = async () => {
    setIsOpenCategory(!isOpenCategory)
    if (isOpenNumber) {
      setIsOpenNumber(false)
    }
  }

  const handleNumberCustomPopup = async () => {
    setIsOpenNumber(!isOpenNumber)
    if (isOpenCategory) {
      setIsOpenCategory(false)
    }
  }

  const buttonComponent = [
    {
      name: 'Ajouter une Catégorie',
      function: handleCategoryCustomPopup
    },
    {
      name: 'Ajouter un Numéro',
      function: handleNumberCustomPopup
    }
  ]

  return (
    <div className='dashboard'>
      <div>
        <HeaderComp
          title='Mes Aides'
          withLogo
          withReturnBtn={position > 0}
          position={position}
          returnCall={minusPosition}
          showButtons={!!(role === 'administration' || role === 'admin')}
          buttonComponent={buttonComponent}
        />
      </div>
      <div className='help-page' style={{ marginLeft: '25px', marginRight: '25px', overflowY: 'auto' }}>
        <Popup open={isOpenCategory} onClose={() => setIsOpenCategory(false)} modal>
          {(close) => (
            <div className='popup-modal-container' style={{ padding: '50px', gap: '50px' }}>
              <button className='close-btn' onClick={close}><img src={cross} alt='Close' /></button>
              <CategoryCreationPopupContent/>
            </div>
          )}
        </Popup>
        <Popup open={isOpenNumber} onClose={() => setIsOpenNumber(false)} modal>
          {(close) => (
            <div className='popup-modal-container'>
              <button className='close-btn' onClick={close}><img src={cross} alt='Close' /></button>
              <HelpNumberCreationPopupContent/>
            </div>
          )}
        </Popup>
        <AidePage upPosition={upPosition} position={position} />
      </div>
    </div>
  )
}

export default HelpPage
