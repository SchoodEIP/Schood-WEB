import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './Users/Public/loginPage'
import AdmHomePage from './Users/Admin/admHomePage'
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
          </>
        )}
        {sessionStorage.getItem('role') === 'admin' && (
          <>
            <Route path='/' element={<AdmHomePage />} />
            <Route path='/accounts' element={<AdmAccountsPage />} />
          </>
        )}
        {sessionStorage.getItem('role') === 'administration' && (
          <>
            <Route path='/' element={<SchoolAdmHomePage />} />
            <Route path='/accounts' element={<SchoolAdmAccountsPage />} />
          </>
        )}
        {sessionStorage.getItem('role') === 'student' && (
          <>
            <Route path='/' element={<StudentHomePage />} />
            <Route path='/questionnaires' element={<FormListStudentPage />} />
            <Route path='/questionnaire/:id' element={<FormStudentPage />} />
          </>
        )}
        {sessionStorage.getItem('role') === 'teacher' && (
          <>
            <Route path='/' element={<TeacherHomePage />} />
            <Route path='/questionnaires' element={<FormListTeacherPage />} />
            <Route path='/questionnaire' element={<NewFormPage />} />
            <Route path='/questionnaire/:id' element={<FormTeacherPage />} />
          </>
        )}
        <Route path='*' element={<NoPage />} />
      </Routes>
    </Router>
  )
}
