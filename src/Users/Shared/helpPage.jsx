import '../../css/pages/homePage.scss'
import HeaderComp from '../../Components/Header/headerComp'
import AidePage from '../../Components/Aides/aides'
import React, {useState} from 'react'

const HelpPage = () => {
  const [position, setPosition] = useState(0)

  const upPosition = () => {
    setPosition(position + 1);
  };

  const minusPosition = () => {
    setPosition(position - 1);
  };

  return (
    <div className='dashboard'>
      <div>
        <HeaderComp
          title="Mes Aides"
          withLogo={true}
          withReturnBtn={position > 0 ? true : false}
          position={position}
          returnCall={minusPosition}
        />
      </div>
      <div className='help-page' style={{marginLeft: "25px", marginRight: "25px", overflowY: "auto"}}>
        <AidePage upPosition={upPosition} position={position}/>
      </div>
    </div>
  )
}

export default HelpPage
