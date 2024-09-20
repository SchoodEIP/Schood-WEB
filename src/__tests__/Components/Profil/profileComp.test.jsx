import React from 'react'
import { render, screen, act, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import fetchMock from 'fetch-mock'
import { WebsocketProvider } from '../../../contexts/websocket'
import { MemoryRouter } from 'react-router-dom'
import { disconnect } from '../../../functions/disconnect'
import ProfileComp from '../../../Components/Profil/profileComp'

jest.mock('../../../functions/disconnect', () => ({
  disconnect: jest.fn()
}))

describe('helpPage', () => {
  const rolesUrl = `${process.env.REACT_APP_BACKEND_URL}/shared/roles`
  const classesUrl = `${process.env.REACT_APP_BACKEND_URL}/shared/classes`

  const classes = [
    {
      _id: 0,
      name: '200',
      facility: '0'
    },
    {
      _id: 1,
      name: '201',
      facility: '0'
    }
  ]

  const roles = [
    {
      _id: '0',
      name: 'student',
      frenchName: 'Élève',
      levelOfAccess: 0
    },
    {
      _id: '1',
      name: 'teacher',
      frenchName: 'Professeur',
      levelOfAccess: 1
    },
    {
      _id: '2',
      name: 'administration',
      frenchName: 'Aministrateur Scolaire',
      levelOfAccess: 2
    },
    {
      _id: '3',
      name: 'admin',
      frenchName: 'Admin',
      levelOfAccess: 3
    }
  ]

  const profileTeacher = {
    active: true,
    classes: ['0', '1'],
    email: 'pierre.dubois.Schood1@schood.fr',
    facility: '0',
    firstname: 'Pierre',
    lastname: 'Dubois',
    picture: 'https://res.cloudinary.com/def3ztvli/image/upload/v1716431987/d959d8e47a1e9fd2293f1b5f9c61a729_gxlcep.png',
    role: '1',
    _id: '1'
  }

  const profileStudent = {
    active: true,
    classes: ['0'],
    email: 'alice.johnson.Schood1@schood.fr',
    facility: '0',
    firstname: 'Alice',
    lastname: 'Johnson',
    role: '0',
    _id: '0'
  }

  const profileAdmin = {
    active: true,
    classes: ['0', '1'],
    email: 'pierre.dubois.Schood1@schood.fr',
    facility: '0',
    firstname: 'Pierre',
    lastname: 'Dubois',
    picture: 'https://res.cloudinary.com/def3ztvli/image/upload/v1716431987/d959d8e47a1e9fd2293f1b5f9c61a729_gxlcep.png',
    role: '5',
    _id: '2'
  }

  beforeEach(() => {
    fetchMock.reset()
    fetchMock.config.overwriteRoutes = true
    fetchMock.get(rolesUrl, roles)
    fetchMock.get(classesUrl, classes)
  })

  afterEach(() => {
    fetchMock.restore()
  })

  it('shows teacher profile', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <WebsocketProvider>
            <ProfileComp profile={profileTeacher} />
          </WebsocketProvider>
        </MemoryRouter>
      )
    })

    const name = await screen.getByText('Pierre Dubois')
    await waitFor(async () => {
      expect(name).toBeInTheDocument()
    })

    const email = await screen.getByText('pierre.dubois.Schood1@schood.fr')
    await waitFor(async () => {
      expect(email).toBeInTheDocument()
    })

    // const role = await screen.getByText('Professeur')
    // await waitFor(async () => {
    //   expect(role).toBeInTheDocument()
    // })

    // const classes = await screen.getByText('200, 201')
    // await waitFor(async () => {
    //   expect(classes).toBeInTheDocument()
    // })
  })

  it('shows student profile', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <WebsocketProvider>
            <ProfileComp profile={profileStudent} />
          </WebsocketProvider>
        </MemoryRouter>
      )
    })

    const name = await screen.getByText('Alice Johnson')
    await waitFor(async () => {
      expect(name).toBeInTheDocument()
    })

    const email = await screen.getByText('alice.johnson.Schood1@schood.fr')
    await waitFor(async () => {
      expect(email).toBeInTheDocument()
    })

    // const classes = await screen.getByText('200')
    // await waitFor(async () => {
    //   expect(classes).toBeInTheDocument()
    // })

    // const role = await screen.getByText('Élève')
    // await waitFor(async () => {
    //   expect(role).toBeInTheDocument()
    // })
  })

  it('shows unknown role', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <WebsocketProvider>
            <ProfileComp profile={profileAdmin} />
          </WebsocketProvider>
        </MemoryRouter>
      )
    })

    const role = await screen.getByText('Rôle Inconnu')
    await waitFor(async () => {
      expect(role).toBeInTheDocument()
    })
  })

  it('disconnect roles', async () => {
    fetchMock.get(rolesUrl, 401)
    await act(async () => {
      render(
        <MemoryRouter>
          <WebsocketProvider>
            <ProfileComp profile={profileAdmin} />
          </WebsocketProvider>
        </MemoryRouter>
      )
    })

    await waitFor(async () => {
      expect(disconnect).toBeCalled()
    })
  })

  it('disconnect classes', async () => {
    fetchMock.get(classesUrl, 401)
    await act(async () => {
      render(
        <MemoryRouter>
          <WebsocketProvider>
            <ProfileComp profile={profileStudent} />
          </WebsocketProvider>
        </MemoryRouter>
      )
    })

    await waitFor(async () => {
      expect(disconnect).toBeCalled()
    })
  })
})
