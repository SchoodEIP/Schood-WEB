import { React, useState } from 'react'
import HeaderComp from '../../Components/Header/headerComp'
import SchoolAccountsTable from '../../Components/Accounts/SchoolAdm/schoolAccountsTable'
import CsvAccountCreationPopupContent from '../../Components/Popup/csvAccountCreation'
import SingleAccountCreationPopupContent from '../../Components/Popup/singleAccountCreation'
import FacilityClassesCreationPopupContent from '../../Components/Popup/facilityClassesCreation'
import '../../css/pages/accountsPage.scss'
import '../../css/Components/Popup/popup.scss'
import Popup from 'reactjs-popup'
import cross from '../../assets/Cross.png'

export default function SchoolAdmAccountsPage () {
  const [isOpenSingle, setIsOpenSingle] = useState(false)
  const [isOpenMany, setIsOpenMany] = useState(false)
  const [isOpenClasses, setIsOpenClasses] = useState(false)
  const [isUpdated, setIsUpdated] = useState(false)

  const handleSingleAccount = () => {
    setIsOpenSingle(!isOpenSingle)
    if (isOpenMany) {
      setIsOpenMany(!isOpenMany)
    }
    if (isOpenClasses) {
      setIsOpenClasses(!isOpenClasses)
    }
  }

  const handleManyAccounts = () => {
    setIsOpenMany(!isOpenMany)
    if (isOpenSingle) {
      setIsOpenSingle(!isOpenSingle)
    }
    if (isOpenClasses) {
      setIsOpenClasses(!isOpenClasses)
    }
  }

  const handleClasses = () => {
    setIsOpenClasses(!isOpenClasses)
    if (isOpenMany) {
      setIsOpenMany(!isOpenMany)
    }
    if (isOpenSingle) {
      setIsOpenSingle(!isOpenSingle)
    }
  }

  const handleUpdateContent = () => {
    setIsOpenMany(false)
    setIsOpenSingle(false)
    setIsOpenClasses(false)
    setIsUpdated(!isUpdated)
  }

  const buttonComponent = [
    {
      name: 'Ajouter un Compte',
      handleFunction: handleSingleAccount
    },
    {
      name: 'Ajouter une Liste de Comptes',
      handleFunction: handleManyAccounts
    },
    {
      name: 'Gérer les classes',
      handleFunction: handleClasses
    }
  ]

  return (
    <div>
      <div>
        <HeaderComp
          title={sessionStorage.getItem('role') !== 'teacher' ? 'Gestion des Comptes' : 'Comptes'}
          withLogo
          showButtons={sessionStorage.getItem('role') !== 'teacher'}
          buttonComponent={buttonComponent}
        />
      </div>
      <div className='page-content'>
        <Popup open={isOpenSingle} onClose={() => setIsOpenSingle(false)} modal>
          {(close) => (
            <div className='popup-modal-container' style={{ alignItems: 'center' }}>
              <button className='close-btn' onClick={close}><img src={cross} alt='Close' /></button>
              <SingleAccountCreationPopupContent handleUpdateContent={handleUpdateContent}/>
            </div>
          )}
        </Popup>
        <Popup open={isOpenMany} onClose={() => setIsOpenMany(false)} modal>
          {(close) => (
            <div className='popup-modal-container' style={{ padding: '50px', gap: '50px', alignItems: 'center' }}>
              <button className='close-btn' onClick={close}><img src={cross} alt='Close' /></button>
              <CsvAccountCreationPopupContent />
            </div>
          )}
        </Popup>
        <Popup open={isOpenClasses} onClose={() => setIsOpenClasses(false)} modal>
          {(close) => (
            <div className='popup-modal-container' style={{ padding: '50px', gap: '50px', alignItems: 'center' }}>
              <button className='close-btn' onClick={close}><img src={cross} alt='Close' /></button>
              <FacilityClassesCreationPopupContent />
            </div>
          )}
        </Popup>
        <SchoolAccountsTable handleUpdateContent={handleUpdateContent} isUpdated={isUpdated} status={sessionStorage.getItem('role') !== 'teacher'} />
      </div>
    </div>
  )
}
