import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './styles/sidebar.scss'
import Login from './Users/Public/loginPage'
import AdmHomePage from './Users/Admin/AdmHomePage'
import AdmAccountsPage from './Users/Admin/AdmAccountsPage'
import SchoolAdmHomePage from './Users/SchoolAdmin/SchoolAdmHomePage'
import SchoolAdmAccountsPage from './Users/SchoolAdmin/SchoolAdmAccountsPage'
import LandingPage from './Users/Public/LandingPage'
import ForgottenPasswordPage from './Users/Public/ForgottenPasswordPage'
import NoPage from './Users/Public/NoPage'
import Dashboard from './Users/Student/dashboardStudent'

const rootElement = document.getElementById('root')

if (rootElement) {
  const root = createRoot(rootElement)
  root.render(
    <Router>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/login' element={<Login />} />
        <Route path='/Adm/Home' element={<AdmHomePage />} />
        <Route path='/Adm/Accounts' element={<AdmAccountsPage />} />
        <Route path='/School/Home' element={<SchoolAdmHomePage />} />
        <Route path='/School/Accounts' element={<SchoolAdmAccountsPage />} />
        <Route path='/request' element={<ForgottenPasswordPage />} />
        <Route path='/Student/Home' element={<Dashboard/>} />
        <Route path='*' element={<NoPage />} />
      </Routes>
    </Router>
  )
}
