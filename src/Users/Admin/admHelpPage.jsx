import React, { useState, useEffect } from 'react';
import '../../css/pages/homePage.css';
import HeaderComp from '../../Components/Header/headerComp';
import Sidebar from '../../Components/Sidebar/sidebar';
import AidePage from '../../Components/Aides/aides';
import ButtonsPopupCreation from '../../Components/Buttons/buttonsPopupCreation.js';
import Popup from '../../Components/Popup/popup';

const AdmHelpPage = () => {
  const [isOpenCategory, setIsOpenCategory] = useState(false);
  const [isOpenNumber, setIsOpenNumber] = useState(false);
  const [errMessage, setErrMessage] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [categoryID, setCategoryID] = useState('');
  const [telephone, setTelephone] = useState('');
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesData = await fetchUpdatedCategories();
        setCategories(categoriesData);
        setCategoryID(categoriesData.length > 0 ? categoriesData[0]._id : ''); // Sélectionne la première catégorie s'il y en a
      } catch (error) {
        setErrMessage(error.message);
      }
    };

    fetchData();
  }, [isOpenCategory]);

  const handleCategoryPopup = async () => {
    setIsOpenCategory(!isOpenCategory);
    setErrMessage('');
    setName('');
    if (isOpenNumber) {
      setIsOpenNumber(false);
    }
  };

  const handleNumberPopup = async () => {
    setIsOpenNumber(!isOpenNumber);
    setErrMessage('');
    setName('');
    setCategoryID(categories.length > 0 ? categories[0]._id : ''); // Sélectionne la première catégorie s'il y en a
    setEmail('');
    setTelephone('');
    setDescription('');
    if (isOpenCategory) {
      setIsOpenCategory(false);
    }
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleTelephoneChange = (event) => {
    setTelephone(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setCategoryID(event.target.value);
  };

  const categoryCreation = async () => {
    try {
      const response = await fetchCategoryRegister();
      if (response.ok) {
        setErrMessage('Catégorie créée avec succès');
        handleCategoryPopup()
        fetchUpdatedCategories()
      } else {
        const data = await response.json();
        setErrMessage(data.message);
      }
    } catch (error) {
      setErrMessage(error.message);
    }
  };

  const fetchCategoryRegister = async () => {
    const categoryRegisterUrl = process.env.REACT_APP_BACKEND_URL + '/adm/helpNumbersCategory/register';
    return fetch(categoryRegisterUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': sessionStorage.getItem('token')
      },
      body: JSON.stringify({
        name
      })
    });
  };

  const helpNumberCreation = async () => {
    try {
      if (!/^\d{10}$/.test(telephone)) {
        setErrMessage('Veuillez fournir un numéro de téléphone valide (10 chiffres).');
        return;
      }

      const response = await fetchHelpNumberRegister();
      if (response.ok) {
        setErrMessage("Numéro d'aide créé avec succès");
        handleNumberPopup()
        fetchUpdatedCategories()
        // Ajoutez ici la logique pour récupérer les numéros d'aide mis à jour depuis le serveur
      } else {
        const data = await response.json();
        setErrMessage(data.message);
      }
    } catch (error) {
      setErrMessage(error.message);
    }
  };

  const fetchHelpNumberRegister = async () => {
    const helpNumberRegisterUrl = process.env.REACT_APP_BACKEND_URL + '/adm/helpNumber/register';
    return fetch(helpNumberRegisterUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': sessionStorage.getItem('token')
      },
      body: JSON.stringify({
        email,
        name,
        telephone,
        helpNumbersCategory: categoryID,
        description
      })
    });
  };

  const fetchUpdatedCategories = async () => {
    const categoryUrl = process.env.REACT_APP_BACKEND_URL + '/user/helpNumbersCategories';
    const response = await fetch(categoryUrl, {
      method: 'GET',
      headers: {
        'x-auth-token': sessionStorage.getItem('token'),
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error('Erreur lors de la récupération des catégories.');
    }
  };

  return (
    <div className='dashboard'>
      <HeaderComp />
      <div className='page-content'>
        <Sidebar />
        <div className='left-half'>
          <AidePage />
        </div>
        <div className='right-half'>
          <ButtonsPopupCreation
            isOpenSingle={isOpenCategory}
            isOpenMany={isOpenNumber}
            handleSingleAccount={handleCategoryPopup}
            handleManyAccounts={handleNumberPopup}
            singleContent='Ajouter une Catégorie'
            manyContent='Ajouter un Contact'
            isManyDisabled={categories.length === 0}
          />
        </div>
      </div>
      {isOpenCategory && (
        <Popup
          handleClose={handleCategoryPopup}
          title='Ajouter une nouvelle Catégorie'
          errMessage={errMessage}
          handleCreation={categoryCreation}
          btn_text='Créer la catégorie'
          content={
            <div>
              <input className='pop-input' name='name' placeholder='Nom' onChange={handleNameChange} />
            </div>
          }
        />
      )}
      {isOpenNumber && categories.length > 0 && (
        <Popup
          handleClose={handleNumberPopup}
          title='Ajouter un nouveau Contact'
          errMessage={errMessage}
          handleCreation={helpNumberCreation}
          btn_text='Créer le contact'
          content={
            <form className='pop-form'>
              <select className='pop-input' data-testid='category-select' value={categoryID} onChange={handleCategoryChange}>
                {categories.map((option, index) => (
                  <option key={index} value={option._id}>
                    {option.name}
                  </option>
                ))}
              </select>
              <input className='pop-input' name='name' placeholder='Nom' onChange={handleNameChange} />
              <input className='pop-input' name='telephone' placeholder='0000000000' onChange={handleTelephoneChange} />
              <input className='pop-input' name='email' placeholder='example@schood.fr' onChange={handleEmailChange} />
              <textarea className='pop-input' name='description' placeholder="Une description à propos de l'aide fournie" onChange={handleDescriptionChange} />
            </form>
          }
        />
      )}
    </div>
  );
};

export default AdmHelpPage;
