import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, act } from '@testing-library/react'
import axios from 'axios'
import TeacherHomePage from '../Users/Teacher/dashboardTeacher'

jest.mock('axios')

describe('Dashboard component', () => {
  it('should fetch data and render sections', async () => {
    // Simuler les données de réponse de l'API
    const mockMoodData = [{ id: 1, value: 'happy' }, { id: 2, value: 'sad' }]
    const mockQuestionnairesData = [{ id: 1, title: 'Questionnaire 1' }, { id: 2, title: 'Questionnaire 2' }]
    const mockAlertsData = [{ id: 1, message: 'Alert 1' }, { id: 2, message: 'Alert 2' }]

    // Simuler les appels à l'API avec les données de réponse
    axios.get.mockImplementationOnce(() => Promise.resolve({ data: mockMoodData }))
    axios.get.mockImplementationOnce(() => Promise.resolve({ data: mockQuestionnairesData }))
    axios.get.mockImplementationOnce(() => Promise.resolve({ data: mockAlertsData }))

    let getByText

    await act(async () => {
      const { getByText: getByTextFn } = render(<TeacherHomePage />)
      getByText = getByTextFn
    })

    // Vérifier que les sections sont rendues avec les données simulées
    expect(getByText('Évolution')).toBeInTheDocument()
    expect(getByText('Questionnaires')).toBeInTheDocument()
    expect(getByText('Alertes')).toBeInTheDocument()

    // Vérifier que les appels à l'API ont été effectués
    expect(axios.get).toHaveBeenCalledTimes(3)
    expect(axios.get).toHaveBeenCalledWith('http://schood.fr/mood')
    expect(axios.get).toHaveBeenCalledWith('http://schood.fr/questionnaires')
    expect(axios.get).toHaveBeenCalledWith('http://schood.fr/alerts')
  })
})
