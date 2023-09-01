import { React } from 'react'
import '../../css/Components/Graph/graphSpace.css'

export function GraphSpace () {
  return (
    <div className='graph-box'>
      <div className='graph-header'>
        <p className='title'>Evolution semestrielle de l'humeur de mon établissement</p>
      </div>
      <div className='graph-body'>
        <div className='graph-content'>
          <p>Pas d'évolution pour le moment.</p>
        </div>
      </div>
    </div>
  )
}
