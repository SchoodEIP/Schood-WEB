import {React, useState} from 'react'
import HeaderComp from '../../Components/Header/HeaderComp'
import Sidebar from '../../Components/Sidebar/Sidebar'
import AdmAccountsTable from '../../Components/Accounts/Adm/AdmAccountsTable.js'
import AdmAccountCreation from '../../Components/Accounts/Adm/AdmAccountCreation.js'
import '../../css/pages/accountsPage.scss'
import Popup from '../../Components/Popup/Popup';


export default function AdmAccountsPage () {

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
        <HeaderComp />
      </div>
      <div className='page-content'>
        <div>
          <Sidebar />
        </div>
        <div className="table-div">
          <AdmAccountsTable />
        </div>
        <div className="account-div">
          <AdmAccountCreation
            isOpenSingle={isOpenSingle}
            isOpenMany={isOpenMany}
            toggleSingleAccount={toggleSingleAccount}
            toggleManyAccounts={toggleManyAccounts}
          />
        </div>
      </div>
      {
        isOpenSingle && <Popup
          toggle={toggleSingleAccount}
          title={"Création d'un compte Administrateur Scolaire"}
          errMessage={"errMessage"}
          accountCreation={singleAccountCreation}
          btn_text={"Créer un nouveau compte"}
          content={
            <div>
              <form className="pop-form">
                <input className="pop-input" placeholder="Prénom" onChange={handleFirstNameChange}></input>
                <input className="pop-input" placeholder="Nom"on onChange={handleNameChange}></input>
                <input className="pop-input" placeholder="Email" onChange={handleEmailChange}></input>
              </form>
            </div>
          }
        />
      }
      {
        isOpenMany && <Popup
          toggle={toggleManyAccounts}
          title={"Création d'une liste de comptes Administrateur Scolaire"}
          errMessage={"errMessage"}
          accountCreation={csvAccountCreation}
          btn_text={"Créer de nouveaux comptes"}
          handleClose={toggleManyAccounts}
          content={
            <div>
              <form className="pop-form">
                <input className="pop-input-file" placeholder="exemple.csv" onChange={handleFileChange} type="file" accept='.csv'></input>
              </form>
              <div className="pop-info">
                <p>Le fichier attendu est un fichier .csv suivant le format:</p>
                <p >firstName,lastName,email</p>
              </div>
            </div>
          }
        />
      }
    </div>
  )
}
