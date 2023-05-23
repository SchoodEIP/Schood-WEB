import { React } from 'react'
import logoSchood from '../../assets/logo_schood.png'
import childrenLogin from '../../assets/children_login.png'
import './LandingPage.scss'

export default function LandingPage () {
  return (
    <div className='Landing-page'>
      <div id='background-part'>
        <img id='childrenImg' src={childrenLogin} alt='children' />
      </div>
      <div id='landing-part'>
        <img id='schoodLogo' src={logoSchood} alt='Schood' />
        <div>
          <h3 className='sous-titre'>Pour une école plus sûre, une meilleure entente et un plus bel avenir pour les adultes de demain.</h3>
        </div>
        <div>
          <h2>C'est quoi Schood ?</h2>
          <p>C'est un collecteur de ressentis en milieu scolaire.</p>
          <p>Il s'agit d'un questionnaire que les étudiants viennent remplir de manière hebdomadaire, qui
            demande l’émotion globale de la semaine et des questions générales pour cerner un potentiel problème dans
            une catégorie bien précise.
          </p>
        </div>
        <div>
          <h2>Notre Objectif</h2>
          <p>Mettre en place une écoute et une synthèse des ressentis des jeunes de manière hebdomadaire et accessible.</p>
        </div>
        <div>
          <a href='http://localhost:3000/login'>
            <button id='connection-button'>Se connecter</button>
          </a>
        </div>
      </div>
    </div>
  )
}
