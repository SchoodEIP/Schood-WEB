import { React } from 'react';
import '../../css/Components/Buttons/accountCreationPopup.css';
import '../../css/Components/Buttons/accountSubmitButton.css';

export default function ButtonsAccountCreation (props) {
  return (
    <div>
      <div>
        <button
          className="account-pop-up-btn"
          data-testid="single-account-btn"
          onClick={props.toggleSingleAccount}
          style={{ backgroundColor: props.isOpenSingle ? "#8c52ff" : "#4f23e2" }}
          >
            Ajouter un compte
        </button>
      </div>
      <div>
        <button
          className="account-pop-up-btn"
          data-testid="many-account-btn"
          onClick={props.toggleManyAccounts}
          style={{ backgroundColor: props.isOpenMany ? "#8c52ff" : "#4f23e2" }}
          >
            Ajouter une liste de comptes
        </button>
      </div>
    </div>
  )
}
