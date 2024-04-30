import React, { useEffect } from 'react'
import '../../css/Components/userProfile/userProfile.scss'
import userIcon from '../../assets/userIcon.png'

export function UserProfile ({profile, fullname = false}) {
  return (
    <div className='profile'>
        <img className='img' src={profile?.picture ? profile.picture : userIcon} alt='user icon'/>
        <div className='profile-content'>
            {
                fullname && (
                    <span className='lastname'>{profile?.firstname && profile?.lastname ? profile.firstname + " " + profile.lastname : ""}</span>
                )
            }
            {
                !fullname && (
                    <span className='lastname'>{profile?.lastname ? 'M. ' + profile.lastname : ""}</span>
                )
            }
            {
                profile?.title?.name && (
                    <span className='title'>{profile?.title?.name ? profile.title.name : ""}</span>
                )
            }
        </div>
    </div>
  )
}

export default UserProfile
