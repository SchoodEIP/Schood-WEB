import React, { useState, useEffect } from 'react';
import '../../css/Components/Aides/aides.scss'

export default function AidePage() {
  const [categories, setCategories] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(''); // Catégorie sélectionnée pour le filtrage
  const [filteredContacts, setFilteredContacts] = useState([]); // Numéros de contact filtrés

  useEffect(() => {
    // Catégories en dur
    const categoriesData = [
      { id: 1, name: 'Harcèlement' },
      { id: 2, name: 'Problème à la maison' },
    ];

    // Numéros de contact en dur
    const contactsData = [
      { id: 1, name: 'Aide contre le harcèlement', phoneNumber: '123-456-7890', category: 'Harcèlement' },
      { id: 2, name: 'Ligne d\'urgence pour les victimes de violence familiale', phoneNumber: '987-654-3210', category: 'Problème à la maison' },
      // Ajoutez d'autres numéros de contact ici
    ];

    setCategories(categoriesData);
    setContacts(contactsData);
    setFilteredContacts(contactsData); // Afficher tous les numéros par défaut
  }, []);

  // Fonction pour filtrer les numéros de contact par catégorie
  const filterContactsByCategory = (category) => {
    setSelectedCategory(category);

    // Filtrer les numéros de contact en fonction de la catégorie sélectionnée
    if (category) {
      const filtered = contacts.filter((contact) => contact.category === category);
      setFilteredContacts(filtered);
    } else {
      // Si aucune catégorie n'est sélectionnée, afficher tous les numéros
      setFilteredContacts(contacts);
    }
  };

  return (
    <div className='aide-page'>
      <header>Numéros de Contact</header>

      {/* Afficher la liste des catégories */}
      <div className='categories-section'>
        <h2>Catégories</h2>
        <ul>
          {categories.map((category) => (
            <li key={category.id}>
              <button onClick={() => filterContactsByCategory(category.name)}>
                {category.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Afficher les numéros de contact en fonction de la catégorie sélectionnée */}
      <div className='contacts-section'>
        <h2>Numéros de Contact</h2>
        <ul>
          {filteredContacts.map((contact) => (
            <li key={contact.id}>
              <strong>Nom: </strong>{contact.name}<br />
              <strong>Numéro: </strong>{contact.phoneNumber}<br />
              <strong>Catégorie: </strong>{contact.category}
            </li>
          ))}
        </ul>
      </div>
      <div className='clearfix'></div>
    </div>
  );
}
