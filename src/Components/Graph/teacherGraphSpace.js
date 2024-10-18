import React, { useEffect, useState, useRef } from 'react'
import '../../css/Components/Graph/graphSpace.scss'
import Chart from 'chart.js/auto'
import { disconnect } from '../../functions/disconnect'
import { Link } from 'react-router-dom'
import rightArrow from '../../assets/right-arrow.png'
import { LineController, LineElement, PointElement, LinearScale, Title, CategoryScale } from 'chart.js'
import '../../css/pages/homePage.scss'
import '../../css/pages/statistiques.scss'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSadTear, faFrown, faMeh, faSmile, faLaughBeam } from '@fortawesome/free-solid-svg-icons'

library.add(faSadTear, faFrown, faMeh, faSmile, faLaughBeam)

Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale)

export function TeacherGraphSpace () {
  const [moodData, setMoodData] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [activeFilter, setActiveFilter] = useState('Semaine')
  const [selectedClass, setSelectedClass] = useState(null)

  const moodChartRef = useRef(null)

  useEffect(() => {
    const fetchData = async () => {
      const moodUrl = `${process.env.REACT_APP_BACKEND_URL}/shared/statistics/dailyMoods`
      try {
        const response = await fetch(moodUrl, {
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
        if (response.status === 401) {
          disconnect()
        }
        const mData = await response.json()
        const moodList = []
        Object.keys(mData).filter(o => o != "averagePercentage").forEach((date) => {
          moodList.push({
            date,
            data: mData[date].moods
          })
        })
        setMoodData(moodList)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [selectedDate, activeFilter, selectedClass])

  const calculateAverageMood = (data) => {
    let total = 0
    let count = 0
    data.forEach((item) => {
      if (Array.isArray(item.data)) {
        total += item.data.reduce((sum, mood) => sum + mood, 0)
        count += item.data.length
      }
    })
    return count === 0 ? 0 : total / count
  }

  const calculateStartDate = (date, filter) => {
    const selectedDate = new Date(date)
    switch (filter) {
      case 'Semaine': {
        const selectedDayOfWeek = selectedDate.getDay()
        const monday = new Date(selectedDate)
        monday.setDate(monday.getDate() - selectedDayOfWeek + (selectedDayOfWeek === 0 ? -6 : 1))
        return monday.toISOString().split('T')[0]
      }
      case 'Mois': {
        return new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1).toISOString().split('T')[0]
      }
      case 'Semestre': {
        const semesterStartMonth = selectedDate.getMonth() < 8 ? 0 : 8
        return new Date(selectedDate.getFullYear(), semesterStartMonth, 1).toISOString().split('T')[0]
      }
      case 'Année': {
        return new Date(selectedDate.getFullYear(), 0, 1).toISOString().split('T')[0]
      }
      default: {
        return selectedDate.toISOString().split('T')[0]
      }
    }
  }

  const calculateEndDate = (date, filter) => {
    const selectedDate = new Date(date)
    switch (filter) {
      case 'Semaine': {
        const sunday = new Date(selectedDate)
        sunday.setDate(sunday.getDate() - selectedDate.getDay() + 7)
        return sunday.toISOString().split('T')[0]
      }
      case 'Mois': {
        const nextMonth = new Date(selectedDate)
        nextMonth.setMonth(nextMonth.getMonth() + 1)
        nextMonth.setDate(nextMonth.getDate() - 1)
        return nextMonth.toISOString().split('T')[0]
      }
      case 'Semestre': {
        const semesterEndMonth = selectedDate.getMonth() < 8 ? 6 : 11
        const endMonth = new Date(selectedDate.getFullYear(), semesterEndMonth + 1, 0)
        return endMonth.toISOString().split('T')[0]
      }
      case 'Année': {
        return new Date(selectedDate.getFullYear(), 11, 31).toISOString().split('T')[0]
      }
      default: {
        return selectedDate.toISOString().split('T')[0]
      }
    }
  }

  useEffect(() => {
    const ctx = moodChartRef.current?.getContext('2d')
    if (!ctx) return

    let newChart = null

    const createOrUpdateChart = () => {
      if (newChart && typeof newChart.destroy === 'function') {
        newChart.destroy()
      }

      newChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: moodData.map((mood) => mood.date),
          datasets: [{
            label: 'Humeur',
            data: moodData.map((mood) => calculateAverageMood([mood])),
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
                callback: (value) => {
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
            },
            tooltip: {
              callbacks: {
                title: (tooltipItems) => {
                  return tooltipItems[0].label // Date of the point
                },
                label: (tooltipItem) => {
                  const moodValue = tooltipItem.raw
                  let moodText = ''
                  switch (moodValue) {
                    case 0:
                      moodText = 'Très Triste'
                      break
                    case 1:
                      moodText = 'Triste'
                      break
                    case 2:
                      moodText = 'Neutre'
                      break
                    case 3:
                      moodText = 'Content'
                      break
                    case 4:
                      moodText = 'Très Content'
                      break
                    default:
                      moodText = 'Inconnu'
                  }
                  return `Humeur: ${moodText}`
                }
              }
            }
          }
        }
      })

      // Sort dates
      const labels = moodData.map(mood => mood.date).sort((a, b) => a.localeCompare(b))
      const listData = labels.map(date => {
        const mood = moodData.find(m => m.date === date)
        return mood ? calculateAverageMood([mood]) : 0
      })

      if (newChart.data !== undefined) {
        newChart.data.datasets[0].data = listData
        newChart.data.labels = labels
        newChart.update()
      }
    }

    createOrUpdateChart()

    return () => {
      if (newChart && typeof newChart.destroy === 'function') {
        newChart.destroy()
      }
    }
  }, [moodData])

  return (
    <div className='graph-box'>
      <div className='graph-header'>
        <span className='title'>Evolution de l'humeur de mes classes</span>
        <Link to='/statistiques' className='see-more'>
          Voir plus
          <img className='img' src={rightArrow} alt='Right arrow' />
        </Link>
      </div>
      <div className='graph-body'>
        <div className='graph-content'>
          <div className='chart-container'>
            <canvas id='moodChart' ref={moodChartRef} />
          </div>
        </div>
      </div>
    </div>
  )
}
