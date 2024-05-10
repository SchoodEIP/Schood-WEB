import { React, useState } from 'react'
import HeaderComp from '../../Components/Header/headerComp'
import AdmAccountsTable from '../../Components/Accounts/Adm/admAccountsTable.js'
import CsvAccountCreationPopupContent from '../../Components/Popup/csvAccountCreation'
import SingleAccountCreationPopupContent from '../../Components/Popup/singleAccountCreation'
import Popup from 'reactjs-popup'
import cross from '../../assets/Cross.png'
import '../../css/pages/accountsPage.scss'
import '../../css/Components/Popup/popup.scss'

export default function AdmAccountsPage () {
  const [isOpenSingle, setIsOpenSingle] = useState(false)
  const [isOpenMany, setIsOpenMany] = useState(false)

  const handleSingleAccount = () => {
    setIsOpenSingle(!isOpenSingle)
    if (isOpenMany) {
      setIsOpenMany(false)
    }
  }

  const handleManyAccounts = () => {
    setIsOpenMany(!isOpenMany)
    if (isOpenSingle) {
      setIsOpenSingle(false)
    }
  }



  const buttonComponent = [
    {
      name: 'Ajouter un Compte',
      function: handleSingleAccount
    },
    {
      name: 'Ajouter une Liste de Comptes',
      function: handleManyAccounts
    }
  ]

  return (
    <div>
      <div>
        <HeaderComp
          title='Gestion des Comptes'
          withLogo
          showButtons
          buttonComponent={buttonComponent}
        />
      </div>
      <div className='page-content' style={{ alignContent: 'center', justifyContent: 'center' }}>
        <AdmAccountsTable />
      </div>
      <Popup open={isOpenSingle} onClose={handleSingleAccount} modal>
        {(close) => (
          <div className='popup-modal-container' style={{ padding: '50px', gap: '20px', alignItems: 'center' }}>
            <button className='close-btn' onClick={close}><img src={cross} alt='Close' /></button>
            <SingleAccountCreationPopupContent/>
          </div>
        )}
      </Popup>
      <Popup open={isOpenMany} onClose={handleManyAccounts} modal>
        {(close) => (
          <div className='popup-modal-container' style={{ padding: '50px', gap: '50px', alignItems: 'center' }}>
            <button className='close-btn' onClick={close}><img src={cross} alt='Close' /></button>
            <CsvAccountCreationPopupContent/>
          </div>
        )}
      </Popup>
    </div>
  )
}
