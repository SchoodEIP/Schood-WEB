import { React } from 'react'
import './LastAlerts.css'

export function LastAlerts () {
  return (
    <div className='alert-box'>
      <div className='alert-header'>
        <p className='title'>Mes Dernières Alertes</p>
      </div>
      <div className='alert-body'>
        <div className='alert-content'>
          <p>Vous n'avez pas de nouvelle alerte.</p>
        </div>
      </div>
    </div>
  )
}
