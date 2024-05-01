import { React, useEffect, useState } from 'react'
import '../../css/Components/Graph/graphSpace.scss'
import { Link } from 'react-router-dom'
import rightArrow from '../../assets/right-arrow.png'

export function GraphSpace () {
  const [title, setTitle] = useState("")
  const role = useState(sessionStorage.getItem('role'))

  const setTitleByPerm = () => {
    if (role === 'student') {
      setTitle("Evolution de mon humeur")
    } else if (role === 'teacher') {
      setTitle("Evolution de l'humeur de mes classes")
    } else {
      setTitle("Evolution de l'humeur de mon établissement")
    }
  }

  useEffect(() => {
    setTitleByPerm();
  }, [role, title])

  return (
    <div className='graph-box'>
      <div className='graph-header'>
        <span className='title'>{title}</span>
        <Link to={'/statistiques'} className='see-more'>
          Voir plus
          <img className='img' src={rightArrow} alt='Right arrow'/>
        </Link>
      </div>
      <div className='graph-body'>
        <div className='graph-content'>
          <p>Pas d'évolution pour le moment.</p>
        </div>
      </div>
    </div>
  )
}
