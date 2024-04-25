import React, { useEffect } from 'react'
import '../../css/Components/userProfile/userProfile.scss'
import userIcon from '../../assets/userIcon.png'

export function UserProfile ({profile}) {

    useEffect(() => {
        console.log("profile: ", profile)
    })

  return (
    <div className='profile'>
        <img className='img' src={profile?.picture ? profile.picture : userIcon} alt='user icon'/>
        <div className='content'>
            <span className='lastname'>{profile?.lastname ? 'M. ' + profile.lastname : ""}</span>
            <span className='title'>{profile?.title?.name ? profile.title.name : ""}</span>
        </div>
    </div>
  )
}

export default UserProfile
