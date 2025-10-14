import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { goalService } from '../../services/api'
import SimulationEngine from '../simulations/SimulationEngine'
import LoadingSpinner from '../common/LoadingSpinner'

const GoalDetails = () => {
  const { id } = useParams()
  const [goal, setGoal] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('details')

  useEffect(() => {
    fetchGoal()
  }, [id])

  const fetchGoal = async () => {
    try {
      const response = await goalService.getGoalById(id)
      setGoal(response.data)
    } catch (error) {
      console.error('Error fetching goal:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  if (!goal) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-800">Goal not found</h1>
      </div>
    )
  }

  const progress = ((goal.currentValue || 0) / goal.targetValue) * 100
  const progressPercentage = Math.min(100, Math.max(0, progress))

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{goal.title}</h1>
            <p className="text-gray-600 mt-2">{goal.description}</p>
          </div>
          <div className="flex space-x-4">
            <motion.button
              onClick={() => window.location.href = '/dashboard'}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 border-2 border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Back to Dashboard
            </motion.button>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Overall Progress</span>
            <span>{progressPercentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <motion.div 
              className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
          <div className="card p-4 text-center bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
            <div className="text-2xl font-bold text-blue-600">
              ${goal.targetValue?.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Target</div>
          </div>
          <div className="card p-4 text-center bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
            <div className="text-2xl font-bold text-green-600">
              ${goal.currentValue?.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Current</div>
          </div>
          <div className="card p-4 text-center bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
            <div className="text-2xl font-bold text-purple-600 capitalize">
              {goal.type.toLowerCase().replace('_', ' ')}
            </div>
            <div className="text-sm text-gray-600">Type</div>
          </div>
          <div className="card p-4 text-center bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200">
            <div className="text-2xl font-bold text-orange-600 capitalize">
              {goal.progressType?.toLowerCase()}
            </div>
            <div className="text-sm text-gray-600">Progress Type</div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('details')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'details'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Goal Details
          </button>
          <button
            onClick={() => setActiveTab('simulation')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'simulation'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Simulation
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'details' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card p-6"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4">Goal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Start Date</label>
              <p className="text-gray-800">{goal.startDate || 'Not set'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Target Date</label>
              <p className="text-gray-800">{goal.targetDate || 'Not set'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Status</label>
              <p className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                goal.status === 'COMPLETED' 
                  ? 'bg-green-100 text-green-800'
                  : goal.status === 'ACTIVE'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {goal.status}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Last Updated</label>
              <p className="text-gray-800">
                {goal.lastProgressUpdate ? new Date(goal.lastProgressUpdate).toLocaleDateString() : 'Never'}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === 'simulation' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <SimulationEngine goal={goal} />
        </motion.div>
      )}
    </div>
  )
}

export default GoalDetails