import { React } from 'react';
import '../../../css/Components/Buttons/AccountCreationPopup.css';
import '../../../css/Components/Buttons/AccountSubmitButton.css';

export default function AdmAccountCreation (props) {
  return (
    <div>
      <div>
        <button
          className="account-pop-up-btn"
          id="single-account-btn"
          onClick={props.toggleSingleAccount}
          style={{ backgroundColor: props.isOpenSingle ? "#8c52ff" : "#4f23e2" }}
          >
            Ajouter un compte
        </button>
      </div>
      <div>
        <button
          className="account-pop-up-btn"
          id="many-account-btn"
          onClick={props.toggleManyAccounts}
          style={{ backgroundColor: props.isOpenMany ? "#8c52ff" : "#4f23e2" }}
          >
            Ajouter une liste de comptes
        </button>
      </div>
    </div>
  )
}
