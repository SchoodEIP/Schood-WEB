import React, {useState} from 'react'
import CreateAlerts from '../../Components/Alerts/createAlerts'
import ShowAlerts from '../../Components/Alerts/showAlerts'
import HeaderComp from '../../Components/Header/headerComp'
import '../../css/pages/createAlerts.scss'

const CreateAlertsPage = () => {
  const role = sessionStorage.getItem('role')
  const [position, setPosition] = useState(0)

  const upPosition = () => {
    setPosition(position + 1);
  };

  const minusPosition = () => {
    setPosition(position - 1);
  };

  const handleNewAlert = () => {
    console.log('nouvelle alerte, appeler popup ici')
  }

  const buttonComponent = [
    {
      name: "Créer une alerte",
      function: handleNewAlert
    }
  ]

  return (
    <div>
      <div>
        <HeaderComp
          title={"Mes Alertes"}
          withLogo={true}
          withReturnBtn={position > 0 ? true : false}
          position={position}
          returnCall={minusPosition}
          showButtons={role !== 'students' ? true : false}
          buttonComponent={buttonComponent}
        />
      </div>
      <div style={{marginLeft: "25px"}}>
        <ShowAlerts position={position} upPosition={upPosition} />
        {/* {
          role === 'student' ? '' : <CreateAlerts />
        } */}
      </div>
    </div>
  )
}

export default CreateAlertsPage
