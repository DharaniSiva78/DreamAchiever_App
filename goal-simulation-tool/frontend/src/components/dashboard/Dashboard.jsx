import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { goalService } from '../../services/api'
import GoalCard from './GoalCard'
import LoadingSpinner from '../common/LoadingSpinner'
import { motion } from 'framer-motion'

const Dashboard = () => {
  const [goals, setGoals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [completedCount, setCompletedCount] = useState(0)
  const { user } = useAuth()

  useEffect(() => {
    if (user && user.id) {
      fetchGoals()
      fetchCompletedCount()
    } else {
      setLoading(false)
    }
  }, [user])

  const fetchGoals = async () => {
    try {
      const response = await goalService.getUserGoals(user.id)
      // Ensure goals have proper type and values
      const formattedGoals = response.data.map(goal => ({
        ...goal,
        currentValue: parseFloat(goal.currentValue) || 0,
        targetValue: parseFloat(goal.targetValue) || 1,
        progress: calculateGoalProgress(goal)
      }))
      setGoals(formattedGoals)
    } catch (error) {
      console.error('Error fetching goals:', error)
      setError('Failed to load goals. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const fetchCompletedCount = async () => {
    try {
      const response = await goalService.getCompletedGoalsCount(user.id)
      setCompletedCount(response.data)
    } catch (error) {
      console.error('Error fetching completed count:', error)
    }
  }

  const calculateGoalProgress = (goal) => {
    const current = parseFloat(goal.currentValue) || 0
    const target = parseFloat(goal.targetValue) || 1
    
    if (target === 0) return 0
    const progress = (current / target) * 100
    return Math.min(Math.max(progress, 0), 100)
  }

  const updateProgress = async (goalId, progressToAdd) => {
    try {
      await goalService.updateProgress(goalId, progressToAdd)
      fetchGoals()
      fetchCompletedCount()
    } catch (error) {
      console.error('Error updating progress:', error)
      alert('Failed to update progress. Please try again.')
    }
  }

  // Calculate stats with proper progress calculation
  const stats = {
    totalGoals: goals.length,
    completedGoals: goals.filter(goal => goal.progress >= 100).length,
    activeGoals: goals.filter(goal => goal.progress < 100).length,
    averageProgress: goals.length > 0 
      ? Math.round(goals.reduce((acc, goal) => acc + goal.progress, 0) / goals.length)
      : 0
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <LoadingSpinner size="large" text="Loading your goals..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card p-8 max-w-md text-center"
        >
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Oops!</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <motion.button
            onClick={fetchGoals}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary"
          >
            Try Again
          </motion.button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4">
        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            className="card p-6 text-center bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100"
          >
            <div className="text-3xl font-bold gradient-text mb-2">{stats.totalGoals}</div>
            <div className="text-gray-600 font-medium">Total Goals</div>
            <div className="text-sm text-blue-500 mt-2">🎯 All objectives</div>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            className="card p-6 text-center bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100"
          >
            <div className="text-3xl font-bold gradient-text mb-2">{stats.completedGoals}</div>
            <div className="text-gray-600 font-medium">Completed</div>
            <div className="text-sm text-green-500 mt-2">✅ Achieved</div>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            className="card p-6 text-center bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100"
          >
            <div className="text-3xl font-bold gradient-text mb-2">{stats.activeGoals}</div>
            <div className="text-gray-600 font-medium">Active</div>
            <div className="text-sm text-orange-500 mt-2">🔥 In progress</div>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            className="card p-6 text-center bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100"
          >
            <div className="text-3xl font-bold gradient-text mb-2">{stats.averageProgress}%</div>
            <div className="text-gray-600 font-medium">Avg Progress</div>
            <div className="text-sm text-purple-500 mt-2">📈 Overall</div>
          </motion.div>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6"
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Welcome back, <span className="gradient-text">{user?.username || 'User'}</span>! 👋
            </h1>
            <p className="text-gray-600 text-lg">
              {goals.length === 0 
                ? "Ready to achieve your first goal?" 
                : `You're tracking ${goals.length} amazing ${goals.length === 1 ? 'goal' : 'goals'}`}
            </p>
          </div>
          <motion.a
            href="/goals/new"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary text-lg px-8 py-4 flex items-center space-x-2"
          >
            <span>🎯</span>
            <span>Create New Goal</span>
          </motion.a>
        </motion.div>

        {/* Goals Grid */}
        {goals.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="max-w-md mx-auto">
              <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-r from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center shadow-lg">
                <span className="text-6xl">🎯</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">No goals yet</h3>
              <p className="text-gray-600 mb-8 text-lg">
                Start your journey by creating your first goal. Track progress, run simulations, and achieve amazing results!
              </p>
              <motion.a
                href="/goals/new"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary text-lg px-8 py-4 inline-flex items-center space-x-2"
              >
                <span>🚀</span>
                <span>Create Your First Goal</span>
              </motion.a>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {goals.map((goal, index) => (
              <GoalCard 
                key={goal.id || index} 
                goal={goal} 
                index={index}
                onUpdateProgress={updateProgress}
              />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Dashboard