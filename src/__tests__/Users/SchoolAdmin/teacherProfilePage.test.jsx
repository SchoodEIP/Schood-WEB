import React from 'react'
import { render, screen, act, waitFor, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { WebsocketProvider } from '../../../contexts/websocket'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import fetchMock from 'fetch-mock'
import TeacherProfilePage from '../../../Users/SchoolAdmin/TeacherProfilePage'
import { disconnect } from '../../../functions/disconnect'

jest.mock('../../../functions/disconnect', () => ({
  disconnect: jest.fn()
}))

jest.mock('chart.js', () => ({
  Chart: jest.fn().mockImplementation(() => {
    return {
      destroy: jest.fn(),
      update: jest.fn(),
      data: {
        datasets: [{}]
      },
      options: {
        scales: {
          x: {
            labels: []
          }
        }
      }
    }
  })
}))

describe('Teacher Profile Page', () => {
  const id = '6638a710dd18a1e42e539476'
  const profileUrl = `${process.env.REACT_APP_BACKEND_URL}/user/profile?id=` + id
  const classesUrl = `${process.env.REACT_APP_BACKEND_URL}/shared/classes`
  const rolesUrl = `${process.env.REACT_APP_BACKEND_URL}/shared/roles`
  const formUrl = `${process.env.REACT_APP_BACKEND_URL}/shared/questionnaire/?id=` + id
  const reportUrl = `${process.env.REACT_APP_BACKEND_URL}/shared/report?id=` + id
  const moodUrl = `${process.env.REACT_APP_BACKEND_URL}/shared/statistics/dailyMoods/?id=` + id

  function getFormDates () {
    const today = new Date()
    const dayOfWeek = today.getDay()
    const diffThisWeekMonday = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1) // Adjust when today is Sunday
    const thisWeekMonday = new Date(today.setDate(diffThisWeekMonday))

    thisWeekMonday.setUTCHours(0, 0, 0, 0)

    const thisWeekSunday = new Date(thisWeekMonday)

    thisWeekSunday.setDate(thisWeekSunday.getDate() + 6)
    thisWeekSunday.setUTCHours(23, 59, 59, 0)

    return [thisWeekMonday, thisWeekSunday]
  }

  const [thisWeekMonday, thisWeekSunday] = getFormDates()

  const formsResponse = [
    {

      fromDate: thisWeekMonday,
      toDate: thisWeekSunday,
      questionnaires: [
        {
          facility: '6638a70fdd18a1e42e53944d',
          createdBy: {
            active: true,
            createdAt: '2024-05-06T09:46:56.164Z',
            email: 'pierre.dubois.Schood1@schood.fr',
            firstname: 'Pierre',
            lastname: 'Dubois',
            picture: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQA',
            updatedAt: '2024-05-06T09:46:56.164Z',
            __v: 0,
            _id: '6638a710dd18a1e42e539476'
          },
          _id: '123',
          title: 'Test',
          classes: [{
            name: '200',
            _id: '123'
          }]
        }
      ]
    },
    {
      fromDate: thisWeekMonday,
      toDate: thisWeekSunday,
      questionnaires: [
        {
          facility: '6638a70fdd18a1e42e53944d',
          createdBy: {
            active: true,
            createdAt: '2024-05-06T09:46:26.164Z',
            email: 'pierre.dubois.Schood1@schood.fr',
            firstname: 'Pierre',
            lastname: 'Dubois',
            picture: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQA',
            updatedAt: '2024-05-06T09:46:56.164Z',
            __v: 0,
            _id: '6638a710dd18a1e42e539476'
          },
          _id: '124',
          title: 'Test2',
          classes: [{
            name: '201',
            _id: '124'
          }]
        }
      ]
    }
  ]

  const mockClassesData = [{ _id: '0', name: '200' }, { _id: '1', name: '200' }]
  const roles = [
    {
      _id: 0,
      name: 'student',
      frenchName: 'Étudiant',
      levelOfAccess: 0
    },
    {
      _id: 1,
      name: 'teacher',
      frenchName: 'Professeur',
      levelOfAccess: 1
    },
    {
      _id: 2,
      name: 'administration',
      frenchName: 'Administrateur Scolaire',
      levelOfAccess: 2
    },
    {
      _id: 3,
      name: 'admin',
      frenchName: 'Administrateur',
      levelOfAccess: 3
    }
  ]
  const reportResponse = [
    {
      createdAt: '2024-02-24T00:00:00.000Z',
      facility: '6638a70fdd18a1e42e53944d',
      message: 'Ceci est un signalement de test',
      seen: false,
      signaledBy: {
        active: true,
        classes: ['6638a70fdd18a1e42e53945c', '6638a70fdd18a1e42e53945e'],
        createdAt: '2024-05-06T09:46:56.164Z',
        email: 'pierre.dubois.Schood1@schood.fr',
        facility: '6638a70fdd18a1e42e53944d',
        firstConnexion: true,
        firstname: 'Pierre',
        lastname: 'Dubois',
        password: '$2a$10$Tjb47mgQ6Rio.QjzdJfTcOk4sm6tjLdQkMZ/viydPdnhfi8KhFmQu',
        picture: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQA',
        role: '6638a70fdd18a1e42e539446',
        updatedAt: '2024-05-06T09:46:56.164Z',
        __v: 0,
        _id: '6638a710dd18a1e42e539476'
      },
      type: 'bullying',
      usersSignaled: [{
        active: true,
        classes: ['6638a70fdd18a1e42e53945c'],
        createdAt: '2024-05-06T09:46:56.313Z',
        email: 'alice.johnson.Schood1@schood.fr',
        facility: '6638a70fdd18a1e42e53944d',
        firstConnexion: true,
        firstname: 'Alice',
        lastname: 'Johnson',
        password: '$2a$10$JmuT0GTKaIpGum0WW9OGxuuTDJUVxIQoXg7Vy4E9DrQ1UO2/uICTm',
        picture: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA0o',
        role: '6638a70fdd18a1e42e539443',
        updatedAt: '2024-05-06T09:46:56.313Z',
        __v: 0,
        _id: '6638a710dd18a1e42e53947a'
      }],
      __v: 0,
      _id: '6638a710dd18a1e42e539553'
    },
    {
      conversation: '659dd4e664034063fff4e38e',
      createdAt: '2024-03-24T00:00:00.000Z',
      facility: '6638a70fdd18a1e42e53944d',
      message: 'Autre signalment',
      seen: false,
      signaledBy: {
        active: true,
        classes: ['6638a70fdd18a1e42e53945c', '6638a70fdd18a1e42e53945e'],
        createdAt: '2024-05-06T09:46:56.164Z',
        email: 'pierre.dubois.Schood1@schood.fr',
        facility: '6638a70fdd18a1e42e53944d',
        firstConnexion: true,
        firstname: 'Pierre',
        lastname: 'Dubois',
        password: '$2a$10$Tjb47mgQ6Rio.QjzdJfTcOk4sm6tjLdQkMZ/viydPdnhfi8KhFmQu',
        picture: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQA',
        role: '6638a70fdd18a1e42e539446',
        updatedAt: '2024-05-06T09:46:56.164Z',
        __v: 0,
        _id: '6638a710dd18a1e42e539476'
      },
      type: 'badcomportment',
      usersSignaled: [{
        active: true,
        classes: ['6638a70fdd18a1e42e53945c'],
        createdAt: '2024-05-06T09:46:56.313Z',
        email: 'alice.johnson.Schood1@schood.fr',
        facility: '6638a70fdd18a1e42e53944d',
        firstConnexion: true,
        firstname: 'Alice',
        lastname: 'Johnson',
        password: '$2a$10$JmuT0GTKaIpGum0WW9OGxuuTDJUVxIQoXg7Vy4E9DrQ1UO2/uICTm',
        picture: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA0o',
        role: '6638a70fdd18a1e42e539443',
        updatedAt: '2024-05-06T09:46:56.313Z',
        __v: 0,
        _id: '6638a710dd18a1e42e53947a'
      }],
      __v: 0,
      _id: '6638a710dd18a1e42e539554'
    }
  ]

  const teacherProfile = {
    firstname: 'John',
    lastname: 'Doe',
    email: 'john.doe@example.com',
    role: '1',
    title: 'Mathematics',
    classes: ['0', '1'],
    picture: 'sqdfsd',
    _id: id
  }
  const mockMoodData = [
    { date: '2024-01-01', moods: [2, 4], average: 0 },
    { date: '2024-01-02', moods: [2, 4], average: 1 },
    { date: '2024-01-03', moods: [2, 4], average: 2 },
    { date: '2024-01-04', moods: [2, 4], average: 3 },
    { date: '2024-01-05', moods: [2, 4], average: 4 },
    { averagePercentage: 80 }
  ]

  beforeEach(() => {
    fetchMock.config.overwriteRoutes = true
    fetchMock.reset()
    fetchMock.get(reportUrl, reportResponse)
    fetchMock.get(profileUrl, teacherProfile)
    fetchMock.get(classesUrl, mockClassesData)
    fetchMock.get(rolesUrl, roles)
    fetchMock.get(formUrl, formsResponse)
    fetchMock.get(moodUrl, mockMoodData)
  })

  afterEach(() => {
    fetchMock.restore()
  })

  it('renders without crashing', async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/profile/6638a710dd18a1e42e539476']}>
          <WebsocketProvider>
            <Routes>
              <Route path='/profile/:id' element={<TeacherProfilePage />} />
            </Routes>
          </WebsocketProvider>
        </MemoryRouter>
      )
    })

    expect(screen.getByText('Informations')).toBeInTheDocument()
    expect(screen.getByText('Questionnaires')).toBeInTheDocument()
    expect(screen.getByText('Signalements')).toBeInTheDocument()
  })

  it('disconnects on profile url', async () => {
    fetchMock.get(profileUrl, 401)

    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/profile/6638a710dd18a1e42e539476']}>
          <WebsocketProvider>
            <Routes>
              <Route path='/profile/:id' element={<TeacherProfilePage />} />
            </Routes>
          </WebsocketProvider>
        </MemoryRouter>
      )
    })

    await waitFor(() => {
      expect(disconnect).toHaveBeenCalled()
    })
  })

  it('disconnects on report url', async () => {
    fetchMock.get(reportUrl, 401)

    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/profile/6638a710dd18a1e42e539476']}>
          <WebsocketProvider>
            <Routes>
              <Route path='/profile/:id' element={<TeacherProfilePage />} />
            </Routes>
          </WebsocketProvider>
        </MemoryRouter>
      )
    })

    await waitFor(() => {
      expect(disconnect).toHaveBeenCalled()
    })
  })

  it('disconnects on form url', async () => {
    fetchMock.get(formUrl, 401)

    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/profile/6638a710dd18a1e42e539476']}>
          <WebsocketProvider>
            <Routes>
              <Route path='/profile/:id' element={<TeacherProfilePage />} />
            </Routes>
          </WebsocketProvider>
        </MemoryRouter>
      )
    })

    await waitFor(() => {
      expect(disconnect).toHaveBeenCalled()
    })
  })

  it('disconnects on classes url', async () => {
    fetchMock.get(classesUrl, 401)

    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/profile/6638a710dd18a1e42e539476']}>
          <WebsocketProvider>
            <Routes>
              <Route path='/profile/:id' element={<TeacherProfilePage />} />
            </Routes>
          </WebsocketProvider>
        </MemoryRouter>
      )
    })

    await waitFor(() => {
      expect(disconnect).toHaveBeenCalled()
    })
  })

  it('disconnects on roles url', async () => {
    fetchMock.get(rolesUrl, 401)

    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/profile/6638a710dd18a1e42e539476']}>
          <WebsocketProvider>
            <Routes>
              <Route path='/profile/:id' element={<TeacherProfilePage />} />
            </Routes>
          </WebsocketProvider>
        </MemoryRouter>
      )
    })

    await waitFor(() => {
      expect(disconnect).toHaveBeenCalled()
    })
  })

  it('disconnects on mood url', async () => {
    fetchMock.get(moodUrl, 401)

    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/profile/6638a710dd18a1e42e539476']}>
          <WebsocketProvider>
            <Routes>
              <Route path='/profile/:id' element={<TeacherProfilePage />} />
            </Routes>
          </WebsocketProvider>
        </MemoryRouter>
      )
    })

    await waitFor(() => {
      expect(disconnect).toHaveBeenCalled()
    })
  })

  it('mocks no classes and roles found', async () => {
    fetchMock.get(classesUrl, [])
    fetchMock.get(rolesUrl, [])

    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/profile/6638a710dd18a1e42e539476']}>
          <WebsocketProvider>
            <Routes>
              <Route path='/profile/:id' element={<TeacherProfilePage />} />
            </Routes>
          </WebsocketProvider>
        </MemoryRouter>
      )
    })

    await waitFor(() => {
      expect(screen.getByText('Aucune classe trouvée')).toBeInTheDocument()
      expect(screen.getByText('Rôle Inconnu')).toBeInTheDocument()
    })
  })

  it('mocks no classes and roles found', async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/profile/6638a710dd18a1e42e539476']}>
          <WebsocketProvider>
            <Routes>
              <Route path='/profile/:id' element={<TeacherProfilePage />} />
            </Routes>
          </WebsocketProvider>
        </MemoryRouter>
      )
    })

    await act(async () => {
      fireEvent.click(screen.getByText('Mois'))
    })

    await act(async () => {
      fireEvent.click(screen.getByText('Semestre'))
    })

    await act(async () => {
      fireEvent.click(screen.getByText('Année'))
    })
  })
})
