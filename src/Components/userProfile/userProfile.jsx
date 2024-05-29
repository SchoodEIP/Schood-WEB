import React from 'react'
import '../../css/Components/userProfile/userProfile.scss'
import userIcon from '../../assets/userIcon.png'

export function UserProfile ({ profile, fullname = false, whiteMode = false }) {
  return (
    <div className='profile'>
      <img className='img' src={profile?.picture ? profile.picture : userIcon} alt='user icon' />
      <div className='profile-content'>
        {
          fullname && (
            <span className={[whiteMode ? 'lastname-white' : 'lastname']}>{profile?.firstname && profile?.lastname ? profile.firstname + ' ' + profile.lastname : ''}</span>
          )
        }
        {
          !fullname && (
            <span className={[whiteMode ? 'lastname-white' : 'lastname']}>{profile?.lastname ? 'M. ' + profile.lastname : ''}</span>
          )
        }
        {
          profile?.title?.name && (
            <span className={[whiteMode ? 'title-white' : 'title']}>{profile?.title?.name ? profile.title.name : ''}</span>
          )
        }
      </div>
    </div>
  )
}

export default UserProfile
