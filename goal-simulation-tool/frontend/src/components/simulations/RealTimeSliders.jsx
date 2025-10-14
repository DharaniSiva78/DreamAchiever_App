import React from 'react'
import { motion } from 'framer-motion'

const RealTimeSliders = ({ goalType, parameters, onParametersChange, loading }) => {
  const handleSliderChange = (key, value) => {
    onParametersChange(prev => ({
      ...prev,
      [key]: parseFloat(value)
    }))
  }

  const getSlidersConfig = () => {
    const baseConfigs = {
      FINANCIAL: [
        {
          key: 'initialAmount',
          label: 'Initial Investment',
          value: parameters.initialAmount || 1000,
          min: 0,
          max: 100000,
          step: 1000,
          format: value => `$${value.toLocaleString()}`,
          color: 'blue',
          symbol: '$'
        },
        {
          key: 'monthlyContribution',
          label: 'Monthly Contribution',
          value: parameters.monthlyContribution || 500,
          min: 0,
          max: 10000,
          step: 50,
          format: value => `$${value.toLocaleString()}`,
          color: 'green',
          symbol: '$'
        },
        {
          key: 'interestRate',
          label: 'Annual Interest Rate',
          value: parameters.interestRate || 7,
          min: 0,
          max: 20,
          step: 0.1,
          format: value => `${value}%`,
          color: 'purple',
          symbol: '%'
        },
        {
          key: 'timeframe',
          label: 'Investment Years',
          value: parameters.timeframe || 10,
          min: 1,
          max: 40,
          step: 1,
          format: value => `${value} years`,
          color: 'orange',
          symbol: '📅'
        }
      ],
      HEALTH: [
        {
          key: 'currentWeight',
          label: 'Current Weight',
          value: parameters.currentWeight || 180,
          min: 100,
          max: 300,
          step: 1,
          format: value => `${value} lbs`,
          color: 'green',
          symbol: '⚖️'
        },
        {
          key: 'targetWeight',
          label: 'Target Weight',
          value: parameters.targetWeight || 160,
          min: 100,
          max: 300,
          step: 1,
          format: value => `${value} lbs`,
          color: 'blue',
          symbol: '🎯'
        },
        {
          key: 'weeklyLoss',
          label: 'Weekly Weight Loss',
          value: parameters.weeklyLoss || 1,
          min: 0.1,
          max: 2,
          step: 0.1,
          format: value => `${value} lbs/week`,
          color: 'purple',
          symbol: '📉'
        },
        {
          key: 'exerciseDays',
          label: 'Exercise Days/Week',
          value: parameters.exerciseDays || 3,
          min: 0,
          max: 7,
          step: 1,
          format: value => `${value} days`,
          color: 'orange',
          symbol: '💪'
        }
      ],
      FITNESS: [
        {
          key: 'currentFitness',
          label: 'Current Fitness Level',
          value: parameters.currentFitness || 3,
          min: 1,
          max: 10,
          step: 0.5,
          format: value => `${value}/10`,
          color: 'blue',
          symbol: '⭐'
        },
        {
          key: 'targetFitness',
          label: 'Target Fitness Level',
          value: parameters.targetFitness || 8,
          min: 1,
          max: 10,
          step: 0.5,
          format: value => `${value}/10`,
          color: 'green',
          symbol: '🎯'
        },
        {
          key: 'workoutHours',
          label: 'Weekly Workout Hours',
          value: parameters.workoutHours || 5,
          min: 1,
          max: 20,
          step: 0.5,
          format: value => `${value} hours`,
          color: 'purple',
          symbol: '⏱️'
        },
        {
          key: 'recoveryDays',
          label: 'Recovery Days/Week',
          value: parameters.recoveryDays || 2,
          min: 1,
          max: 7,
          step: 1,
          format: value => `${value} days`,
          color: 'orange',
          symbol: '🛌'
        }
      ],
      CAREER: [
        {
          key: 'currentSalary',
          label: 'Current Salary',
          value: parameters.currentSalary || 60000,
          min: 30000,
          max: 200000,
          step: 5000,
          format: value => `$${value.toLocaleString()}`,
          color: 'blue',
          symbol: '💰'
        },
        {
          key: 'targetSalary',
          label: 'Target Salary',
          value: parameters.targetSalary || 100000,
          min: 40000,
          max: 300000,
          step: 10000,
          format: value => `$${value.toLocaleString()}`,
          color: 'green',
          symbol: '🎯'
        },
        {
          key: 'annualIncrease',
          label: 'Expected Annual Increase',
          value: parameters.annualIncrease || 8,
          min: 0,
          max: 25,
          step: 0.5,
          format: value => `${value}%`,
          color: 'purple',
          symbol: '📈'
        },
        {
          key: 'skillDevelopment',
          label: 'Skill Development Hours',
          value: parameters.skillDevelopment || 5,
          min: 0,
          max: 20,
          step: 1,
          format: value => `${value} hours/week`,
          color: 'orange',
          symbol: '📚'
        }
      ],
      PERSONAL_DEVELOPMENT: [
        {
          key: 'currentSkill',
          label: 'Current Skill Level',
          value: parameters.currentSkill || 3,
          min: 1,
          max: 10,
          step: 0.1,
          format: value => `${value}/10`,
          color: 'blue',
          symbol: '⭐'
        },
        {
          key: 'targetSkill',
          label: 'Target Skill Level',
          value: parameters.targetSkill || 8,
          min: 1,
          max: 10,
          step: 0.1,
          format: value => `${value}/10`,
          color: 'green',
          symbol: '🎯'
        },
        {
          key: 'weeklyPractice',
          label: 'Weekly Practice Hours',
          value: parameters.weeklyPractice || 5,
          min: 1,
          max: 20,
          step: 0.5,
          format: value => `${value} hours`,
          color: 'purple',
          symbol: '⏱️'
        },
        {
          key: 'learningEfficiency',
          label: 'Learning Efficiency',
          value: parameters.learningEfficiency || 6,
          min: 1,
          max: 10,
          step: 0.5,
          format: value => `${value}/10`,
          color: 'orange',
          symbol: '🧠'
        }
      ],
      EDUCATION: [
        {
          key: 'currentGPA',
          label: 'Current GPA',
          value: parameters.currentGPA || 3.0,
          min: 1.0,
          max: 4.0,
          step: 0.1,
          format: value => `${value.toFixed(1)}`,
          color: 'blue',
          symbol: '📊'
        },
        {
          key: 'targetGPA',
          label: 'Target GPA',
          value: parameters.targetGPA || 3.5,
          min: 2.0,
          max: 4.0,
          step: 0.1,
          format: value => `${value.toFixed(1)}`,
          color: 'green',
          symbol: '🎯'
        },
        {
          key: 'studyHours',
          label: 'Weekly Study Hours',
          value: parameters.studyHours || 10,
          min: 5,
          max: 40,
          step: 1,
          format: value => `${value} hours`,
          color: 'purple',
          symbol: '⏱️'
        },
        {
          key: 'courseDifficulty',
          label: 'Course Difficulty',
          value: parameters.courseDifficulty || 6,
          min: 1,
          max: 10,
          step: 0.5,
          format: value => `${value}/10`,
          color: 'orange',
          symbol: '📚'
        }
      ]
    }

    return baseConfigs[goalType] || []
  }

  const getColorClass = (color) => {
    const colorMap = {
      blue: 'text-blue-600',
      green: 'text-green-600',
      purple: 'text-purple-600',
      orange: 'text-orange-600',
      red: 'text-red-600'
    }
    return colorMap[color] || 'text-gray-600'
  }

  const getSliderStyle = (color) => {
    const colorMap = {
      blue: 'slider-blue',
      green: 'slider-green', 
      purple: 'slider-purple',
      orange: 'slider-orange',
      red: 'slider-red'
    }
    return colorMap[color] || 'slider-blue'
  }

  const sliders = getSlidersConfig()

  if (sliders.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No sliders available for this goal type.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {sliders.map((slider, index) => (
        <motion.div
          key={slider.key}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.3 }}
          className="space-y-4 p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <span className="text-lg">{slider.symbol}</span>
              <label className="font-semibold text-gray-800 text-sm uppercase tracking-wide">
                {slider.label}
              </label>
            </div>
            <span className={`text-xl font-bold ${getColorClass(slider.color)}`}>
              {slider.format(slider.value)}
            </span>
          </div>
          
          <input
            type="range"
            min={slider.min}
            max={slider.max}
            step={slider.step}
            value={slider.value}
            onChange={(e) => handleSliderChange(slider.key, e.target.value)}
            disabled={loading}
            className={`
              w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer
              disabled:opacity-50 disabled:cursor-not-allowed
              ${getSliderStyle(slider.color)}
            `}
          />
          
          <div className="flex justify-between text-sm text-gray-600 font-medium">
            <span>{slider.format(slider.min)}</span>
            <span className="text-gray-500">Current: {slider.format(slider.value)}</span>
            <span>{slider.format(slider.max)}</span>
          </div>
        </motion.div>
      ))}
      
      <style jsx>{`
        .slider-blue::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: white;
          border: 3px solid #3b82f6;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(59, 130, 246, 0.3);
        }
        
        .slider-green::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: white;
          border: 3px solid #10b981;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(16, 185, 129, 0.3);
        }
        
        .slider-purple::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: white;
          border: 3px solid #8b5cf6;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(139, 92, 246, 0.3);
        }
        
        .slider-orange::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: white;
          border: 3px solid #f59e0b;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(245, 158, 11, 0.3);
        }
        
        .slider-red::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: white;
          border: 3px solid #ef4444;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(239, 68, 68, 0.3);
        }
      `}</style>
    </div>
  )
}

export default RealTimeSliders