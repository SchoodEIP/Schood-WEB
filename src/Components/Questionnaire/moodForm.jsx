import React, { useEffect, useState, useMemo } from 'react'
import '../../css/Components/Buttons/button.css'
export function MoodForm () {
  const [isAnswered, setIsAnswered] = useState(false)
  const [dailyMood, setDailyMood] = useState('')
  const [errMessage, setErrMessage] = useState('')
  const imagePaths = {
    veryBadMood: require('../../assets/veryBadMood.jpg'),
    badMood: require('../../assets/badMood.jpg'),
    averageMood: require('../../assets/averageMood.jpg'),
    happyMood: require('../../assets/happyMood.jpg'),
    veryHappyMood: require('../../assets/veryHappyMood.jpg')
  }

  const setMoods = () => {
    return ['veryBadMood', 'badMood', 'averageMood', 'happyMood', 'veryHappyMood']
  }

  const moods = useMemo(() => setMoods(), [])

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/student/dailyMood`, {
      method: 'GET',
      headers: {
        'x-auth-token': sessionStorage.getItem('token')
      }
    })
      .then((response) => response.json())
      .then((data) => {
        setIsAnswered(false)
        setDailyMood('')
        if (data.mood) {
          setIsAnswered(true)
          setDailyMood(moods[data.mood])
        }
      })
      .catch((error) => /* istanbul ignore next */ {
        setErrMessage('Erreur : ', error.message)
      })
  }, [moods])

  const handleMood = (dailyMood) => {
    const mood = { mood: moods.indexOf(dailyMood) }

    fetch(`${process.env.REACT_APP_BACKEND_URL}/student/dailyMood`, {
      method: 'POST',
      headers: {
        'x-auth-token': sessionStorage.getItem('token'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(mood)
    })
      // .then((response) => response.json())
      .then((response) => {
        setIsAnswered(true)
        setDailyMood(dailyMood)
      })
      .catch((error) => /* istanbul ignore next */ {
        console.error(error)
        // setErrMessage('Erreur : ', error.message)
      })
  }

  return (
    <div className='graph-box'>
      <div className='graph-header'>
        <p className='title'>{isAnswered ? 'Voici votre humeur du jour' : 'Quelle est votre humeur du jour ?'}</p>
      </div>
      <div className='graph-body'>
        <div>
          {errMessage !== '' ? <p>{errMessage}</p> : ''}
          <div style={{ display: 'flex', flexDirection: 'row', gap: '25px', width: '630px' }}>
            <img style={{ width: '75px', cursor: 'pointer', borderRadius: '15px', border: dailyMood === 'veryBadMood' ? '2px solid blue' : 'none' }} src={imagePaths.veryBadMood} alt='Très Mal' onClick={() => handleMood('veryBadMood')} />
            <img style={{ width: '75px', cursor: 'pointer', borderRadius: '15px', border: dailyMood === 'badMood' ? '2px solid blue' : 'none' }} src={imagePaths.badMood} alt='Mal' onClick={() => handleMood('badMood')} />
            <img style={{ width: '75px', cursor: 'pointer', borderRadius: '15px', border: dailyMood === 'averageMood' ? '2px solid blue' : 'none' }} src={imagePaths.averageMood} alt='Bof' onClick={() => handleMood('averageMood')} />
            <img style={{ width: '75px', cursor: 'pointer', borderRadius: '15px', border: dailyMood === 'happyMood' ? '2px solid blue' : 'none' }} src={imagePaths.happyMood} alt='Bien' onClick={() => handleMood('happyMood')} />
            <img style={{ width: '75px', cursor: 'pointer', borderRadius: '15px', border: dailyMood === 'veryHappyMood' ? '2px solid blue' : 'none' }} src={imagePaths.veryHappyMood} alt='Très Bien' onClick={() => handleMood('veryHappyMood')} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default MoodForm
