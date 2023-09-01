import React from 'react';
import Sidebar from '../../Components/Sidebar/sidebar'
import HeaderComp from '../../Components/Header/headerComp'
import '../../css/pages/formPage.scss'

const FormListPage = () => {

    function createNewForm() {
        window.location.href = '/questionnaire';
    }

  return (
    <div className='form-page'>
      <div>
        <HeaderComp />
      </div>
      <div className='different-page-content' >
        <div>
          <Sidebar />
        </div>
        <div className='left-half'>
            <div className='form-container'>
                <div className='form-header'>
                    <h1 className='form-header-title'>Vos Questionnaires</h1>
                </div>
                <div className='form-content-container'>
                    <div>
                      <button className="button-css" onClick={createNewForm}>Créer un Nouveau Questionnaire<h1>+</h1></button>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default FormListPage;