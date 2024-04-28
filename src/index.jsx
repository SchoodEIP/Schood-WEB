import "react-toastify/dist/ReactToastify.css";
import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import AdmHelpPage from './Users/Admin/admHelpPage'
import AdmAccountsPage from './Users/Admin/admAccountsPage'
import AdmHomePage from './Users/Admin/admHomePage'
import ForgottenPasswordPage from './Users/Public/forgottenPasswordPage'
import Login from './Users/Public/loginPage'
import NoPage from './Users/Public/noPage'
import SchoolAdmAccountsPage from './Users/SchoolAdmin/schoolAdmAccountsPage'
import SchoolAdmHomePage from './Users/SchoolAdmin/schoolAdmHomePage'
import ChatRoomPage from './Users/Shared/chatRoomPage'
import CreateAlert from './Users/Shared/createAlerts'
import HelpPage from './Users/Shared/helpPage'
import ProfilPage from './Users/Shared/profilPage'
import StudentHomePage from './Users/Student/dashboardStudent'
import StudentStatPage from './Users/Student/statisticsStudent'
import TeacherHomePage from './Users/Teacher/dashboardTeacher'
import NewFormPage from './Users/Teacher/newFormPage'
import FormListStudentPage from './Users/Student/formListStudentPage'
import FormStudentPage from './Users/Student/formStudentPage'
import FormListTeacherPage from './Users/Teacher/formListTeacherPage'
import FormTeacherPage from './Users/Teacher/formTeacherPage'
import ModifyFormTeacherPage from './Users/Teacher/modifyFormTeacherPage'
import ReportChecking from './Users/SchoolAdmin/reportChecking'
import TeacherStatPage from './Users/Teacher/statisticsTeacher'
import { WebsocketProvider } from './contexts/websocket'
import FeelingsStudentPage from './Users/Student/feelingsStudentPage'
import 'react-tooltip/dist/react-tooltip.css'
import Sidebar from './Components/Sidebar/sidebar'
import './css/index.scss'
import { Slide, ToastContainer } from 'react-toastify'
const rootElement = document.getElementById('root')

if (rootElement) {
  const root = createRoot(rootElement)
  root.render(
    <WebsocketProvider>
      <Router>
        <div className='App'>
          <div className='sidebar'>
            {sessionStorage.getItem('role') !== null && (
              <Sidebar />
            )}
          </div>
          <div className='content'>
            <Routes>
              {sessionStorage.getItem('role') === null && (
                <>
                  <Route path='/' element={<Login />}/>
                  <Route path='/forgot' element={<ForgottenPasswordPage />} />
                </>
              )}
              {sessionStorage.getItem('role') !== null && (
                <>
                  <Route path='/login' element={<Navigate to='/' replace />} />
                  <Route path='/forgot' element={<Navigate to='/' replace />} />
                  <Route path='/messages' element={<ChatRoomPage />} />
                  <Route path='/alerts' element={<CreateAlert />} />
                  <Route path='/profil' element={<ProfilPage />} />
                </>
              )}
              {sessionStorage.getItem('role') === 'admin' && (
                <>
                  <Route path='/' element={<AdmHomePage />} />
                  <Route path='/accounts' element={<AdmAccountsPage />} />
                  <Route path='/aides' element={<AdmHelpPage />} />
                  <Route path='/messages' element={<ChatRoomPage />} />
                  <Route path='/alerts' element={<CreateAlert />} />
                  <Route path='/profil' element={<ProfilPage />} />
                </>
              )}
              {sessionStorage.getItem('role') === 'administration' && (
                <>
                  <Route path='/' element={<SchoolAdmHomePage />} />
                  <Route path='/accounts' element={<SchoolAdmAccountsPage />} />
                  <Route path='/aides' element={<AdmHelpPage />} />
                  <Route path='/messages' element={<ChatRoomPage />} />
                  <Route path='/statistiques' element={<TeacherStatPage />} />
                  <Route path='/reports' element={<ReportChecking />} />
                  <Route path='/alerts' element={<CreateAlert />} />
                  <Route path='/profil' element={<ProfilPage />} />
                </>
              )}
              {sessionStorage.getItem('role') === 'student' && (
                <>
                  <Route path='/' element={<StudentHomePage />} />
                  <Route path='/questionnaires' element={<FormListStudentPage />} />
                  <Route path='/questionnaire/:id' element={<FormStudentPage />} />
                  <Route path='/statistiques' element={<StudentStatPage />} />
                  <Route path='/aides' element={<HelpPage />} />
                  <Route path='/profil' element={<ProfilPage />} />
                  <Route path='/feelings' element={<FeelingsStudentPage />} />
                </>
              )}
              {sessionStorage.getItem('role') === 'teacher' && (
                <>
                  <Route path='/' element={<TeacherHomePage />} />
                  <Route path='/messages' element={<ChatRoomPage />} />
                  <Route path='/questionnaires' element={<FormListTeacherPage />} />
                  <Route path='/questionnaire' element={<NewFormPage />} />
                  <Route path='/questionnaire/:id' element={<FormTeacherPage />} />
                  <Route path='/questionnaire/:id/modify' element={<ModifyFormTeacherPage />} />
                  <Route path='/statistiques' element={<TeacherStatPage />} />
                  <Route path='/aides' element={<HelpPage />} />
                  <Route path='/alerts' element={<CreateAlert />} />
                  <Route path='/profil' element={<ProfilPage />} />
                </>
              )}
              <Route path='*' element={<NoPage />} />
            </Routes>
          </div>
          <ToastContainer
            position="bottom-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            transition={Slide}
          />
        </div>
      </Router>
    </WebsocketProvider>
  )
}
