import React, { useEffect, useState, useMemo } from 'react'
import { disconnect } from '../../functions/disconnect'
import moment from 'moment'
import '../../css/pages/profilPage.scss'
import veryBadMood from '../../assets/newVeryBadMood.png'
import badMood from '../../assets/newBadMood.png'
import averageMood from '../../assets/newAverageMood.png'
import happyMood from '../../assets/newHappyMood.png'
import veryHappyMood from '../../assets/newVeryHappyMood.png'

export default function FeelingsComp ({ id }) {
    const [feelingsList, setFeelingsList] = useState([])
    const imagePaths = useMemo(() => {
      return [
        veryBadMood,
        badMood,
        averageMood,
        happyMood,
        veryHappyMood
      ]
    }, [])
    const moods = useMemo(() => {
      return ['veryBadMood', 'badMood', 'averageMood', 'happyMood', 'veryHappyMood']
    }, [])

    useEffect(() => {
        const fetchFeelings = async () => {
            try {
              const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/mood?id=` + id, {
                method: 'GET',
                headers: {
                  'x-auth-token': sessionStorage.getItem('token'),
                  'Content-Type': 'application/json'
                }
              })
              if (response.status === 401) {
                disconnect()
              }

              if (!response.ok) /* istanbul ignore next */ {
                throw new Error(`HTTP error! Status: ${response.status}`)
              }

              const data = await response.json()
              setFeelingsList(data)
              console.log(data)

            } catch (error) /* istanbul ignore next */ {
              console.error('Erreur lors de la récupération du profil', error.message)
            }
        }
        fetchFeelings()
    }, [id])

    return (
        <div className='profile-component-container'>
          <h3>Ressentis</h3>
          <div className="report-content">
            {feelingsList.length > 0
              ? feelingsList.map((feeling, index) => (
                <div className="report-container" key={index}>
                  <div className='report-top-container'>
                    <img src={imagePaths[feeling.mood]} alt={moods[feeling.mood]} className="emoticone-image"/>
                    <p style={{fontWeight: "bold"}}>{moment(feeling.date).format('DD/MM/YYYY HH:mm')}</p>
                  </div>
                  <p>{feeling.comment}</p>
                </div>
              ))
              : <span style={{marginLeft: '15px'}}>Aucun ressenti à déclarer</span>
            }
          </div>
        </div>
    )
}