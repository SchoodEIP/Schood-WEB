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
  const [isOpenCategory, setIsOpenCategory] = useState(false)
  const [isOpenNumber, setIsOpenNumber] = useState(false)

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
      handleFunction: handleCategoryCustomPopup
    },
    {
      name: 'Ajouter un Numéro',
      handleFunction: handleNumberCustomPopup
    }
  ]

  return (
    <div className='dashboard'>
      <div>
        <HeaderComp
          title='Mes Aides'
          withLogo
          showButtons={!!(role === 'administration' || role === 'admin')}
          buttonComponent={buttonComponent}
        />
      </div>
      <div className='help-page' style={{ marginLeft: '25px', marginRight: '25px', overflowY: 'auto' }}>
        <Popup open={isOpenCategory} onClose={() => setIsOpenCategory(false)} modal>
          {(close) => (
            <div className='popup-modal-container' style={{ padding: '50px', gap: '50px' }}>
              <button className='close-btn' onClick={close}><img src={cross} alt='Close' /></button>
              <CategoryCreationPopupContent />
            </div>
          )}
        </Popup>
        <Popup open={isOpenNumber} onClose={() => setIsOpenNumber(false)} modal>
          {(close) => (
            <div className='popup-modal-container'>
              <button className='close-btn' onClick={close}><img src={cross} alt='Close' /></button>
              <HelpNumberCreationPopupContent />
            </div>
          )}
        </Popup>
        <AidePage />
      </div>
    </div>
  )
}

export default HelpPage
