import { React } from 'react'
import '../../css/Components/Buttons/accountCreationPopup.css'
import '../../css/Components/Buttons/accountSubmitButton.css'

export default function ButtonsPopupCreation (props) {
  return (
    <div>
      <div>
        <button
          className='account-pop-up-btn'
          data-testid='single-account-btn'
          id='single-account-btn'
          onClick={props.handleSingleAccount}
          style={{ backgroundColor: props.isOpenSingle ? '#8c52ff' : '#4f23e2' }}
        >
          {props.singleContent}
        </button>
      </div>
      <div>
        <button
          className='account-pop-up-btn'
          data-testid='many-account-btn'
          id='many-account-btn'
          onClick={props.handleManyAccounts}
          style={{ backgroundColor: props.isOpenMany ? '#8c52ff' : '#4f23e2' }}
        >
          {props.manyContent}
        </button>
      </div>
    </div>
  )
}
