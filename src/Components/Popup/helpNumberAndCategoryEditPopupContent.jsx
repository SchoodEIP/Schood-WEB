import React, { useState, useEffect } from 'react'
import { disconnect } from '../../functions/disconnect'
import { toast } from 'react-toastify'

const HelpNumberAndCategoryEditPopupContent = ({ type, onClose }) => {
  const [formData, setFormData] = useState({ name: '', phone: '' })
  const [items, setItems] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true)
      setError('')

      const categoryUrl = process.env.REACT_APP_BACKEND_URL + '/user/helpNumbersCategories'
      const numberUrl = process.env.REACT_APP_BACKEND_URL + '/user/helpNumbers'
      const url = type === 'number' ? numberUrl : categoryUrl

      console.log('Fetching data from:', url)

      try {
        const response = await fetch(url, {
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
        setItems(data)
      } catch (error) {
        console.error('Error fetching data:', error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchItems()
  }, [type])

  const handleSelectChange = (e) => {
    const selectedId = e.target.value
    const item = items.find((item) => item._id === selectedId)
    setSelectedItem(item)
    if (item) {
      setFormData({ name: item.name, phone: item.phone || '' })
    }
  }

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

    console.log('URL de requête:', url)
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

      toast.error('Modification réussie !')
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
              {items.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          {selectedItem && (
            <>
              <label>
                Nom:
                <input
                  type='text'
                  name='name'
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </label>
              {type === 'number' && (
                <label>
                  Numéro:
                  <input
                    type='text'
                    name='phone'
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </label>
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
