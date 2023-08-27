import { React } from 'react'
import '../../css/pages/NoPage.scss'
import PreviousPage from '../../Components/Buttons/PreviousPage'

export default function NoPage () {
  return (
    <div id='no-page-content'>
      <h1 className='error-message-no-page'>Error 404</h1>
      <h1 className='error-message-no-page'>This page does not exist.</h1>
      <PreviousPage />
    </div>
  )
}
