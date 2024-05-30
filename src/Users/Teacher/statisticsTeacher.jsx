import React, { useState, useEffect } from 'react'
import HeaderComp from '../../Components/Header/headerComp'
import Chart from 'chart.js/auto'
import '../../css/pages/homePage.scss'
import '../../css/pages/statistiques.scss'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSadTear, faFrown, faMeh, faSmile, faLaughBeam } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { disconnect } from '../../functions/disconnect'

library.add(faSadTear, faFrown, faMeh, faSmile, faLaughBeam)

const TeacherStatPage = () => {
  const [moodData, setMoodData] = useState([])
  const [answerData, setAnswerData] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [activeFilter, setActiveFilter] = useState('Semaine')
  const [selectedClass, setSelectedClass] = useState(null)
  const [answerChart, setAnswerChart] = useState(null)
  const [classes, setClasses] = useState([])
  const [averageMood, setAverageMood] = useState(0)
  const [averagePercentage, setAveragePercentage] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      const moodUrl = process.env.REACT_APP_BACKEND_URL + '/shared/statistics/dailyMoods'
      const answersUrl = process.env.REACT_APP_BACKEND_URL + '/shared/statistics/answers'
      try {
        const [moodResponse, answersResponse] = await Promise.all([
          fetch(moodUrl, {
            method: 'POST',
            headers: {
              'x-auth-token': sessionStorage.getItem('token'),
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              fromDate: calculateStartDate(selectedDate, activeFilter),
              toDate: calculateEndDate(selectedDate, activeFilter),
              classFilter: selectedClass || 'all'
            })
          }),
          fetch(answersUrl, {
            method: 'POST',
            headers: {
              'x-auth-token': sessionStorage.getItem('token'),
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              fromDate: calculateStartDate(selectedDate, activeFilter),
              toDate: calculateEndDate(selectedDate, activeFilter),
              classFilter: selectedClass || 'all'
            })
          })
        ])
        if (moodResponse.status === 401) {
          disconnect()
        } else if (answersResponse.status === 401) {
          disconnect()
        }
        const mData = await moodResponse.json()
        const aData = await answersResponse.json()

        if (mData.averagePercentage !== undefined) {
          setAveragePercentage(mData.averagePercentage)
        }
        const answerList = []
        Object.keys(aData).forEach(date => {
          answerList.push({
            date,
            data: aData[date]
          })
        })

        const moodList = []
        Object.keys(mData).forEach(date => {
          moodList.push({
            date,
            data: mData[date].moods
          })
        })

        setMoodData(moodList)
        setAnswerData(answerList)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    const fetchClasses = async () => {
      const classesUrl = process.env.REACT_APP_BACKEND_URL + '/shared/classes'
      try {
        const response = await fetch(classesUrl, {
          method: 'GET',
          headers: {
            'x-auth-token': sessionStorage.getItem('token'),
            'Content-Type': 'application/json'
          }
        })
        if (response.status === 401) {
          disconnect()
        }
        const classesData = await response.json()
        setClasses(classesData)
      } catch (error) {
        console.error('Error fetching classes:', error)
      }
    }

    fetchData()
    fetchClasses()
  }, [selectedDate, activeFilter, selectedClass])

  useEffect(() => {
    const average = calculateAverageMood(moodData, averagePercentage)
    setAverageMood(average)
  }, [moodData, averagePercentage])

  const calculateAverageMood = (data, averagePercentage) => {
    let total = 0
    let count = 0
    for (const key in data) {
      if (key !== 'averagePercentage') {
        total += data[key]
        count++
      }
    }
    if (count === 0) return 0
    if (averagePercentage !== undefined) {
      return averagePercentage
    }
    return total / count
  }

  const calculateStartDate = (date, filter) => {
    const selectedDate = new Date(date)
    switch (filter) {
      case 'Semaine':{
        const selectedDayOfWeek = selectedDate.getDay()
        const monday = new Date(selectedDate)
        monday.setDate(monday.getDate() - selectedDayOfWeek + (selectedDayOfWeek === 0 ? -6 : 1))
        return monday.toISOString().split('T')[0]
      }
      case 'Mois':{
        return new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1).toISOString().split('T')[0]
      }
      case 'Semestre':{
        const semesterStartMonth = selectedDate.getMonth() < 8 ? 0 : 8
        return new Date(selectedDate.getFullYear(), semesterStartMonth, 1).toISOString().split('T')[0]
      }
      case 'Année':{
        return new Date(selectedDate.getFullYear(), 0, 1).toISOString().split('T')[0]
      }
      default:{
        return selectedDate.toISOString().split('T')[0]
      }
    }
  }

  const calculateEndDate = (date, filter) => {
    const selectedDate = new Date(date)
    switch (filter) {
      case 'Semaine':{
        const sunday = new Date(selectedDate)
        sunday.setDate(sunday.getDate() - selectedDate.getDay() + 7)
        return sunday.toISOString().split('T')[0]
      }
      case 'Mois':{
        const nextMonth = new Date(selectedDate)
        nextMonth.setMonth(nextMonth.getMonth() + 1)
        nextMonth.setDate(nextMonth.getDate() - 1)
        return nextMonth.toISOString().split('T')[0]
      }
      case 'Semestre':{
        const semesterEndMonth = selectedDate.getMonth() < 8 ? 6 : 11
        const endMonth = new Date(selectedDate.getFullYear(), semesterEndMonth + 1, 0)
        return endMonth.toISOString().split('T')[0]
      }
      case 'Année':{
        return new Date(selectedDate.getFullYear(), 11, 31).toISOString().split('T')[0]
      }
      default:{
        return selectedDate.toISOString().split('T')[0]
      }
    }
  }

  useEffect(() => {
    const ctx = document.getElementById('moodChart').getContext('2d')
    let newChart = null

    const createOrUpdateChart = () => {
      if (newChart && typeof newChart.destroy === 'function') {
        newChart.destroy()
      }

      newChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: Object.keys(moodData).filter(key => key !== 'averagePercentage'),
          datasets: [{
            label: 'Humeur',
            data: Object.values(moodData).filter(val => typeof val === 'number'),
            borderColor: 'white',
            pointBackgroundColor: 'white',
            pointBorderColor: 'white',
            pointHoverBackgroundColor: 'white',
            pointHoverBorderColor: 'white',
            tension: 0.1
          }]
        },
        options: {
          scales: {
            x: {
              ticks: {
                color: 'white',
                fontFamily: '"Font Awesome 5 Free"'
              },
              grid: {
                color: 'rgba(255, 255, 255, 0.1)'
              }
            },
            y: {
              min: 0,
              max: 4,
              ticks: {
                callback: value => {
                  switch (value) {
                    case 0:
                      return '\u{1F622}'
                    case 1:
                      return '\u{1f641}'
                    case 2:
                      return '\u{1F610}'
                    case 3:
                      return '\u{1F603}'
                    case 4:
                      return '\u{1F604}'
                    default:
                      return ''
                  }
                },
                color: 'white',
                fontFamily: '"Font Awesome 5 Free"'
              },
              grid: {
                color: 'rgba(255, 255, 255, 0.1)'
              }
            }
          },
          plugins: {
            legend: {
              labels: {
                color: 'white'
              }
            }
          }
        }
      })

      if (moodData.length > 1) {
        const listData = []
        let labels = []

        Object.entries(moodData)
          .filter(([_, val]) => Array.isArray(val.data) && val.data.length > 0)
          .forEach(([_, val]) => listData.push(calculateAverageMood(val.data)))

        for (const data of moodData) {
          if (data.date !== 'averagePercentage') labels.push(data.date)
        }
        labels = labels.sort((a, b) => {
          const aa = a.split('-')
          const bb = b.split('-')
          return aa < bb ? -1 : (aa > bb ? 1 : 0)
        })

        if (newChart.data !== undefined) {
          newChart.data.datasets[0].data = listData
          newChart.data.labels = labels
          newChart.options.scales.x.labels = labels

          newChart.update()
        }
      }
    }

    createOrUpdateChart()

    return () => {
      if (newChart && typeof newChart.destroy === 'function') {
        newChart.destroy()
      }
    }
  }, [moodData, selectedClass])

  useEffect(() => {
    const createAnswerChart = () => {
      if (answerChart && typeof answerChart.destroy === 'function') {
        answerChart.destroy()
      }
      const ctx = document.getElementById('answerChart')
      const newChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: answerData.map(answer => answer.date),
          datasets: [{
            label: 'Réponses',
            data: answerData.map(answer => answer.data),
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            borderColor: 'rgba(255, 255, 255, 1)',
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          },
          plugins: {
            legend: {
              labels: {
                color: 'white'
              }
            }
          }
        }
      })

      setAnswerChart(newChart)
    }

    createAnswerChart()
    return () => {
      if (answerChart && typeof answerChart.destroy === 'function') {
        answerChart.destroy()
      }
    }
  }, [answerData, selectedClass])

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value)
  }

  const handleFilterChange = (filter) => {
    setActiveFilter(filter)
  }

  const handleClassChange = (event) => {
    setSelectedClass(event.target.value)
  }

  return (
    <div className='dashboard'>
      <HeaderComp title='Mes statistiques' />
      <div className='page-content'>
        <div>
          <label htmlFor='dateFilter'>Sélectionner une date:</label>
          <input type='date' id='dateFilter' value={selectedDate} onChange={handleDateChange} />
          <div className='button-container'>
            <div className={`button-section ${activeFilter === 'Semaine' ? 'active' : ''}`} onClick={() => handleFilterChange('Semaine')}>
              Semaine
            </div>
            <div className={`button-section ${activeFilter === 'Mois' ? 'active' : ''}`} onClick={() => handleFilterChange('Mois')}>
              Mois
            </div>
            <div className={`button-section ${activeFilter === 'Semestre' ? 'active' : ''}`} onClick={() => handleFilterChange('Semestre')}>
              Semestre
            </div>
            <div className={`button-section ${activeFilter === 'Année' ? 'active' : ''}`} onClick={() => handleFilterChange('Année')}>
              Année
            </div>
          </div>
          <label htmlFor='classFilter'>Filtrer par classe:</label>
          <select id='classFilter' value={selectedClass || ''} onChange={handleClassChange}>
            <option key='all' value=''>Toutes les classes</option>
            {classes.map((classItem) => (
              <option key={classItem._id} value={classItem._id}>{classItem.name}</option>
            ))}
          </select>
          <h1>Evolution de l'humeur</h1>
          <canvas id='moodChart' width='400' height='400' />
          <div style={{ width: '200px', margin: 'auto', marginTop: '20px' }}>
            <FontAwesomeIcon icon={faSmile} size='2x' style={{ marginRight: '10px' }} />
            <progress className='progress' value={averageMood} max='100' />
          </div>
          <h1>Problèmes</h1>
          <canvas id='answerChart' width='400' height='400' />
        </div>
      </div>
    </div>
  )
}

export default TeacherStatPage
