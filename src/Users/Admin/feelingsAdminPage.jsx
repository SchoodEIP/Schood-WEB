import React, { useEffect, useState, useMemo } from 'react'
import moment from 'moment'
import Popup from 'reactjs-popup'
import HeaderComp from '../../Components/Header/headerComp'
import '../../css/Components/Feelings/feelings.scss'
import '../../css/Components/Popup/popup.scss'
import cross from '../../assets/Cross.png'
import closeBlack from '../../assets/closeBlack.png'
import veryBadMood from '../../assets/newVeryBadMood.png'
import badMood from '../../assets/newBadMood.png'
import averageMood from '../../assets/newAverageMood.png'
import happyMood from '../../assets/newHappyMood.png'
import veryHappyMood from '../../assets/newVeryHappyMood.png'
import questionIcon from '../../assets/questionIcon.png'
import { disconnect } from '../../functions/disconnect'
import { toast } from 'react-toastify'

const FeelingsAdminPage = () => {
  const [isShown, setIsShown] = useState(false)
  const [shownFeeling, setShownFeeling] = useState([])
  const [shownUser, setShownUser] = useState({ firstname: '', lastname: '' })
  const [demand, setDemand] = useState({
    user: '',
    mood: '',
    reason: '',
    message: 'Afin de te trouver des solutions ensemble, acceptes tu de lever ton anonymat pour que nous nous rencontrions, mais celà tout en préservant la confidentialité de ce qui sera échangé ?'
  })
  const [demands, setDemands] = useState([])
  const [feelings, setFeelings] = useState([])
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
  const emotions = useMemo(() => {
    return {
      veryBadMood: 'Malheureux',
      badMood: 'Mauvaise humeur',
      averageMood: 'Neutre',
      happyMood: 'Bonne Humeur',
      veryHappyMood: 'Heureux'
    }
  }, [])

  const handleDemandPopup = (userId, feelingId) => {
    demand.user = userId
    demand.reason = feelingId
    demand.mood = feelingId
    setDemand(demand)
    const toFind = demands.find(item => item.reason === feelingId)
    if (toFind) { toast.warn('Vous avez déjà effectué une demande de désanonymisation pour ce ressenti.') } else { handleAskDesanonym() }
  }

  async function getDesanonym () {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/shared/desanonym/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': sessionStorage.getItem('token')
      }
    })
      .then(response => {
        if (response.status === 401) {
          disconnect()
        }
        return response.json()
      })
      .then(data => {
        setDemands(data)
      })
      .catch(error => /* istanbul ignore next */ {
        toast.error('Erreur lors de la récupération des ressentis', error)
      })
  }

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/shared/moods/all`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': sessionStorage.getItem('token')
      }
    })
      .then(response => {
        if (response.status === 401) {
          disconnect()
        }
        return response.json()
      })
      .then(data => {
        if (Array.isArray(data)) {
          setFeelings(data)
          console.log(data)
        } else {
          toast.error('Les données reçues ne sont pas valides.')
        }
      })
      .catch(error => /* istanbul ignore next */ {
        toast.error('Erreur lors de la récupération des ressentis', error)
      })
    getDesanonym()
  }, [])

  const handleAskDesanonym = () => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/shared/desanonym/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': sessionStorage.getItem('token')
      },
      body: JSON.stringify(demand)
    })
      .then(response => {
        if (response.status === 401) {
          disconnect()
        } else if (response.status === 200) {
          // set feeling.status to waiting !
          toast.success('La demande de désanonymisation a été effectuée.')
          getDesanonym()
        } else {
          toast.error('Erreur serveur.')
        }
        return response
      })
      .catch(error => /* istanbul ignore next */ {
        console.error('Network or unexpected error:', error)
        toast.error("Erreur lors de l'envoi de la demande")
      })
  }

  const deleteDemand = (demandId) => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/shared/desanonym/` + demandId, {
      method: 'Delete',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': sessionStorage.getItem('token')
      }
    })
      .then(response => {
        if (response.status === 401) {
          disconnect()
        } else if (response.status === 200) {
          toast.success('La demande de désanonymisation supprimée.')
          getDesanonym()
        } else {
          toast.error('Erreur serveur.')
        }
        return response
      })
      .catch(error => /* istanbul ignore next */ {
        console.error('Network or unexpected error:', error)
        toast.error('Erreur lors de la suppression de la demande.')
      })
  }

  const handleCloseFeelingPopup = () => {
    console.log(shownFeeling)
    setIsShown(!isShown)
  }

  const handleShowFeeling = (feelingId) => {
    const feeling = feelings.find(item => item._id === feelingId)
    setShownFeeling(feeling)
    setShownUser(feeling.user)
    handleCloseFeelingPopup()
  }

  return (
    <div>
      <div id='grey-filter' />
      <div>
        <HeaderComp
          title='Ressentis des Étudiants'
          withLogo
          showButtons={false}
        />
      </div>
      <div className='feelings-page'>
        <Popup open={isShown} onClose={handleCloseFeelingPopup} modal>
          {(close) => (
            <div className='popup-modal-container' style={{ alignItems: 'inherit' }}>
              <button className='close-btn' onClick={close}><img src={cross} alt='Close' /></button>
              <div key={`${shownFeeling._id}-shown`} style={{ marginBottom: '0', width: '95%' }} className='individual-feelings-container'>
                <div className='publication-date'>{moment(shownFeeling.date).format('DD/MM/YYYY')}</div>
                <div className='horizontal-line' />
                <div className='feelings-container-content' style={{ width: '100%' }}>
                  <div className='container-sidebar' style={{ width: '45%' }}>
                    <div className='emoticone-container'>
                      <img className='emoticone-image' style={{ height: '50px' }} src={imagePaths[shownFeeling.mood]} alt={moods[shownFeeling.mood]} />
                      <span className='emoticone-feeling'>{emotions[moods[shownFeeling.mood]]}</span>
                    </div>
                    <div className='review-status'>
                      <p style={{ marginBottom: '0' }}>{shownFeeling.date !== '' ? 'Pris en compte le:' : 'En attente de prise en compte'}</p>
                      <p style={{ marginTop: '0' }}>{shownFeeling.date !== '' ? `${moment(shownFeeling.date).format('DD/MM/YYYY')}` : ''}</p>
                    </div>
                    <div className='publication-author' style={{ alignItems: 'center', display: 'flex', gap: '5px' }}>{(shownFeeling.annonymous && shownUser !== null) ? 'Anonyme' : `${shownUser.firstname} ${shownUser.lastname}`}</div>
                  </div>
                  <div className='feelings-content' style={{ width: '100%' }}>
                    <p className='paragraph-style'>{shownFeeling.comment}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Popup>
        <div className='demands-container'>
          <h3 style={{ paddingLeft: '15px' }}>Vos demandes de désanonymisation</h3>
          <div className='demand-container-content'>
            {
                demands.length !== 0
                  ? (
                      demands.map((dem) => (
                        <div title={dem.status === 'refused' ? 'Refus de la demande' : dem.status === 'accepted' ? 'Ressenti désanonymisé' : 'En attente d\'un retour'} onClick={() => handleShowFeeling(dem.reason)} className={`demand-container ${dem.status === 'refused' ? 'red-filler' : dem.status === 'accepted' ? 'green-filler' : 'orange-filler'}`} key={`demand-${dem._id}`}>
                          <div className='demand-content'>
                            <img className='emoticone-image' style={{ height: '25px' }} src={imagePaths[dem.mood.mood]} alt={moods[dem.mood.mood]} />
                            <p>{dem.mood.comment}</p>
                          </div>
                          <button className='demand-close-btn' onClick={(e) => { e.stopPropagation(); deleteDemand(dem._id) }}><img className='close-img' src={closeBlack} alt='DeleteDemand' /></button>
                        </div>
                      ))
                    )
                  : (
                    <p>Aucune demande en cours</p>
                    )
              }
          </div>
        </div>
        <div id='feelings-container'>
          {feelings.length !== 0 && feelings.map((feeling) => (
            <div key={`${feeling._id}-feeling`} className='individual-feelings-container'>
              <div className='publication-date'>{moment(feeling.date).format('DD/MM/YYYY')}</div>
              <div className='horizontal-line' />
              <div className='feelings-container-content'>
                <div className='container-sidebar'>
                  <div className='emoticone-container'>
                    <img className='emoticone-image' style={{ height: '50px' }} src={imagePaths[feeling.mood]} alt={moods[feeling.mood]} />
                    <span className='emoticone-feeling'>{emotions[moods[feeling.mood]]}</span>
                  </div>
                  <div className='review-status'>
                    <p style={{ marginBottom: '0' }}>{feeling.date !== '' ? 'Pris en compte le:' : 'En attente de prise en compte'}</p>
                    <p style={{ marginTop: '0' }}>{feeling.date !== '' ? `${moment(feeling.date).format('DD/MM/YYYY')}` : ''}</p>
                  </div>
                  <div className='publication-author' style={{ alignItems: 'center', display: 'flex', gap: '5px' }}>{feeling.annonymous ? (<>Anonyme <img style={{ height: '15px', cursor: 'pointer' }} onClick={() => handleDemandPopup(feeling.user._id, feeling._id)} src={questionIcon} alt='Demander à désanonymiser' title='Faire une demande de désanonymisation' /> </>) : `${feeling.user.firstname} ${feeling.user.lastname}`}</div>
                </div>
                <div className='feelings-content'>
                  <p className='paragraph-style'>{feeling.comment}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FeelingsAdminPage
