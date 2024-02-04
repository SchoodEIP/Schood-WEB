// Import necessary libraries and components
import TeacherStatPage from '../../../Users/Teacher/statisticsTeacher';
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import fetchMock from 'fetch-mock';

describe('TeacherStatPage Component', () => {
  const mockData = [
    {
      studentName: 'John Doe',
      date: '2024-02-04',
      feeling: 'Happy',
    },
    // Add more mock data as needed
  ];

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  beforeEach(() => {
    fetchMock.reset();
  });

  afterEach(() => {
    fetchMock.restore();
  });

  it('renders student moods when ID is provided in the URL', async () => {
    const studentId = '1';
    const mockResponse = mockData;

    fetchMock.get(`${backendUrl}/teacher/dailyMood/${studentId}`, {
      body: mockResponse,
      headers: { 'content-type': 'application/json' },
    });

    await act(async () => {
      render(
        <MemoryRouter initialEntries={[`/teacher/dailyMood/${studentId}`]}>
          <Routes>
            <Route path="/teacher/dailyMood/:id" element={<TeacherStatPage />} />
          </Routes>
        </MemoryRouter>
      );
    });

    expect(screen.getByText('Ressentis des étudiants')).toBeInTheDocument();
    mockResponse.forEach((mood) => {
      expect(screen.getByText(`Ressenti: ${mood.feeling}`)).toBeInTheDocument();
    });
  });

  it('handles error when fetching student moods', async () => {
    const studentId = '2';

    fetchMock.get(`${backendUrl}/teacher/dailyMood/${studentId}`, 500);

    await act(async () => {
      render(
        <MemoryRouter initialEntries={[`/teacher/dailyMood/${studentId}`]}>
          <Routes>
            <Route path="/teacher/dailyMood/:id" element={<TeacherStatPage />} />
          </Routes>
        </MemoryRouter>
      );
    });

    expect(screen.getByText('Erreur lors de la récupération des ressentis')).toBeInTheDocument();
  });

  it('displays "Aucun ressenti disponible." when no moods are available', async () => {
    const studentId = '3';

    fetchMock.get(`${backendUrl}/teacher/dailyMood/${studentId}`, {
      body: [],
      headers: { 'content-type': 'application/json' },
    });

    await act(async () => {
      render(
        <MemoryRouter initialEntries={[`/teacher/dailyMood/${studentId}`]}>
          <Routes>
            <Route path="/teacher/dailyMood/:id" element={<TeacherStatPage />} />
          </Routes>
        </MemoryRouter>
      );
    });

    expect(screen.getByText('Aucun ressenti disponible.')).toBeInTheDocument();
  });
});
