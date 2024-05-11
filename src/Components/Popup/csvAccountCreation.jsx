import React, { useState } from 'react'
import '../../css/Components/Popup/popup.scss'
import { disconnect } from '../../functions/sharedFunctions'

const CsvAccountCreationPopupContent = () => {
    const role = sessionStorage.getItem('role')
    const [fileName, setFile] = useState()
    const [errMessage, setErrMessage] = useState('')
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
        }).then((response) => {
          if (response.status === 401) {
            disconnect();
          }
          if (response.ok) {
            setErrMessage('Compte(s) créé(s) avec succès')
            window.location.reload()
          } else /* istanbul ignore next */ {
            const data = response.json()

            setErrMessage(data.message)
          }
        })
          .catch((error) => /* istanbul ignore next */ { setErrMessage(error.message) })
    }

    return (
        <>
            <label style={{ alignItems: 'center', gap: '25px' }}>
                <input className='input-csv' placeholder='exemple.csv' onChange={handleFileChange} type='file' accept='.csv' />
                <span className='label-content-warning'>Le fichier attendu est un fichier .csv suivant le format: {role === 'admin' ? 'firstname,lastname,email' : 'firstname,lastname,email,role,class'}</span>
            </label>
            {errMessage ? <span style={{ color: 'red' }}>{errMessage}</span> : ''}
            <button className='popup-btn' onClick={csvAccountCreation}>Créer le(s) Compte(s)</button>
        </>
    )
}

export default CsvAccountCreationPopupContent