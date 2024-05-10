import { React, useState } from 'react'
import HeaderComp from '../../Components/Header/headerComp'
import SchoolAccountsTable from '../../Components/Accounts/SchoolAdm/schoolAccountsTable'
import CsvAccountCreationPopupContent from '../../Components/Popup/csvAccountCreation'
import SingleAccountCreationPopupContent from '../../Components/Popup/singleAccountCreation'
import '../../css/pages/accountsPage.scss'
import '../../css/Components/Popup/popup.scss'
import Popup from 'reactjs-popup'
import cross from '../../assets/Cross.png'

export default function SchoolAdmAccountsPage () {
  const [isOpenSingle, setIsOpenSingle] = useState(false)
  const [isOpenMany, setIsOpenMany] = useState(false)

  const handleSingleAccount = () => {
    setIsOpenSingle(!isOpenSingle)
    if (isOpenMany) {
      setIsOpenMany(!isOpenMany)
    }
  }

  const handleManyAccounts = () => {
    setIsOpenMany(!isOpenMany)
    if (isOpenSingle) {
      setIsOpenSingle(!isOpenSingle)
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
          title='Gestion de Comptes'
          withLogo
          showButtons
          buttonComponent={buttonComponent}
        />
      </div>
      <div className='page-content'>
        <Popup open={isOpenSingle} onClose={() => setIsOpenSingle(false)} modal>
          {(close) => (
            <div className='popup-modal-container' style={{ alignItems: 'center' }}>
              <button className='close-btn' onClick={close}><img src={cross} alt='Close' /></button>
              <SingleAccountCreationPopupContent/>
            </div>
          )}
        </Popup>
        <Popup open={isOpenMany} onClose={() => setIsOpenMany(false)} modal>
          {(close) => (
            <div className='popup-modal-container' style={{ padding: '50px', gap: '50px', alignItems: 'center' }}>
              <button className='close-btn' onClick={close}><img src={cross} alt='Close' /></button>
              <CsvAccountCreationPopupContent/>
            </div>
          )}
        </Popup>
        <SchoolAccountsTable />
      </div>
    </div>
  )
}
