import React, { useState } from 'react'
import '../../css/Components/Popup/popup.scss'
import { disconnect } from '../../functions/disconnect'

const CsvAccountCreationPopupContent = () => {
  const role = sessionStorage.getItem('role')
  const [fileName, setFile] = useState()
  const [errMessage, setErrMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [popupVisible, setPopupVisible] = useState(false)
  const [popupContent, setPopupContent] = useState('')

  const csvCreationUrl = process.env.REACT_APP_BACKEND_URL + '/adm/csvRegisterUser'

  const handleFileChange = (event) => {
    setFile(event.target.files[0])
  }

  const openPopup = (message) => {
    setPopupContent(message)
    setPopupVisible(true)
  }

  const closePopup = () => {
    setPopupVisible(false)
    setPopupContent('')
  }

  const csvAccountCreation = async (event) => {
    event.preventDefault()
    const formData = new FormData()

    formData.append('csv', fileName)

    await fetch(csvCreationUrl, {
      method: 'POST',
      headers: {
        'x-auth-token': sessionStorage.getItem('token')
      },
      body: formData
    }).then(async (response) => {
      if (response.status === 401) {
        disconnect()
      }
      const data = await response.json()
      if (response.ok) {
        setSuccessMessage('Compte(s) créé(s) avec succès')
        openPopup('Compte(s) créé(s) avec succès')
        window.location.reload()
      } else {
        openPopup(`À la ligne ${data[0].rowCSV} du fichier CSV, ${data[0].errors[0]}`)
      }
    })
      .catch((error) => {
        setErrMessage(error.message)
        openPopup(error.message)
      })
  }

  return (
    <>
      <label style={{ alignItems: 'center', gap: '25px' }}>
        <input className='input-csv' placeholder='exemple.csv' onChange={handleFileChange} type='file' accept='.csv' />
        <span className='label-content-warning'>Le fichier attendu est un fichier .csv suivant le format: {role === 'admin' ? 'firstname,lastname,email' : 'firstname,lastname,email,role,class'}</span>
      </label>
      {errMessage ? <span data-testid='err-message' style={{ color: 'red' }}>{errMessage}</span> : ''}
      {successMessage ? <span style={{ color: 'green' }}>{successMessage}</span> : ''}
      {popupVisible &&
        <div className='popup'>
          <div className='popup-content'>
            <span className='close' onClick={closePopup}>&times;</span>
            <p>{popupContent}</p>
          </div>
        </div>}
      <button className='popup-btn' onClick={csvAccountCreation}>Créer le(s) Compte(s)</button>
    </>
  )
}

export default CsvAccountCreationPopupContent
