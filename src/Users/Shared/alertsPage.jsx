import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ShowAlerts from '../../Components/Alerts/showAlerts';
import HeaderComp from '../../Components/Header/headerComp';
import Popup from 'reactjs-popup';
import moment from 'moment';
import '../../css/Components/Popup/popup.scss';
import '../../css/pages/createAlerts.scss';
import cross from '../../assets/Cross.png';
import rightArrowInverted from '../../assets/right-arrow-inverted.png';
import UserProfile from '../../Components/userProfile/userProfile';
import AlertCreationPopupContent from '../../Components/Popup/alertCreation';
import { disconnect } from '../../functions/disconnect';

const AlertsPage = () => {
  const roleProfile = sessionStorage.getItem('role');
  const [isOpen, setIsOpen] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [chosenAlert, setChosenAlert] = useState({});
  const { id } = useParams();

  const fetchAlerts = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/shared/alert/`, {
        method: 'GET',
        headers: {
          'x-auth-token': sessionStorage.getItem('token'),
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401) {
        disconnect();
        return;
      }

      if (response.status !== 200) {
        throw new Error('Erreur lors de la réception des alertes.');
      }

      const data = await response.json();
      const alertList = await buildList(data);
      const groupedData = {};

      alertList.forEach((item) => {
        const parts = item.createdAt.split('/');
        const createdAt = new Date(parts[2], parts[1] - 1, parts[0]);
        const date = createdAt.toLocaleDateString('fr-FR');

        if (!groupedData[date]) {
          groupedData[date] = [];
        }

        groupedData[date].push(item);
      });

      setAlerts(groupedData);

      if (id !== undefined) {
        const csnAlert = Object.values(groupedData).flat().find((alert) => alert.id === id);
        setChosenAlert(csnAlert);
      }
    } catch (error) {
      console.error('Erreur : ', error.message);
    }
  };

  const buildList = async (dataList) => {
    const alertList = [];
    if (dataList && dataList.length > 0) {
      for (const data of dataList) {
        let fileUrl = '';
        if (data.file) {
          fileUrl = await getFile(data.file);
        }
        const showAlert = {
          id: data._id,
          title: data.title,
          message: data.message,
          file: fileUrl,
          createdBy: data.createdBy,
          createdAt: moment(data.createdAt).format('DD/MM/YYYY'),
        };
        alertList.push(showAlert);
      }
    }
    return alertList;
  };

  const getFile = async (fileID) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/file/${fileID}`, {
        method: 'GET',
        headers: {
          'x-auth-token': sessionStorage.getItem('token'),
        },
      });

      if (response.status === 401) {
        disconnect();
      }

      if (response.status !== 200) {
        throw new Error('Erreur lors de la réception du fichier.');
      } else {
        const blob = await response.blob();
        const objectURL = URL.createObjectURL(blob);
        return objectURL;
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleEditAlert = (alert) => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/shared/alert/${alert.id}`, {
      method: 'PATCH',
      headers: {
        'x-auth-token': sessionStorage.getItem('token'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: alert.title,
        message: alert.message,
      }),
    })
      .then((response) => {
        if (response.ok) {
          fetchAlerts(); // Rafraîchir la liste des alertes après modification
        } else {
          console.error('Erreur lors de la mise à jour');
        }
      })
      .catch((error) => console.error('Erreur : ', error));
  };

  const handleDeleteAlert = (alertId) => {
    const confirmDelete = window.confirm('Êtes-vous sûr de vouloir supprimer cette alerte ?');
    if (confirmDelete) {
      fetch(`${process.env.REACT_APP_BACKEND_URL}/shared/alert/${alertId}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': sessionStorage.getItem('token'),
        },
      })
        .then((response) => {
          if (response.ok) {
            fetchAlerts(); // Rafraîchir la liste des alertes après suppression
          } else {
            console.error('Erreur lors de la suppression');
          }
        })
        .catch((error) => console.error('Erreur : ', error));
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, [id]);

  const getChosenAlert = (alertId) => {
    const csnAlert = Object.values(alerts).flat().find((alert) => alert.id === alertId);
    setChosenAlert(csnAlert);
    if (id === undefined) { window.location.href = '/alerts/' + alertId }
  };

  const returnToAlertList = () => {
    window.location.href = '/alerts/';
  };

  const handleNewAlert = () => {
    setIsOpen(!isOpen);
  };

  const buttonComponent = [
    {
      name: 'Créer une alerte',
      handleFunction: handleNewAlert,
    },
  ];

  return (
    <div>
      <div>
        <HeaderComp
          title='Mes Alertes'
          withLogo
          withReturnBtn={!!id}
          returnCall={returnToAlertList}
          showButtons={roleProfile !== 'student'}
          buttonComponent={buttonComponent}
        />
      </div>
      <div className='alert-page' style={{ marginLeft: '25px' }}>
        <Popup open={isOpen} onClose={() => setIsOpen(false)} modal>
          {(close) => (
            <div className='popup-modal-container'>
              <button className='close-btn' onClick={close}><img data-testid='close-img' src={cross} alt='Close' /></button>
              <AlertCreationPopupContent />
            </div>
          )}
        </Popup>
        {
          id === undefined
            ? Object.entries(alerts).map(([day, items]) => (
              <div className='alert-page-container' key={day}>
                <div className='breakline' />
                <h2 className='day-title'>{day}</h2>
                <div className='day-container'>
                  {items.map((alert) => (
                    <div key={alert.id} className='alert-container'>
                      <div className='content'>
                        <div className='header'>
                          <UserProfile profile={alert.createdBy} />
                          <button data-testid={alert.id} id={alert.id} key={alert.id} onClick={() => getChosenAlert(alert.id)} className='see-more-inverted'>
                            Voir plus
                            <img className='img' src={rightArrowInverted} alt='Right arrow' />
                          </button>
                        </div>
                        <div className='body'>
                          {alert.message}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
            : <ShowAlerts chosenAlert={chosenAlert} onEditAlert={handleEditAlert} onDeleteAlert={handleDeleteAlert} />
        }
      </div>
    </div>
  );
};

export default AlertsPage;
