import React, { useState, useEffect } from 'react'
import { disconnect } from '../../functions/disconnect'
import { toast } from 'react-toastify'

const HelpNumberAndCategoryEditPopupContent = ({ type, onClose }) => {
  const [formData, setFormData] = useState({ name: '', telephone: '' })
  const [numbers, setNumbers] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchCategories = async () => {
      const categoryUrl = process.env.REACT_APP_BACKEND_URL + '/user/helpNumbersCategories'
      const response = await fetch(categoryUrl, {
        method: 'GET',
        headers: {
          'x-auth-token': sessionStorage.getItem('token'),
          'Content-Type': 'application/json'
        }
      })
      if (response.status === 401) {
        disconnect()
      }
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      } else {
        toast.error('Erreur lors de la récupération des catégories.')
      }
    }

    const fetchNumbers = async () => {
      setLoading(true)
      setError('')

      try {
        const response = await fetch(process.env.REACT_APP_BACKEND_URL + '/user/helpNumbers', {
          headers: {
            'x-auth-token': sessionStorage.getItem('token'),
            'Content-Type': 'application/json'
          }
        })

        if (response.status === 401) {
          disconnect()
          throw new Error('Unauthorized access')
        }

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()
        setNumbers(data)
      } catch (error) {
        console.error('Error fetching data:', error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchNumbers()
    fetchCategories()
  }, [type])

  const handleSelectChange = (e) => {
    const selectedId = e.target.value
    const item = numbers.find((item) => item._id === selectedId)
    setSelectedItem(item)
    if (item && type === 'number') {
      setFormData({ name: item.name, telephone: item.telephone || '' })
    } else {
      setFormData({ name: item.name})
    }
  }
  console.log(type)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async () => {
    if (!selectedItem) {
      toast.error('Veuillez sélectionner un élément à modifier.')
      return
    }

    const numberUpdateUrl = `${process.env.REACT_APP_BACKEND_URL}/adm/helpNumber/${selectedItem._id}`
    const categoryUpdateUrl = `${process.env.REACT_APP_BACKEND_URL}/adm/helpNumbersCategory/${selectedItem._id}`
    const url = type === 'number' ? numberUpdateUrl : categoryUpdateUrl

    if (type === 'number') {
delete formData.category    }

    console.log('Données envoyées:', formData)

    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': sessionStorage.getItem('token')
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.log('Erreur renvoyée par le serveur:', errorData)
        throw new Error(`Error ${response.status}: ${errorData.message || 'Unknown error'}`)
      }

      toast.success('Modification réussie !')
      onClose()
    } catch (error) {
      console.error('Erreur lors de la requête:', error)
      toast.error(`Erreur lors de la requête: ${error.message}`)
    }
  }

  return (
    <div className='edit-popup-content'>
      <h2>Modifier {type === 'number' ? 'le numéro d’aide' : 'la catégorie d’aide'}</h2>

      {loading && <p>Chargement des données...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && (
        <form>
          <label>
            Sélectionnez {type === 'number' ? 'le numéro d’aide' : 'la catégorie'} à modifier :
            <select onChange={handleSelectChange} value={selectedItem?._id || ''}>
              <option value=''>-- Sélectionnez --</option>
              {type === 'number' && numbers.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name}
                </option>
              ))}
              {type !== 'number' && categories.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          {selectedItem && (
            <>
              <label className='input-label'>
                <span className='label-content'>Nom <span style={{ color: 'red' }}>*</span></span>
                <input type='text' name='name' placeholder='Nom' value={formData.name} onChange={handleInputChange} />
              </label>
              {type === 'number' && (
                <>
                  <label className='input-label'>
                    <span className='label-content'>Catégorie</span>
                    <select data-testid='category-select' name="helpNumbersCategory" value={formData.helpNumbersCategory} onChange={handleInputChange}>
                      {categories.map((option, index) => (
                        <option key={index} value={option._id}>
                          {option.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className='input-label'>
                    <span className='label-content'>Numéro de Téléphone</span>
                    <input type='text' name='telephone' placeholder='0000000000' value={formData.telephone} onChange={handleInputChange} />
                  </label>
                  <label className='input-label'>
                    <span className='label-content'>Adresse Email</span>
                    <input type='text' name='email' placeholder='prenom.nom.Schood1@schood.fr' value={formData.email}  onChange={handleInputChange} />
                  </label>
                  <label className='input-label'>
                    <span className='label-content'>Description</span>
                    <textarea name='description' placeholder="Une description à propos de l'aide fournie" value={formData.description} onChange={handleInputChange} />
                  </label>
                </>
              )}
              <button type='button' onClick={handleSubmit}>Sauvegarder</button>
            </>
          )}
        </form>
      )}
    </div>
  )
}

export default HelpNumberAndCategoryEditPopupContent
