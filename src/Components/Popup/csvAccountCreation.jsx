import React, { useState } from 'react'
import '../../css/Components/Popup/popup.scss'
import { disconnect } from '../../functions/disconnect'
import { toast } from 'react-toastify'

const CsvAccountCreationPopupContent = () => {
  const role = sessionStorage.getItem('role')
  const [fileName, setFile] = useState()

  const csvCreationUrl = process.env.REACT_APP_BACKEND_URL + '/adm/csvRegisterUser'

  const handleFileChange = (event) => {
    setFile(event.target.files[0])
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
        toast.success('Compte(s) créé(s) avec succès')
        window.location.reload()
      } else {
        toast.error(`À la ligne ${data[0].rowCSV} du fichier CSV, ${data[0].errors[0]}`)
      }
    })
      .catch((error) => {
        toast.error(error.message)
      })
  }

  return (
    <>
      <label style={{ alignItems: 'center', gap: '25px' }}>
        <input className='input-csv' placeholder='exemple.csv' onChange={handleFileChange} type='file' accept='.csv' />
        <span className='label-content-warning'>Le fichier attendu est un fichier .csv suivant le format: {role === 'admin'
          ? (
            <>
              <p>firstname,lastname,email,role</p>
              <p>exemple,exemple,exemple@exemple,administration</p>
              <p>exemple,exemple,exemple@exemple,administration</p>
            </>
            )
          : (
            <>
              <p>firstname,lastname,email,role,class</p>
              <p>exemple,exemple,exemple@exemple,teacher,0:1:2</p>
              <p>exemple,exemple,exemple@exemple,student,0</p>
              <p>exemple,exemple,exemple@exemple,student,1</p>
            </>
            )}
        </span>
      </label>
      <button className='popup-btn' onClick={csvAccountCreation}>Créer le(s) Compte(s)</button>
    </>
  )
}

export default CsvAccountCreationPopupContent
