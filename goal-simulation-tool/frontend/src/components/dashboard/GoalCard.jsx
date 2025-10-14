import React from 'react';
import { motion } from 'framer-motion';

const GoalCard = ({ goal, onUpdateProgress, index }) => {
  const getGoalTypeConfig = (type) => {
    const configs = {
      FINANCIAL: {
        symbol: '💰',
        unit: '$',
        color: 'blue',
        progressType: 'financial',
        isSkillBased: false
      },
      HEALTH: {
        symbol: '⚖️',
        unit: 'lbs',
        color: 'green',
        progressType: 'weight',
        isSkillBased: false
      },
      FITNESS: {
        symbol: '💪',
        unit: 'level',
        color: 'orange',
        progressType: 'fitness',
        isSkillBased: true
      },
      CAREER: {
        symbol: '💼',
        unit: '$',
        color: 'purple',
        progressType: 'career',
        isSkillBased: false
      },
      PERSONAL_DEVELOPMENT: {
        symbol: '🚀',
        unit: 'points',
        color: 'pink',
        progressType: 'skill',
        isSkillBased: true
      },
      PERSONAL: {
        symbol: '🚀',
        unit: 'points',
        color: 'pink',
        progressType: 'skill',
        isSkillBased: true
      },
      EDUCATION: {
        symbol: '🎓',
        unit: 'GPA',
        color: 'indigo',
        progressType: 'education',
        isSkillBased: false
      }
    };
    return configs[type] || configs.PERSONAL_DEVELOPMENT;
  };

  // Fix: Smart value parsing for different goal types
  const parseGoalValue = (value, type, isTarget = false) => {
    const numValue = parseFloat(value) || 0;
    
    // For skill-based goals, current value caps at 10, target can be any positive number
    const config = getGoalTypeConfig(type);
    if (config.isSkillBased && !isTarget) {
      return Math.min(numValue, 10);
    }
    
    return numValue;
  };

  const formatProgressValue = (goal, config) => {
    const current = parseGoalValue(goal.currentValue, goal.type, false);
    const target = parseGoalValue(goal.targetValue, goal.type, true);
    
    switch (goal.type) {
      case 'FINANCIAL':
      case 'CAREER':
        return {
          current: `$${current.toLocaleString()}`,
          target: `$${target.toLocaleString()}`,
          rawCurrent: current,
          rawTarget: target
        };
      
      case 'HEALTH':
        return {
          current: `${current.toLocaleString()} ${config.unit}`,
          target: `${target.toLocaleString()} ${config.unit}`,
          rawCurrent: current,
          rawTarget: target
        };
      
      case 'FITNESS':
      case 'PERSONAL_DEVELOPMENT':
      case 'PERSONAL':
        return {
          current: `${current.toFixed(1)}/10`,
          target: `${target.toFixed(1)}/10`,
          rawCurrent: current,
          rawTarget: target
        };
      
      case 'EDUCATION':
        return {
          current: current.toFixed(1),
          target: target.toFixed(1),
          rawCurrent: current,
          rawTarget: target
        };
      
      default:
        return {
          current: current.toLocaleString(),
          target: target.toLocaleString(),
          rawCurrent: current,
          rawTarget: target
        };
    }
  };

  // Fix: Smart progress calculation for skill-based vs regular goals
  const calculateProgress = (goal) => {
    const config = getGoalTypeConfig(goal.type);
    const current = parseGoalValue(goal.currentValue, goal.type, false);
    const target = parseGoalValue(goal.targetValue, goal.type, true);
    
    if (target === 0) return 0;
    
    if (config.isSkillBased) {
      // For skill-based goals: progress is based on reaching mastery (10/10)
      // But show relative progress towards target if it's reasonable
      if (target <= 10) {
        // Normal target (1-10): progress = current / target
        const progress = (current / target) * 100;
        return Math.min(Math.max(progress, 0), 100);
      } else {
        // Ambitious target (>10): progress = current / 10 (cap at mastery)
        const progress = (current / 10) * 100;
        return Math.min(Math.max(progress, 0), 100);
      }
    }
    
    // For non-skill goals: progress = current / target
    const progress = (current / target) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  // Fix: Smart completion detection
  const isGoalCompleted = (goal) => {
    const config = getGoalTypeConfig(goal.type);
    const current = parseGoalValue(goal.currentValue, goal.type, false);
    const target = parseGoalValue(goal.targetValue, goal.type, true);
    
    if (config.isSkillBased) {
      // Skill-based goals are completed when reaching mastery (10/10) OR reaching target if target <= 10
      return current >= Math.min(target, 10);
    }
    
    // Regular goals are completed when current >= target
    return current >= target;
  };

  const getProgressColor = (progress, isCompleted) => {
    if (isCompleted) return 'from-green-500 to-emerald-600';
    if (progress >= 75) return 'from-blue-500 to-cyan-600';
    if (progress >= 50) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  const config = getGoalTypeConfig(goal.type);
  const progress = calculateProgress(goal);
  const isCompleted = isGoalCompleted(goal);
  const progressColor = getProgressColor(progress, isCompleted);
  const formattedValues = formatProgressValue(goal, config);

  // Fix: Better progress update with validation
  const handleUpdateProgress = () => {
    const currentValue = parseGoalValue(goal.currentValue, goal.type, false);
    const maxSuggestion = config.isSkillBased ? 10 : formattedValues.rawTarget;
    
    const amount = prompt(
      `Update progress for "${goal.title}":\n\nCurrent: ${formattedValues.current}\nTarget: ${formattedValues.target}\n\nEnter new current value:`,
      currentValue
    );
    
    if (amount && !isNaN(parseFloat(amount))) {
      const newValue = parseFloat(amount);
      
      // Validate input for skill-based goals
      if (config.isSkillBased && newValue > 10) {
        if (!confirm(`Warning: Skill levels are typically rated 1-10. Are you sure you want to set ${newValue}/10?`)) {
          return;
        }
      }
      
      onUpdateProgress(goal.id, newValue);
    }
  };

  const handleViewDetails = () => {
    window.location.href = `/goals/${goal.id}`;
  };

  // Fix: Get appropriate status message
  const getStatusMessage = () => {
    if (isCompleted) {
      const current = parseGoalValue(goal.currentValue, goal.type, false);
      const target = parseGoalValue(goal.targetValue, goal.type, true);
      
      if (config.isSkillBased && target > 10 && current >= 10) {
        return 'MASTERED';
      }
      return 'COMPLETED';
    }
    return 'ACTIVE';
  };

  const statusMessage = getStatusMessage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{config.symbol}</span>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{goal.title}</h3>
              <p className="text-gray-600 text-sm capitalize">
                {goal.type ? goal.type.replace('_', ' ').toLowerCase() : 'Personal'}
              </p>
            </div>
          </div>
          
          <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
            isCompleted 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-blue-100 text-blue-800 border border-blue-200'
          }`}>
            {statusMessage}
          </div>
        </div>
        
        <p className="text-gray-500 text-sm">{goal.description || 'No description'}</p>
      </div>

      {/* Progress Section */}
      <div className="p-6">
        {/* Progress Percentage */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-lg font-bold text-gray-900">{progress.toFixed(1)}%</span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
          <div 
            className={`h-3 rounded-full bg-gradient-to-r ${progressColor} transition-all duration-1000 ease-out`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Current vs Target */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
            <div className="text-xs text-blue-600 font-semibold mb-2 uppercase tracking-wide">Current</div>
            <div className="text-xl font-bold text-gray-900">{formattedValues.current}</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
            <div className="text-xs text-green-600 font-semibold mb-2 uppercase tracking-wide">Target</div>
            <div className="text-xl font-bold text-gray-900">{formattedValues.target}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleUpdateProgress}
            disabled={isCompleted}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-colors text-sm flex items-center justify-center space-x-2 ${
              isCompleted 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <span>📈</span>
            <span>{isCompleted ? 'Completed' : 'Update Progress'}</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleViewDetails}
            className="flex-1 border-2 border-gray-300 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:border-blue-500 hover:text-blue-600 transition-colors text-sm flex items-center justify-center space-x-2"
          >
            <span>🔍</span>
            <span>View Details</span>
          </motion.button>
        </div>

        {/* Fix: Show explanation for ambitious targets */}
        {config.isSkillBased && parseGoalValue(goal.targetValue, goal.type, true) > 10 && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs text-yellow-700 text-center">
              💡 <strong>Ambitious Goal:</strong> Mastery achieved at 10/10. You can continue beyond!
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default GoalCard;