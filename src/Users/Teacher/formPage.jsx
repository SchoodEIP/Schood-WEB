import React, { useState, useEffect } from 'react'
import Sidebar from '../../Components/Sidebar/sidebar'
import HeaderComp from '../../Components/Header/headerComp'
import '../../css/pages/formPage.scss'
import '../../css/Components/Buttons/questionnaireButtons.css'
import { useParams } from 'react-router-dom'
import PreviousPage from '../../Components/Buttons/previousPage'


const FormPage = () => {
  const [questionInc, setQuestionInc] = useState(0)
  const {id} = useParams();

  return (
    <div className='form-page'>
      <div>
        <HeaderComp />
      </div>
      <div className='different-page-content'>
        <div>
          <Sidebar />
        </div>
        <div className='left-half'>
          <div className='form-container'>
            <p>Here will be a form with id = {id}</p>
            <PreviousPage/>
          </div>
        </div>
      </div>
    </div>
  )
  }

  export default FormPage;
