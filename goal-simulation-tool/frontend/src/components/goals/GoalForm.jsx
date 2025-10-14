import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'
import { goalService } from '../../services/api'
import LoadingSpinner from '../common/LoadingSpinner'

const GoalForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'FINANCIAL',
    targetValue: '',
    currentValue: '0',
    targetDate: '',
    progressType: 'WEEKLY'
  })
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      await goalService.createGoal({
        ...formData,
        userId: user.id,
        targetValue: parseFloat(formData.targetValue),
        currentValue: parseFloat(formData.currentValue)
      })
      window.location.href = '/dashboard'
    } catch (error) {
      console.error('Error creating goal:', error)
      alert('Error creating goal. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-orange-100 to-yellow-100 py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto px-4"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Create New Goal</h1>
        
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 space-y-6 border border-pink-200">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Goal Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-pink-50 border-2 border-pink-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 placeholder-gray-500"
              placeholder="e.g., Save for vacation, Lose weight, Career promotion"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 bg-pink-50 border-2 border-pink-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 placeholder-gray-500"
              placeholder="Describe your goal and why it's important to you..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Goal Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-pink-50 border-2 border-pink-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
              >
                <option value="FINANCIAL">Financial</option>
                <option value="HEALTH">Health & Fitness</option>
                <option value="CAREER">Career</option>
                <option value="PERSONAL_DEVELOPMENT">Personal Development</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Progress Type
              </label>
              <select
                name="progressType"
                value={formData.progressType}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-pink-50 border-2 border-pink-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
              >
                <option value="DAILY">Daily</option>
                <option value="WEEKLY">Weekly</option>
                <option value="MONTHLY">Monthly</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target
              </label>
              <input
                type="number"
                name="targetValue"
                value={formData.targetValue}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-pink-50 border-2 border-pink-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 placeholder-gray-500"
                placeholder="e.g.,amount, days, weight"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current
              </label>
              <input
                type="number"
                name="currentValue"
                value={formData.currentValue}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-pink-50 border-2 border-pink-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 placeholder-gray-500"
                placeholder="e.g., 0, 5000, 70"
                step="0.01"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Date
            </label>
            <input
              type="date"
              name="targetDate"
              value={formData.targetDate}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-pink-50 border-2 border-pink-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
            />
          </div>

          <div className="flex justify-end space-x-4 pt-6">
            <motion.button
              type="button"
              onClick={() => window.location.href = '/dashboard'}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 text-gray-600 border-2 border-pink-300 rounded-xl hover:bg-pink-50 transition-colors font-medium"
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 flex items-center space-x-2 font-medium"
            >
              {loading && <LoadingSpinner size="small" />}
              <span>{loading ? 'Creating...' : 'Create Goal'}</span>
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default GoalForm