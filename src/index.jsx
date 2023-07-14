import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './Users/Public/loginPage'
import AdmHomePage from './Users/Admin/AdmHomePage'
import AdmAccountsPage from './Users/Admin/AdmAccountsPage'
import SchoolAdmHomePage from './Users/SchoolAdmin/SchoolAdmHomePage'
import SchoolAdmAccountsPage from './Users/SchoolAdmin/SchoolAdmAccountsPage'
import LandingPage from './Users/Public/LandingPage'
import ForgottenPasswordPage from './Users/Public/ForgottenPasswordPage'
import NoPage from './Users/Public/NoPage'
import StudentHomePage from './Users/Student/dashboardStudent'
import TeacherHomePage from './Users/Teacher/dashboardTeacher'
import Messages from './Users/Messages/index'

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
            <Route path='/messages' element={<Messages />} />
          </>
        )}
        {sessionStorage.getItem('role') !== null && (
          <>
            <Route path='/login' element={<Navigate to='/' replace />} />
            <Route path='/forgot' element={<Navigate to='/' replace />} />
            <Route path='/messages' element={<Messages />} />
          </>
        )}
        {sessionStorage.getItem('role') === 'admin' && (
          <>
            <Route path='/' element={<AdmHomePage />} />
            <Route path='/accounts' element={<AdmAccountsPage />} />
            <Route path='/messages' element={<Messages />} />
          </>
        )}
        {sessionStorage.getItem('role') === 'administration' && (
          <>
            <Route path='/' element={<SchoolAdmHomePage />} />
            <Route path='/accounts' element={<SchoolAdmAccountsPage />} />
            <Route path='/messages' element={<Messages />} />
          </>
        )}
        {sessionStorage.getItem('role') === 'teacher' && (
          <>
            <Route path='/' element={<StudentHomePage />} />
            <Route path='/messages' element={<Messages />} />
          </>
        )}
        {sessionStorage.getItem('role') === 'student' && (
          <>
            <Route path='/' element={<TeacherHomePage />} />
            <Route path='/messages' element={<Messages />} />
          </>
        )}
        <Route path='*' element={<NoPage />} />
      </Routes>
    </Router>
  )
}
