import React from 'react';
import { QuestSpace } from '../../../Components/Questionnaire/questSpace.jsx';
import '@testing-library/jest-dom'; // Au lieu de '@testing-library/jest-dom/';
import { render, screen } from '@testing-library/react';
import 'regenerator-runtime/runtime'; // Ajout de cette ligne pour gérer les appels asynchrones

describe('QuestSpace Component', () => {
  // Créer un faux serveur pour simuler les réponses de l'API
  beforeAll(() => {
    jest.mock('node-fetch');
    global.fetch = require('node-fetch');
  });

  // Effacer les mocks après les tests
  afterAll(() => {
    jest.unmock('node-fetch');
  });

  // Mock des réponses de l'API
  beforeEach(() => {
    global.fetch.mockClear();
    global.fetch.mockResolvedValue({
      json: () => Promise.resolve({ status: 'not_started' }),
    });
  });

  it('affiche le composant QuestSpace', async () => {
    render(<QuestSpace />);
    const questSpaceElement = screen.getByTestId('quest-space'); // Utilisation de getByTestId
    expect(questSpaceElement).toBeInTheDocument();
  });  

  it('affiche le titre Mes Questionnaires', async () => {
    render(<QuestSpace />);
    const titleElement = screen.getByText('Mes Questionnaires');
    expect(titleElement).toBeInTheDocument();
  });
});
