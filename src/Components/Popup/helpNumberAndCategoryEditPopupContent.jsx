import React, { useState, useEffect } from 'react'
import { disconnect } from '../../functions/disconnect'
import { toast } from 'react-toastify'
import '../../css/pages/homePage.scss'

const HelpNumberAndCategoryEditPopupContent = ({ handleUpdateContent, type, onClose }) => {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', description: '' })
  const [items, setItems] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [categoryList, setCategoryList] = useState([])

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true)
      setError('')

      const categoryUrl = process.env.REACT_APP_BACKEND_URL + '/user/helpNumbersCategories'
      const numberUrl = process.env.REACT_APP_BACKEND_URL + '/user/helpNumbers'
      const url = type === 'number' ? numberUrl : categoryUrl

      try {
        const response = await fetch(url, {
          headers: {
            'x-auth-token': sessionStorage.getItem('token'),
            'Content-Type': 'application/json'
          }
        })

        if (response.status === 401) {
          disconnect()
          toast.error('Unauthorized access')
        }

        if (!response.ok) {
          toast.error(`Error ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()
        setItems(data)
        if (type === 'number') {
          try {
            const response = await fetch(categoryUrl, {
              headers: {
                'x-auth-token': sessionStorage.getItem('token'),
                'Content-Type': 'application/json'
              }
            })

            if (response.status === 401) {
              disconnect()
              toast.error('Unauthorized access')
            }

            if (!response.ok) {
              toast.error(`Error ${response.status}: ${response.statusText}`)
            }

            const data = await response.json()
            setCategoryList(data)
          } catch (error) {
            toast.error('Error fetching data:', error)
          }
        }
      } catch (error) {
        toast.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchItems()
  }, [type])

  const handleDelete = async () => {
    if (!selectedItem) {
      toast.error('Veuillez sélectionner un élément à supprimer.')
      return
    }

    const numberDeleteUrl = `${process.env.REACT_APP_BACKEND_URL}/adm/helpNumber/${selectedItem._id}`
    const categoryDeleteUrl = `${process.env.REACT_APP_BACKEND_URL}/adm/helpNumbersCategory/${selectedItem._id}`
    const url = type === 'number' ? numberDeleteUrl : categoryDeleteUrl

    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'x-auth-token': sessionStorage.getItem('token')
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        toast.error(`Error ${response.status}: ${errorData.message || 'Unknown error'}`)
      }
      toast.success(`${type === 'number' ? 'Numéro' : 'Catégorie'} supprimé avec succès !`)
      onClose()
      handleUpdateContent()
    } catch (error) {
      console.error('Erreur lors de la requête:', error)
      toast.error(`Erreur lors de la suppression: ${error.message}`)
    }
  }

  const handleSelectChange = (e) => {
    const selectedId = e.target.value
    const item = items.find((item) => item._id === selectedId)
    setSelectedItem(item)
    if (item && type === 'number') {
      setFormData({ name: item.name, telephone: item.telephone, email: item.email, description: item.description || '', helpNumbersCategory: item.helpNumbersCategory })
    } else {
      setFormData({ name: item.name })
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

    if (type === 'number') {
      delete formData.category
    }

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
      handleUpdateContent()
    } catch (error) {
      console.error('Erreur lors de la requête:', error)
      toast.error(`Erreur lors de la requête: ${error.message}`)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center', alignSelf: 'center' }}>

      <h3>Modifier {type === 'number' ? 'le numéro d’aide' : 'la catégorie d’aide'}</h3>

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
                <>
                  <label className='input-label'>
                    <span className='label-content'>Catégorie</span>
                    <select data-testid='category-select' name='helpNumbersCategory' value={formData.helpNumbersCategory} onChange={handleInputChange}>
                      {categoryList.map((option, index) => (
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
                    <input type='text' name='email' placeholder='prenom.nom.Schood1@schood.fr' value={formData.email} onChange={handleInputChange} />
                  </label>
                  <label className='input-label'>
                    <span className='label-content'>Description</span>
                    <textarea name='description' placeholder="Une description à propos de l'aide fournie" value={formData.description} onChange={handleInputChange} />
                  </label>
                </>
              )}
              <div style={{ display: 'flex', flexDirection: 'row', paddingTop: '10px' }}>
                <button type='button' onClick={handleSubmit}>Sauvegarder</button>
                <button type='button' onClick={handleDelete} style={{ backgroundColor: 'red', color: 'white', marginLeft: '10px' }}>Supprimer</button>
              </div>
            </>
          )}
        </form>
      )}
    </div>
  )
}

export default HelpNumberAndCategoryEditPopupContent
