import {React, useState, useEffect} from 'react'
import HeaderComp from '../../Components/Header/HeaderComp'
import Sidebar from '../../Components/Sidebar/Sidebar'
import AdmAccountsTable from '../../Components/Accounts/Adm/AdmAccountsTable.js'
import ButtonsAccountCreation from '../../Components/Buttons/ButtonsAccountCreation.js'
import '../../css/pages/accountsPage.scss'
import Popup from '../../Components/Popup/Popup';


export default function AdmAccountsPage () {

  const [isOpenSingle, setIsOpenSingle] = useState(false);
  const [isOpenMany, setIsOpenMany] = useState(false);
  const [isOpenFacility, setIsOpenFacility] = useState(false);
  const [email, setEmail] = useState('');
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [fileName, setFile] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [telephone, setTelephone] = useState('');
  const [level, setLevel] = useState(0);
  const [rolesList, setRolesList] = useState([]);
  const [errMessage, setErrMessage] = useState('');
  const singleCreationUrl = process.env.REACT_APP_BACKEND_URL + '/adm/register';
  const csvCreationUrl = process.env.REACT_APP_BACKEND_URL + '/adm/csvRegisterUser';
  const facilityUrl = process.env.REACT_APP_BACKEND_URL + '/admin/facility/register';

  useEffect(() => {
    const rolesUrl = process.env.REACT_APP_BACKEND_URL + '/adm/rolesList';

    try {
      fetch(rolesUrl, {
        method: 'GET',
        headers: {
          'x-auth-token': sessionStorage.getItem('token'),
          'Content-Type': 'application/json'
        },
      }).then(response => response.json())
      .then(data => setRolesList(data.roles))
      .catch(error => setErrMessage(error.message));

    } catch (e) {
      setErrMessage(e.message);
    }
  }, []);

  const toggleFacility = () => {
    setIsOpenFacility(!isOpenFacility);
    setName('');
    setAddress('');
    setTelephone('');
    setLevel(0);
    if (isOpenMany) {
      setIsOpenMany(false);
    }
    if (isOpenSingle) {
      setIsOpenSingle(false);
    }
  }

  const toggleSingleAccount = () => {
    setIsOpenSingle(!isOpenSingle);
    setFirstName('');
    setLastName('');
    setEmail('');
    setErrMessage('');
    if (isOpenMany) {
      setIsOpenMany(false);
    }
    if (isOpenFacility) {
      setIsOpenFacility(false);
    }
  }

  const toggleManyAccounts = () => {
    setIsOpenMany(!isOpenMany);
    setFile();
    setErrMessage('');
    if (isOpenSingle) {
      setIsOpenSingle(false);
    }
    if (isOpenFacility) {
      setIsOpenFacility(false);
    }
  }

  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value)
  }

  const handleLastNameChange = (event) => {
    setLastName(event.target.value)
  }

  const handleEmailChange = (event) => {
    setEmail(event.target.value)
  }

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  }

  const handleNameChange = (event) => {
    setName(event.target.value)
  }

  const handleAddressChange = (event) => {
    setAddress(event.target.value)
  }

  const handleTelephoneChange = (event) => {
    setTelephone((event.target.value))
  }

  const handleLevelChange = (event) => {
    setLevel(parseInt(event.target.value))
  }

  const singleAccountCreation = async (event) => {
    event.preventDefault()

    const filteredArray = rolesList.filter(item => item.levelOfAccess === 2);
    const roleId = filteredArray.map(item => item._id);

    const payload = {
      firstname,
      lastname,
      email,
      role: roleId[0],
      classes: []
    }

    try {
      await fetch(singleCreationUrl, {
        method: 'POST',
        headers: {
          'x-auth-token': sessionStorage.getItem('token'),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      }).then(response => {
        if (response.ok) {
          window.location.reload()
        } else {
          const data = response.json();

          setErrMessage(data.message);
        }
      })
    } catch (e) {
      setErrMessage(e.message);
    }
}

const csvAccountCreation = async (event) => {
  event.preventDefault()
  const formData = new FormData();

  formData.append('file', fileName);

  try {
    await fetch(csvCreationUrl, {
      method: 'POST',
      headers: {
        'x-auth-token': sessionStorage.getItem('token')
      },
      body: formData
    }).then(response => {
      if (response.ok) {
        window.location.reload()
      } else {
        const data = response.json();

        setErrMessage(data.message);
      }
    })
  } catch (e) {
    setErrMessage(e.message);
  }
}


const facilityRegister = async (event) => {
  event.preventDefault()

  const payload = {
    name,
    address,
    telephone,
    level,
  }
  console.log(payload);
  try {
    await fetch(facilityUrl, {
      method: 'POST',
      headers: {
        'x-auth-token': sessionStorage.getItem('token'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }).then(response => {
      if (response.ok) {
        window.location.reload()
      } else {
        const data = response.json();

        setErrMessage(data.message);
      }
    })
  } catch (e) {
    setErrMessage(e.message);
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
          <div className='establishment-banner'>
            <span className="banner-text">Établissement : SchoodTmp</span>
            <div className='banner-btn'>
              <button
                className="account-pop-up-btn"
                data-testid="facility-account-btn"
                onClick={toggleFacility}
                style={{ backgroundColor: isOpenFacility ? "#8c52ff" : "#4f23e2" }}
                >
                  Modifier les informations
              </button>
            </div>
          </div>
          <AdmAccountsTable />
        </div>
        <div className="account-div">
          <ButtonsAccountCreation
            isOpenSingle={isOpenSingle}
            isOpenMany={isOpenMany}
            toggleSingleAccount={toggleSingleAccount}
            toggleManyAccounts={toggleManyAccounts}
          />
        </div>
      </div>
      {
        isOpenFacility && <Popup
          toggle={toggleFacility}
          title={"Informations de l'établissement"}
          errMessage={errMessage}
          accountCreation={facilityRegister}
          btn_text={"Modifier"}
          content={
            <div>
              <form className="pop-form">
                <input className="pop-input" placeholder="Nom" onChange={handleNameChange}></input>
                <input className="pop-input" placeholder="Addresse" onChange={handleAddressChange}></input>
                <input className="pop-input" placeholder="Telephone" onChange={handleTelephoneChange}></input>
                <select className="pop-input" placeholder="Level" onChange={handleLevelChange}>
                  <option value="0">Primaire</option>
                  <option value="1">Collège</option>
                  <option value="2">Lycée</option>
                  <option value="3">Supérieur</option>
                  <option value="4">Autre</option>
                </select>
              </form>
            </div>
          }
        />
      }
      {
        isOpenSingle && <Popup
          toggle={toggleSingleAccount}
          title={"Création d'un compte Administrateur Scolaire"}
          errMessage={errMessage}
          accountCreation={singleAccountCreation}
          btn_text={"Créer un nouveau compte"}
          content={
            <div>
              <form className="pop-form">
                <input className="pop-input" placeholder="Prénom" onChange={handleFirstNameChange}></input>
                <input className="pop-input" placeholder="Nom" onChange={handleLastNameChange}></input>
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
          errMessage={errMessage}
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
