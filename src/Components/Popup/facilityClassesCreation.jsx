import React, { useState, useEffect } from 'react'
import '../../css/Components/Popup/popup.scss'
import { disconnect } from '../../functions/disconnect'
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faTrashCan, faSquarePlus } from '@fortawesome/free-regular-svg-icons'

const FacilityClassesCreationPopupContent = () => {
  const [name, setName] = useState('')
  const [newClass, setNewClass] = useState('')
  const [classList, setClassList] = useState([])
  const [isRename, setIsRename] = useState(null)

  function getClasses () {
    fetch(process.env.REACT_APP_BACKEND_URL + '/shared/classes', {
      method: 'GET',
      headers: {
        'x-auth-token': sessionStorage.getItem('token'),
        'Content-Type': 'application/json'
      }
    })
      .then((response) => {
        if (response.status === 401) {
          disconnect()
        }
        return response.json()
      })
      .then((data) => setClassList(data))
      .catch((error) => {
        toast.error(error.message)
      })
  }

  useEffect(() => {
    getClasses()
  }, [])

  const handleCreateClass = () => {
    if (newClass === '') { return }
    fetch(process.env.REACT_APP_BACKEND_URL + '/adm/classes/register', {
      method: 'POST',
      headers: {
        'x-auth-token': sessionStorage.getItem('token'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: newClass
      })
    })
      .then((response) => {
        if (response.status === 401) {
          disconnect()
        }
        if (response.status === 200) {
          getClasses()
          setNewClass('')
          toast.success('La classe a été créée avec succès.')
        }
      })
      .catch((error) => {
        toast.error(error.message)
      })
  }

  const handleDeleteClass = (classId) => {
    fetch(process.env.REACT_APP_BACKEND_URL + '/adm/classes/' + classId, {
      method: 'DELETE',
      headers: {
        'x-auth-token': sessionStorage.getItem('token'),
        'Content-Type': 'application/json'
      }
    })
      .then((response) => {
        if (response.status === 401) {
          disconnect()
        }
        if (response.status === 200) {
          getClasses()
          toast.success('La classe a été supprimée avec succès.')
        }
      })
      .catch((error) => {
        toast.error(error.message)
      })
  }

  const handleRenameClass = (classId, className) => {
    if (isRename && classId === isRename) {
      fetch(process.env.REACT_APP_BACKEND_URL + '/adm/classes/' + classId, {
        method: 'PATCH',
        headers: {
          'x-auth-token': sessionStorage.getItem('token'),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name
        })
      })
        .then((response) => {
          if (response.status === 401) {
            disconnect()
          }
          if (response.status === 422) {
            toast.warn('Une classe possède déjà ce nom.')
          }
          if (response.status === 200) {
            getClasses()
            setIsRename(null)
            setName('')
            toast.success('La classe a été renommée avec succès.')
          }
        })
        .catch((error) => {
          toast.error(error.message)
        })
    } else {
      setName(className)
      setIsRename(classId)
    }
  }

  const handleChangeClassName = (e) => {
    setName(e.target.value)
  }

  const handleChangeNewClassName = (e) => {
    setNewClass(e.target.value)
  }

  const handleKeyPress = (e, classId, className, isNewName) => {
    if (e.key === 'Enter') {
      if (isNewName) {
        handleCreateClass()
      } else {
        handleRenameClass(classId, className)
      }
    }
  }

  return (
    <div className='classes-gestion-container'>
      <h3>Gérer les classes de l'Établissement</h3>
      <div className='class-input-container' style={{ justifyContent: 'center' }}>
        <label>
          <input value={newClass} onKeyPress={(e) => handleKeyPress(e, null, null, true)} onChange={handleChangeNewClassName} placeholder='Ajouter une classe ...' />
        </label>
        <FontAwesomeIcon className='icon-popup' icon={faSquarePlus} title='Ajouter la classe' onClick={handleCreateClass} />
      </div>
      <div className='class-list-container'>
        {
          classList.length > 0 && classList.map((classe, index) => (
            <div className='class-container' key={index}>
              {isRename === classe._id
                ? (
                  <label>
                    <input value={name} onKeyPress={(e) => handleKeyPress(e, classe._id, classe.name, false)} onChange={handleChangeClassName} />
                  </label>
                  )
                : <span>{classe.name}</span>}
              <div style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
                <FontAwesomeIcon className='icon-popup' icon={faPenToSquare} title='Renommer la classe' onClick={() => handleRenameClass(classe._id, classe.name)} />
                <FontAwesomeIcon className='icon-popup' icon={faTrashCan} title='Supprimer la classe' onClick={() => handleDeleteClass(classe._id)} />
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default FacilityClassesCreationPopupContent
