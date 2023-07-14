import { React, useState } from 'react';
import '../../../css/Components/Buttons/AccountCreationPopup.css';
import '../../../css/Components/Buttons/AccountSubmitButton.css';
import Popup from '../../Popup/Popup';

export default function AdmAccountCreation () {
  const [isOpenSingle, setIsOpenSingle] = useState(false);
  const [isOpenMany, setIsOpenMany] = useState(false);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [classe, setClasse] = useState('');
  const [fileName, setFile] = useState();
  const [errMessage, setErrMessage] = useState('');
  const singleCreationUrl = process.env.REACT_APP_BACKEND_URL + '/adm/register';
  const csvCreationUrl = process.env.REACT_APP_BACKEND_URL + '/adm/csvRegisterUser';

  const toggleSingleAccount = () => {
    setIsOpenSingle(!isOpenSingle);
    setFirstName('');
    setName('');
    setEmail('');
    setRole('');
    setClasse('');
    setErrMessage('');
    if (isOpenMany) {
      setIsOpenMany(!isOpenMany);
    }
  }

  const toggleManyAccounts = () => {
    setIsOpenMany(!isOpenMany);
    setErrMessage('');
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

  const handleRoleChange = (event) => {
    setRole(event.target.value)
  }

  const handleClasseChange = (event) => {
    setClasse(event.target.value)
  }


  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  }

  const singleAccountCreation = async (event) => {
      event.preventDefault()

      try {
        const response = await fetch(singleCreationUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': sessionStorage.getItem('token')
          },
          body: JSON.stringify({
            'firstname': firstName,
            'lastname': name,
            'email': email,
            'role': role,
            'classe': classe
          })
        })

        const data = await response.json()
        setErrMessage(data.message);
      } catch (e) {
        console.log(e.message);
      }
  }

  const csvAccountCreation = async (event) => {
    event.preventDefault()
    const formData = new FormData();

    formData.append('csv', fileName);

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
      setErrMessage(data.message);
    } catch (e) {
      console.log(e);
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
          content={
            <div className="pop-content">
              <div className="pop-header">
                <button className="btn-close" onClick={toggleSingleAccount}>x</button>
                <h2>Création d'un compte Etudiant/Professeur</h2>
              </div>
              <div className='pop-body'>
                <form className="pop-form">
                  <input className="pop-input" name="firstName" placeholder="Prénom" onChange={handleFirstNameChange}></input>
                  <input className="pop-input" name="lastName" placeholder="Nom" onChange={handleNameChange}></input>
                  <input className="pop-input" name="email" placeholder="Email" onChange={handleEmailChange}></input>
                  <input className="pop-input" name="role" placeholder="Rôle" onChange={handleRoleChange}></input>
                  <input className="pop-input" name="classe" placeholder="Classe" onChange={handleClasseChange}></input>
                </form>
                <p>{errMessage}</p>
                  <button className="account-submit-btn" type="submit" onClick={singleAccountCreation}>Créer un nouveau compte</button>
              </div>
            </div>
          }
        />
      }
      {
        isOpenMany && <Popup
          content={
            <div className="pop-content">
              <div className="pop-header">
                <button className="btn-close" onClick={toggleManyAccounts}>x</button>
                <h2>Création d'une liste de comptes Etudiant/Professeur</h2>
              </div>
              <div className='pop-body'>
                <form className="pop-form">
                  <input className="pop-input-file" placeholder="exemple.csv" onChange={handleFileChange} type="file" accept='.csv'></input>
                </form>
                <div className="pop-info">
                  <p>Le fichier attendu est un fichier .csv suivant le format:</p>
                  <p>firstName,lastName,email,role,classe</p>
                </div>
                <p>{errMessage}</p>
                <button className="account-submit-btn" type="submit" onClick={csvAccountCreation}>Créer de nouveaux comptes</button>
              </div>
            </div>
          }
        />
      }
    </div>
  )
}
