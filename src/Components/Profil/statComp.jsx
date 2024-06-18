import React, {useEffect, useState} from "react";
import { disconnect } from "../../functions/disconnect";
import '../../css/pages/profilPage.scss'

export default function StatComp({id}) {
    const [questionnaires, setQuestionnaires] = useState([])

    useEffect(() => {
        const fetchForms = async () => {
            try {
              const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/shared/questionnaire/?id=` + id, {
                method: 'GET',
                headers: {
                  'x-auth-token': sessionStorage.getItem('token'),
                  'Content-Type': 'application/json'
                }
              })
              if (response.status === 401) {
                disconnect()
              }

              if (!response.ok) /* istanbul ignore next */ {
                throw new Error(`HTTP error! Status: ${response.status}`)
              }

              const data = await response.json()
              setQuestionnaires(data)
              console.log(data)
            } catch (error) /* istanbul ignore next */ {
              console.error('Erreur lors de la récupération du profil', error.message)
            }
          }

          fetchForms()
    }, [])

    return (
        <div>
            <p>stat id = {id}</p>
        </div>
    )
}