import React, { useEffect, useState } from 'react'
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
  const moods = ['veryBadMood', 'badMood', 'averageMood', 'happyMood', 'veryHappyMood']

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/shared/questionnaire/dailyMood`, {
      method: 'GET',
      headers: {
        'x-auth-token': sessionStorage.getItem('token')
      }
    })
      .then((response) => response.json())
      .then((data) => {
        setIsAnswered(false)
        setDailyMood('')
        if (data.mood !== 0) {
          setIsAnswered(true)
          setDailyMood(moods[dailyMood.mood - 1])
        }
      })
      .catch((error) => {
        setErrMessage('Erreur : ', error.message)
      })
  }, [])

  const handleMood = (mood) => {
    setIsAnswered(true)
    setDailyMood(mood)

    fetch(`${process.env.REACT_APP_BACKEND_URL}/shared/questionnaire/dailyMood`, {
      method: 'POST',
      headers: {
        'x-auth-token': sessionStorage.getItem('token')
      },
      body: {
        dailyMood: moods.indexOf(dailyMood)
      }
    })
      .then((response) => response.json())
      .then((data) => {
        setIsAnswered(data.moodStatus)
        setDailyMood(data.mood)
      })
      .catch((error) => {
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
          <div style={{ display: 'flex', flexDirection: 'row', gap: '25px' }}>
            <img style={{ height: '100%', cursor: 'pointer', borderRadius: '15px', border: dailyMood === 'veryBadMood' ? '2px solid blue' : 'none' }} src={imagePaths.veryBadMood} alt='Très Mal' onClick={() => handleMood('veryBadMood')} />
            <img style={{ height: '100%', cursor: 'pointer', borderRadius: '15px', border: dailyMood === 'badMood' ? '2px solid blue' : 'none' }} src={imagePaths.badMood} alt='Mal' onClick={() => handleMood('badMood')} />
            <img style={{ height: '100%', cursor: 'pointer', borderRadius: '15px', border: dailyMood === 'averageMood' ? '2px solid blue' : 'none' }} src={imagePaths.averageMood} alt='Bof' onClick={() => handleMood('averageMood')} />
            <img style={{ height: '100%', cursor: 'pointer', borderRadius: '15px', border: dailyMood === 'happyMood' ? '2px solid blue' : 'none' }} src={imagePaths.happyMood} alt='Bien' onClick={() => handleMood('happyMood')} />
            <img style={{ height: '100%', cursor: 'pointer', borderRadius: '15px', border: dailyMood === 'veryHappyMood' ? '2px solid blue' : 'none' }} src={imagePaths.veryHappyMood} alt='Très Bien' onClick={() => handleMood('veryHappyMood')} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default MoodForm
