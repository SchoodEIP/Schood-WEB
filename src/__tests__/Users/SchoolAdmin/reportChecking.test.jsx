import ReportChecking from '../../../Users/SchoolAdmin/reportChecking'
import React from 'react'
import { render, screen, waitFor, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import { WebsocketProvider } from '../../../contexts/websocket'
import { BrowserRouter } from 'react-router-dom'
import fetchMock from 'fetch-mock'
import { disconnect } from '../../../functions/disconnect'

jest.mock('../../../functions/disconnect', () => ({
  disconnect: jest.fn()
}))

describe('ReportChecking Component', () => {
  const reportId = '6638a710dd18a1e42e539554'
  const conversationId = '659dd4e664034063fff4e38e'
  const getReports = `${process.env.REACT_APP_BACKEND_URL}/shared/report`
  const getReportedConversations = `${process.env.REACT_APP_BACKEND_URL}/user/chat/${conversationId}/messages`
  const getReportProcessingStatus = `${process.env.REACT_APP_BACKEND_URL}/shared/report/${reportId}`
  const deleteReport = `${process.env.REACT_APP_BACKEND_URL}/shared/report/${reportId}`
  const postReport = `${process.env.REACT_APP_BACKEND_URL}/shared/report/${reportId}`

  const getReportsResponse = [
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

  const getReportedConversationsResponse = [
    {
      _id: '659dd4ec64034063fff4e3a5',
      chat: '659dd4e664034063fff4e38e',
      content: 'bonjour',
      date: '2024-01-09T23:21:16.202Z',
      user: '6638a710dd18a1e42e53947a'
    },
    {
      _id: '659dd4f364034063fff4e3be',
      chat: '659dd4e664034063fff4e38e',
      content: 'au revoir',
      date: '2024-01-09T23:21:23.073Z',
      user: '6638a710dd18a1e42e539476'
    }
  ]

  const deleteReportResponse = {
    status: 200,
    statusText: 'OK'
  }

  const postReportResponse = {
    status: 200,
    statusText: 'OK'
  }

  beforeEach(() => {
    fetchMock.config.overwriteRoutes = true
    fetchMock.reset()
    fetchMock.get(getReports, getReportsResponse)
    fetchMock.get(getReportedConversations, getReportedConversationsResponse)
    fetchMock.get(getReportProcessingStatus, {})
    fetchMock.delete(deleteReport, deleteReportResponse)
    fetchMock.post(postReport, postReportResponse)
  })

  afterEach(() => {
    fetchMock.restore()
  })

  it('renders without crashing', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <ReportChecking />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })

    expect(screen.getByText('Mes Signalements')).toBeInTheDocument()
    expect(screen.getByText('Harcèlement')).toBeInTheDocument()
    expect(screen.getByText('Autre signalment')).toBeInTheDocument()
  })

  // it('disconnects through request url', async () => {
  //   fetchMock.get(getReports, 401)
  //   await act(async () => {
  //     render(
  //       <BrowserRouter>
  //         <WebsocketProvider>
  //           <ReportChecking />
  //         </WebsocketProvider>
  //       </BrowserRouter>
  //     )
  //   })

  //   await waitFor(() => {
  //     expect(disconnect).toHaveBeenCalled()
  //   })
  // })

  // it('disconnects through reported conversation url', async () => {
  //   fetchMock.get(getReportedConversations, 401)
  //   await act(async () => {
  //     render(
  //       <BrowserRouter>
  //         <WebsocketProvider>
  //           <ReportChecking />
  //         </WebsocketProvider>
  //       </BrowserRouter>
  //     )
  //   })

  //   await waitFor(() => {
  //     expect(disconnect).toHaveBeenCalled()
  //   })
  // })

  // it('handles filter change correctly', async () => {
  //   await act(async () => {
  //     render(
  //       <BrowserRouter>
  //         <WebsocketProvider>
  //           <ReportChecking />
  //         </WebsocketProvider>
  //       </BrowserRouter>
  //     )
  //   })

  //   await act(async () => {
  //     fireEvent.click(screen.getByText('Toutes'))
  //   })

  //   expect(screen.getByText('Harcèlement')).toBeInTheDocument()

  //   await act(async () => {
  //     fireEvent.click(screen.getByText('Traitées'))
  //   })

  //   expect(screen.queryByText('Harcèlement')).not.toBeInTheDocument()

  //   await act(async () => {
  //     fireEvent.click(screen.getByText('Non traitées'))
  //   })

  //   expect(screen.getByText('Harcèlement')).toBeInTheDocument()
  // })

  // it('handles report validation', async () => {
  //   await act(async () => {
  //     render(
  //       <BrowserRouter>
  //         <WebsocketProvider>
  //           <ReportChecking />
  //         </WebsocketProvider>
  //       </BrowserRouter>
  //     )
  //   })

  //   await act(async () => {
  //     fireEvent.click(screen.getByText('Harcèlement'))
  //   })

  //   expect(screen.getByText('La demande n\'a pas encore été traitée.')).toBeInTheDocument()

  //   await act(async () => {
  //     fireEvent.click(screen.getByText('Valider'))
  //   })

  //   expect(screen.getByText('La demande a été traitée.')).toBeInTheDocument()
  // })

  // it('handles report deletion', async () => {
  //   await act(async () => {
  //     render(
  //       <BrowserRouter>
  //         <WebsocketProvider>
  //           <ReportChecking />
  //         </WebsocketProvider>
  //       </BrowserRouter>
  //     )
  //   })

  //   await act(async () => {
  //     fireEvent.click(screen.getByText('Harcèlement'))
  //   })

  //   expect(screen.getByText('La demande n\'a pas encore été traitée.')).toBeInTheDocument()

  //   await act(async () => {
  //     fireEvent.click(screen.getByText('Refuser'))
  //   })

  //   expect(screen.queryByText('Harcèlement')).not.toBeInTheDocument()
  // })

  // it('handles error', async () => {
  //   fetchMock.get(getReportProcessingStatus, { status: 404, statusText: 'Not Found' })

  //   await act(async () => {
  //     render(
  //       <BrowserRouter>
  //         <WebsocketProvider>
  //           <ReportChecking />
  //         </WebsocketProvider>
  //       </BrowserRouter>
  //     )
  //   })

  //   const mockFetch = jest.fn().mockRejectedValue(new Error('Network Error'))

  //   global.fetch = mockFetch

  //   await act(async () => {
  //     fireEvent.click(screen.getByText('Harcèlement'))
  //   })

  //   expect(screen.getByText('Erreur lors de la vérification du statut de traitement.')).toBeInTheDocument()
  // })
})
