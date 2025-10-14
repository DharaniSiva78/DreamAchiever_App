import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  BarElement
} from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  BarElement
)

const SimulationResults = ({ results, goalType, loading }) => {
  if (!results || !results.results) return null

  const simulationResults = results.results

  const getGoalTypeConfig = () => {
    const configs = {
      FINANCIAL: {
        primaryColor: 'rgb(59, 130, 246)',
        gradient: 'rgba(59, 130, 246, 0.1)',
        symbol: '💰',
        unit: '$'
      },
      HEALTH: {
        primaryColor: 'rgb(16, 185, 129)',
        gradient: 'rgba(16, 185, 129, 0.1)',
        symbol: '⚖️',
        unit: 'lbs'
      },
      FITNESS: {
        primaryColor: 'rgb(245, 158, 11)',
        gradient: 'rgba(245, 158, 11, 0.1)',
        symbol: '💪',
        unit: 'level'
      },
      CAREER: {
        primaryColor: 'rgb(139, 92, 246)',
        gradient: 'rgba(139, 92, 246, 0.1)',
        symbol: '💼',
        unit: '$'
      },
      PERSONAL_DEVELOPMENT: {
        primaryColor: 'rgb(236, 72, 153)',
        gradient: 'rgba(236, 72, 153, 0.1)',
        symbol: '🚀',
        unit: 'points'
      },
      EDUCATION: {
        primaryColor: 'rgb(14, 165, 233)',
        gradient: 'rgba(14, 165, 233, 0.1)',
        symbol: '🎓',
        unit: 'GPA'
      }
    }
    return configs[goalType] || configs.FINANCIAL
  }

  const getChartData = () => {
    const progressData = simulationResults.progressData || []
    const config = getGoalTypeConfig()

    switch (goalType) {
      case 'FINANCIAL':
        return {
          labels: progressData.map(item => `Year ${Math.ceil(item.month / 12)}`).filter((_, i) => i % 12 === 0),
          datasets: [
            {
              label: 'Investment Growth',
              data: progressData.filter((_, i) => i % 12 === 0).map(item => item.balance),
              borderColor: config.primaryColor,
              backgroundColor: config.gradient,
              fill: true,
              tension: 0.4,
              pointBackgroundColor: config.primaryColor,
              pointBorderColor: '#fff',
              pointBorderWidth: 2
            }
          ]
        }
      case 'HEALTH':
        return {
          labels: progressData.map(item => `Week ${item.week}`).filter((_, i) => i % 4 === 0),
          datasets: [
            {
              label: 'Weight Progress',
              data: progressData.filter((_, i) => i % 4 === 0).map(item => item.weight),
              borderColor: config.primaryColor,
              backgroundColor: config.gradient,
              fill: true,
              tension: 0.4
            }
          ]
        }
      case 'FITNESS':
        return {
          labels: progressData.map(item => `Week ${item.week}`),
          datasets: [
            {
              label: 'Fitness Level',
              data: progressData.map(item => item.fitnessLevel),
              borderColor: config.primaryColor,
              backgroundColor: config.gradient,
              fill: true,
              tension: 0.4
            }
          ]
        }
      case 'CAREER':
        return {
          labels: progressData.map(item => `Year ${item.year}`),
          datasets: [
            {
              label: 'Salary Growth',
              data: progressData.map(item => item.salary),
              borderColor: config.primaryColor,
              backgroundColor: config.gradient,
              fill: true,
              tension: 0.4
            }
          ]
        }
      case 'PERSONAL_DEVELOPMENT':
        return {
          labels: progressData.map(item => `Week ${item.week}`),
          datasets: [
            {
              label: 'Skill Level',
              data: progressData.map(item => item.skillLevel),
              borderColor: config.primaryColor,
              backgroundColor: config.gradient,
              fill: true,
              tension: 0.4
            }
          ]
        }
      case 'EDUCATION':
        return {
          labels: progressData.map(item => `Week ${item.week}`),
          datasets: [
            {
              label: 'GPA Progress',
              data: progressData.map(item => item.gpa),
              borderColor: config.primaryColor,
              backgroundColor: config.gradient,
              fill: true,
              tension: 0.4
            }
          ]
        }
      default:
        return { labels: [], datasets: [] }
    }
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Progress Simulation',
        font: {
          size: 16,
          weight: 'bold'
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      }
    }
  }

  const getMetricDisplay = (metric) => {
    const config = getGoalTypeConfig()
    
    if (typeof metric === 'string' && metric.includes('$')) {
      return metric
    }
    
    if (typeof metric === 'number') {
      if (goalType === 'FINANCIAL' || goalType === 'CAREER') {
        return `$${metric.toLocaleString()}`
      } else if (goalType === 'HEALTH') {
        return `${metric} lbs`
      } else if (goalType === 'FITNESS' || goalType === 'PERSONAL_DEVELOPMENT') {
        return `${metric}/10`
      } else if (goalType === 'EDUCATION') {
        return metric.toFixed(1)
      }
    }
    
    return metric
  }

  const getStatusColor = (success) => {
    return success ? 'bg-green-100 border-green-500 text-green-800' : 'bg-yellow-100 border-yellow-500 text-yellow-800'
  }

  const keyMetrics = simulationResults.metrics ? Object.entries(simulationResults.metrics) : []

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900">Simulation Results</h3>
        <div className={`px-4 py-2 rounded-full border-2 ${getStatusColor(simulationResults.success)} font-semibold`}>
          {simulationResults.success ? '🎯 Goal Achievable' : '⚠️ Needs Adjustment'}
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {keyMetrics.map(([label, value], index) => (
              <div
                key={label}
                className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 hover:shadow-md transition-shadow"
              >
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {getMetricDisplay(value)}
                </div>
                <div className="text-sm text-gray-600 font-medium">{label}</div>
              </div>
            ))}
          </div>

          {simulationResults.progressData && simulationResults.progressData.length > 0 && (
            <div className="mt-8 p-4 bg-gray-50 rounded-xl">
              <Line data={getChartData()} options={chartOptions} height={80} />
            </div>
          )}

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-3">Simulation Summary</h4>
            <div className="text-sm text-gray-600 space-y-2">
              <p>• Based on your current parameters, this goal is <strong>{simulationResults.success ? 'achievable' : 'challenging'}</strong></p>
              <p>• Expected completion: <strong>{simulationResults.completionDate ? new Date(simulationResults.completionDate).toLocaleDateString() : 'N/A'}</strong></p>
              <p>• Regular progress tracking is recommended for best results</p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default SimulationResults