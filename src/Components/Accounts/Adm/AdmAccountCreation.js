import { React, useState } from 'react';
import '../../../css/Components/Accounts/Adm/AdmAccountCreation.css';
import '../../../css/Components/Buttons/AccountCreationPopup.css';
import '../../../css/Components/Buttons/AccountSubmitButton.css';
import Popup from '../../Popup/Popup';

export default function AdmAccountCreation () {
  const [isOpenSingle, setIsOpenSingle] = useState(false);
  const [isOpenMany, setIsOpenMany] = useState(false);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [name, setName] = useState('');
  const [fileName, setFile] = useState();
  const singleCreationUrl = process.env.REACT_APP_BACKEND_URL + '/adm/register';
  const csvCreationUrl = process.env.REACT_APP_BACKEND_URL + '/adm/csvRegisterUser';

  const toggleSingleAccount = () => {
    setIsOpenSingle(!isOpenSingle);
    setFirstName('');
    setName('');
    setEmail('');
    if (isOpenMany) {
      setIsOpenMany(!isOpenMany);
    }
  }

  const toggleManyAccounts = () => {
    setIsOpenMany(!isOpenMany);
    setFile();
    if (isOpenSingle) {
      setIsOpenSingle(!isOpenSingle);
    }
  }

  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value)
  }

  const handleNameChange = (event) => {
    setName(event.target.value)
  }

  const handleEmailChange = (event) => {
    setEmail(event.target.value)
  }

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  }

  const singleAccountCreation = async (event) => {
      event.preventDefault()

      const payload = {
        firstName,
        name,
        email
      }

      try {
        const response = await fetch(singleCreationUrl, {
          method: 'POST',
          headers: {
            'x-auth-token': sessionStorage.getItem('token')
          },
          body: JSON.stringify(payload)
        })

        const data = await response.json()
        console.log(data.message);
      } catch (e) {
        console.log(e.message);
      }
  }

  const csvAccountCreation = async (event) => {
    event.preventDefault()
    const formData = new FormData();

    formData.append('file', fileName);

    try {
      const response = await fetch(csvCreationUrl, {
        method: 'POST',
        headers: {
          'x-auth-token': sessionStorage.getItem('token')
        },
        body: formData
      })

      const data = await response.json()
      console.log(data.message);
    } catch (e) {
      console.log(e.message);
    }
}

  return (
    <div>
      <div>
        <button
          className="account-pop-up-btn"
          id="single-account-btn"
          onClick={toggleSingleAccount}
          style={{ backgroundColor: isOpenSingle ? "#8c52ff" : "#4f23e2" }}
          >
            Ajouter un compte
        </button>
      </div>
      <div>
        <button
          className="account-pop-up-btn"
          id="many-account-btn"
          onClick={toggleManyAccounts}
          style={{ backgroundColor: isOpenMany ? "#8c52ff" : "#4f23e2" }}
          >
            Ajouter une liste de comptes
        </button>
      </div>
      {
        isOpenSingle && <Popup
          handleClose={toggleSingleAccount}
          content={
            <div className="pop-content">
              <div className="pop-header">
                <h2>Création d'un compte Administrateur Scolaire</h2>
              </div>
              <div className='pop-body'>
                <form className="pop-form">
                  <input className="pop-input" placeholder="Prénom" onChange={handleFirstNameChange}></input>
                  <input className="pop-input" placeholder="Nom"on onChange={handleNameChange}></input>
                  <input className="pop-input" placeholder="Email" onChange={handleEmailChange}></input>
                </form>
                  <button className="account-submit-btn" type="submit" onClick={singleAccountCreation}>Créer un nouveau compte</button>
              </div>
            </div>
          }
        />
      }
      {
        isOpenMany && <Popup
          handleClose={toggleManyAccounts}
          content={
            <div className="pop-content">
              <div className="pop-header">
                <h2>Création d'une liste de comptes Administrateur Scolaire</h2>
              </div>
              <div className='pop-body'>
                <form className="pop-form">
                  <input className="pop-input-file" placeholder="exemple.csv" onChange={handleFileChange} type="file" accept='.csv'></input>
                </form>
                <div className="pop-info">
                  <p>Le fichier attendu est un fichier .csv suivant le format:</p>
                  <p >firstName,lastName,email</p>
                </div>
                <button className="account-submit-btn" type="submit" onClick={csvAccountCreation}>Créer de nouveaux comptes</button>
              </div>
            </div>
          }
        />
      }
    </div>
  )
}
