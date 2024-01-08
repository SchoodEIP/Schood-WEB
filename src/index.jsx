import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './Users/Public/loginPage'
import AdmHomePage from './Users/Admin/admHomePage'
import AdmHelpPage from './Users/Admin/admHelpPage'
import AdmAccountsPage from './Users/Admin/admAccountsPage'
import SchoolAdmHomePage from './Users/SchoolAdmin/schoolAdmHomePage'
import SchoolAdmAccountsPage from './Users/SchoolAdmin/schoolAdmAccountsPage'
import LandingPage from './Users/Public/landingPage'
import ForgottenPasswordPage from './Users/Public/forgottenPasswordPage'
import NoPage from './Users/Public/noPage'
import StudentHomePage from './Users/Student/dashboardStudent'
import TeacherHomePage from './Users/Teacher/dashboardTeacher'
import NewFormPage from './Users/Teacher/newFormPage'
import FormListStudentPage from './Users/Student/formListStudentPage'
import FormStudentPage from './Users/Student/formStudentPage'
import FormListTeacherPage from './Users/Teacher/formListTeacherPage'
import FormTeacherPage from './Users/Teacher/formTeacherPage'
import HelpPage from './Users/Shared/helpPage'
import ChatRoomPage from './Users/Shared/chatRoomPage'
import ReportChecking from './Users/SchoolAdmin/reportChecking'

const rootElement = document.getElementById('root')

if (rootElement) {
  const root = createRoot(rootElement)
  root.render(
    <Router>
      <Routes>
        {sessionStorage.getItem('role') === null && (
          <>
            <Route path='/' element={<LandingPage />} />
            <Route path='/login' element={<Login />} />
            <Route path='/forgot' element={<ForgottenPasswordPage />} />
          </>
        )}
        {sessionStorage.getItem('role') !== null && (
          <>
            <Route path='/login' element={<Navigate to='/' replace />} />
            <Route path='/forgot' element={<Navigate to='/' replace />} />
            <Route path='/messages' element={<ChatRoomPage />} />
          </>
        )}
        {sessionStorage.getItem('role') === 'admin' && (
          <>
            <Route path='/' element={<AdmHomePage />} />
            <Route path='/accounts' element={<AdmAccountsPage />} />
            <Route path='/aides' element={<AdmHelpPage />} />
            <Route path='/messages' element={<ChatRoomPage />} />
          </>
        )}
        {sessionStorage.getItem('role') === 'administration' && (
          <>
            <Route path='/' element={<SchoolAdmHomePage />} />
            <Route path='/accounts' element={<SchoolAdmAccountsPage />} />
            <Route path='/aides' element={<AdmHelpPage />} />
            <Route path='/messages' element={<ChatRoomPage />} />
            <Route path='/reports' element={<ReportChecking />} />
          </>
        )}
        {sessionStorage.getItem('role') === 'student' && (
          <>
            <Route path='/' element={<StudentHomePage />} />
            <Route path='/questionnaires' element={<FormListStudentPage />} />
            <Route path='/questionnaire/:id' element={<FormStudentPage />} />
            <Route path='/aides' element={<HelpPage />} />
          </>
        )}
        {sessionStorage.getItem('role') === 'teacher' && (
          <>
            <Route path='/' element={<TeacherHomePage />} />
            <Route path='/messages' element={<ChatRoomPage />} />
            <Route path='/questionnaires' element={<FormListTeacherPage />} />
            <Route path='/questionnaire' element={<NewFormPage />} />
            <Route path='/questionnaire/:id' element={<FormTeacherPage />} />
            <Route path='/aides' element={<HelpPage />} />
          </>
        )}
        <Route path='*' element={<NoPage />} />
      </Routes>
    </Router>
  )
}
