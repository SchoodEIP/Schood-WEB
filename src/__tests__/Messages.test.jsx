import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Messages from './Messages'; // Importez votre composant Messages ici

// Exemple de test pour la partie "Une partie avec 'mes messages' qui contient la liste des conversations passées"
test('Affiche la liste des conversations passées', () => {
  const conversations = [
    { _id: 1, firstname: 'Adrien', lastname: 'Busnel' },
    { _id: 2, firstname: 'Nathan', lastname: 'Duschene' }
  ];
  render(<Messages />);
  
  conversations.forEach((conversation) => {
    const conversationName = `${conversation.firstname} ${conversation.lastname}`;
    expect(screen.getByText(conversationName)).toBeInTheDocument();
  });
});

// Exemple de test pour la partie "Un input dans lequel l’utilisateur écrit son message"
test('Saisie de texte dans l\'input du message', () => {
  render(<Messages />);
  const input = screen.getByPlaceholderText('Composez votre message');
  
  fireEvent.change(input, { target: { value: 'Nouveau message' } });
  
  expect(input.value).toBe('Nouveau message');
});

// Ajoutez d'autres tests similaires pour les autres fonctionnalités que vous souhaitez tester.
