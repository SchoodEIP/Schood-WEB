import { React } from 'react'
import '../../css/Components/Questionnaire/questSpace.css'

export function QuestSpace () {
  return (
    <div className='quest-box'>
      <div className='quest-header'>
        <p className='title'>Mes Questionnaires</p>
      </div>
      <div className='quest-body'>
        <div className='quest-content'>
          <p>Vous n'avez pas de questionnaire.</p>
        </div>
      </div>
    </div>
  )
}
