import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { simulationService } from '../../services/api'
import RealTimeSliders from './RealTimeSliders'
import SimulationResults from './SimulationResults'
import LoadingSpinner from '../common/LoadingSpinner'

const SimulationEngine = ({ goal }) => {
  const [parameters, setParameters] = useState(getDefaultParameters(goal.type))
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [scenarios, setScenarios] = useState([])

  useEffect(() => {
    loadPreviousScenarios()
  }, [goal.id])

  function getDefaultParameters(goalType) {
    const baseParams = {
      scenarioName: 'Current Scenario',
      goalType: goalType
    }

    const defaults = {
      FINANCIAL: {
        initialAmount: 1000,
        monthlyContribution: 500,
        interestRate: 7,
        timeframe: 10,
        targetAmount: 100000
      },
      HEALTH: {
        currentWeight: 180,
        targetWeight: 160,
        weeklyLoss: 1,
        exerciseDays: 3,
        calorieDeficit: 500
      },
      FITNESS: {
        currentFitness: 3,
        targetFitness: 8,
        workoutHours: 5,
        recoveryDays: 2,
        workoutIntensity: 7
      },
      CAREER: {
        currentSalary: 60000,
        targetSalary: 100000,
        annualIncrease: 8,
        skillDevelopment: 5,
        promotionCycle: 2
      },
      PERSONAL_DEVELOPMENT: {
        currentSkill: 3,
        targetSkill: 8,
        weeklyPractice: 5,
        learningEfficiency: 6,
        projectComplexity: 5
      },
      EDUCATION: {
        currentGPA: 3.0,
        targetGPA: 3.5,
        studyHours: 10,
        courseDifficulty: 6,
        semesterLength: 4
      }
    }

    return { ...baseParams, ...defaults[goalType] }
  }

  const calculateSimulation = () => {
    switch (goal.type) {
      case 'FINANCIAL':
        return calculateFinancialGoal()
      case 'HEALTH':
        return calculateHealthGoal()
      case 'FITNESS':
        return calculateFitnessGoal()
      case 'CAREER':
        return calculateCareerGoal()
      case 'PERSONAL_DEVELOPMENT':
        return calculatePersonalDevelopmentGoal()
      case 'EDUCATION':
        return calculateEducationGoal()
      default:
        return calculateGenericGoal()
    }
  }

  const calculateFinancialGoal = () => {
    const { initialAmount, monthlyContribution, interestRate, timeframe, targetAmount } = parameters
    const monthlyRate = interestRate / 100 / 12
    const months = timeframe * 12
    
    let balance = initialAmount
    const progressData = []
    let monthsToTarget = months
    
    for (let month = 1; month <= months; month++) {
      balance = balance * (1 + monthlyRate) + monthlyContribution
      progressData.push({
        month,
        balance: Math.round(balance),
        contributions: initialAmount + (monthlyContribution * month)
      })
      
      if (balance >= targetAmount && monthsToTarget === months) {
        monthsToTarget = month
      }
    }
    
    const totalContributions = initialAmount + (monthlyContribution * months)
    const totalEarnings = balance - totalContributions
    
    return {
      success: balance >= targetAmount,
      finalBalance: Math.round(balance),
      totalContributions: Math.round(totalContributions),
      totalEarnings: Math.round(totalEarnings),
      monthsToComplete: monthsToTarget,
      completionDate: calculateFutureDate(monthsToTarget),
      progressData,
      metrics: {
        'Final Balance': `$${Math.round(balance).toLocaleString()}`,
        'Total Invested': `$${Math.round(totalContributions).toLocaleString()}`,
        'Investment Earnings': `$${Math.round(totalEarnings).toLocaleString()}`,
        'Months to Goal': `${monthsToTarget}`
      }
    }
  }

  const calculateHealthGoal = () => {
    const { currentWeight, targetWeight, weeklyLoss } = parameters
    const weightToLose = currentWeight - targetWeight
    const weeksToGoal = Math.max(1, Math.round(weightToLose / weeklyLoss))
    const monthsToGoal = Math.ceil(weeksToGoal / 4.33)
    
    const progressData = []
    for (let week = 1; week <= weeksToGoal; week++) {
      const projectedWeight = Math.max(targetWeight, currentWeight - (weeklyLoss * week))
      progressData.push({
        week,
        weight: Math.round(projectedWeight),
        weightLost: Math.round(weeklyLoss * week)
      })
    }
    
    return {
      success: weightToLose > 0,
      weeksToGoal,
      monthsToGoal,
      completionDate: calculateFutureDate(monthsToGoal),
      progressData,
      metrics: {
        'Starting Weight': `${currentWeight} lbs`,
        'Target Weight': `${targetWeight} lbs`,
        'Weight to Lose': `${weightToLose} lbs`,
        'Estimated Time': `${monthsToGoal} months`
      }
    }
  }

  const calculateFitnessGoal = () => {
    const { currentFitness, targetFitness, workoutHours, workoutIntensity } = parameters
    const fitnessGap = targetFitness - currentFitness
    const weeklyProgress = (workoutHours * workoutIntensity) / 100
    const weeksToGoal = Math.max(1, Math.round(fitnessGap / weeklyProgress))
    
    const progressData = []
    for (let week = 1; week <= weeksToGoal; week++) {
      const fitnessLevel = Math.min(targetFitness, currentFitness + (weeklyProgress * week))
      progressData.push({
        week,
        fitnessLevel: parseFloat(fitnessLevel.toFixed(1)),
        improvement: parseFloat((fitnessLevel - currentFitness).toFixed(1))
      })
    }
    
    return {
      success: fitnessGap > 0,
      weeksToGoal,
      completionDate: calculateFutureDate(Math.ceil(weeksToGoal / 4.33)),
      progressData,
      metrics: {
        'Current Level': `${currentFitness}/10`,
        'Target Level': `${targetFitness}/10`,
        'Weekly Progress': `${weeklyProgress.toFixed(1)} points`,
        'Estimated Time': `${weeksToGoal} weeks`
      }
    }
  }

  const calculateCareerGoal = () => {
    const { currentSalary, targetSalary, annualIncrease, promotionCycle } = parameters
    let salary = currentSalary
    const progressData = []
    let yearsToGoal = 0
    
    while (salary < targetSalary && yearsToGoal < 40) {
      yearsToGoal++
      salary = salary * (1 + annualIncrease / 100)
      
      // Promotion boost every promotion cycle years
      if (yearsToGoal % promotionCycle === 0) {
        salary *= 1.15 // 15% promotion boost
      }
      
      progressData.push({
        year: yearsToGoal,
        salary: Math.round(salary),
        totalGrowth: Math.round(salary - currentSalary)
      })
    }
    
    return {
      success: salary >= targetSalary,
      yearsToGoal,
      finalSalary: Math.round(salary),
      completionDate: calculateFutureDate(yearsToGoal * 12),
      progressData,
      metrics: {
        'Current Salary': `$${currentSalary.toLocaleString()}`,
        'Target Salary': `$${targetSalary.toLocaleString()}`,
        'Final Salary': `$${Math.round(salary).toLocaleString()}`,
        'Years to Goal': `${yearsToGoal}`
      }
    }
  }

  const calculatePersonalDevelopmentGoal = () => {
    const { currentSkill, targetSkill, weeklyPractice, learningEfficiency } = parameters
    const skillGap = targetSkill - currentSkill
    const weeklyProgress = (weeklyPractice * learningEfficiency) / 70 // Normalized
    const weeksToGoal = Math.max(1, Math.round(skillGap / weeklyProgress))
    
    const progressData = []
    for (let week = 1; week <= weeksToGoal; week++) {
      const skillLevel = Math.min(targetSkill, currentSkill + (weeklyProgress * week))
      progressData.push({
        week,
        skillLevel: parseFloat(skillLevel.toFixed(1)),
        improvement: parseFloat((skillLevel - currentSkill).toFixed(1))
      })
    }
    
    return {
      success: skillGap > 0,
      weeksToGoal,
      completionDate: calculateFutureDate(Math.ceil(weeksToGoal / 4.33)),
      progressData,
      metrics: {
        'Current Skill': `${currentSkill}/10`,
        'Target Skill': `${targetSkill}/10`,
        'Weekly Progress': `${weeklyProgress.toFixed(1)} points`,
        'Estimated Time': `${weeksToGoal} weeks`
      }
    }
  }

  const calculateEducationGoal = () => {
    const { currentGPA, targetGPA, studyHours, courseDifficulty } = parameters
    const gpaGap = targetGPA - currentGPA
    const weeklyImprovement = (studyHours / courseDifficulty) * 0.1
    const weeksToGoal = Math.max(1, Math.round(gpaGap / weeklyImprovement))
    
    const progressData = []
    for (let week = 1; week <= weeksToGoal; week++) {
      const gpa = Math.min(targetGPA, currentGPA + (weeklyImprovement * week))
      progressData.push({
        week,
        gpa: parseFloat(gpa.toFixed(2)),
        improvement: parseFloat((gpa - currentGPA).toFixed(2))
      })
    }
    
    return {
      success: gpaGap > 0,
      weeksToGoal,
      completionDate: calculateFutureDate(Math.ceil(weeksToGoal / 4.33)),
      progressData,
      metrics: {
        'Current GPA': currentGPA.toFixed(1),
        'Target GPA': targetGPA.toFixed(1),
        'Weekly Study': `${studyHours} hours`,
        'Estimated Time': `${weeksToGoal} weeks`
      }
    }
  }

  const calculateGenericGoal = () => {
    return {
      success: true,
      monthsToComplete: 12,
      completionDate: calculateFutureDate(12),
      progressData: [],
      metrics: {
        'Status': 'Simulation Complete',
        'Result': 'Goal achievable with current parameters'
      }
    }
  }

  const calculateFutureDate = (monthsFromNow) => {
    const date = new Date()
    date.setMonth(date.getMonth() + monthsFromNow)
    return date.toISOString()
  }

  const loadPreviousScenarios = async () => {
    try {
      const response = await simulationService.getGoalSimulations(goal.id)
      setScenarios(response.data)
    } catch (error) {
      console.error('Error loading scenarios:', error)
      // For demo, create some mock scenarios
      setScenarios([
        {
          id: 1,
          scenarioName: 'Aggressive Plan',
          createdAt: new Date().toISOString(),
          parameters: getDefaultParameters(goal.type)
        },
        {
          id: 2,
          scenarioName: 'Conservative Approach',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          parameters: getDefaultParameters(goal.type)
        }
      ])
    }
  }

  const runSimulation = async () => {
    setLoading(true)
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const simulationResults = calculateSimulation()
      const resultData = {
        id: Date.now(),
        scenarioName: parameters.scenarioName,
        parameters: parameters,
        results: simulationResults,
        createdAt: new Date().toISOString(),
        goalType: goal.type
      }
      
      setResults(resultData)
      
      if (parameters.scenarioName !== 'Current Scenario') {
        setScenarios(prev => [resultData, ...prev.slice(0, 4)])
      }
    } catch (error) {
      console.error('Error running simulation:', error)
      alert('Error running simulation. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const saveScenario = () => {
    const scenarioName = prompt('Enter a name for this scenario:')
    if (scenarioName) {
      setParameters(prev => ({
        ...prev,
        scenarioName
      }))
    }
  }

  const loadScenario = (scenario) => {
    setParameters({
      ...scenario.parameters,
      scenarioName: scenario.scenarioName
    })
    setResults(scenario)
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
      >
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Goal Simulation Engine</h2>
            <p className="text-gray-600 mt-2">Adjust parameters to see how they affect your goal achievement timeline</p>
          </div>
          <div className="flex space-x-4">
            <motion.button
              onClick={saveScenario}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 border-2 border-blue-500 text-blue-500 rounded-xl hover:bg-blue-50 transition-colors font-semibold flex items-center space-x-2"
              disabled={loading}
            >
              <span>💾</span>
              <span>Save Scenario</span>
            </motion.button>
            <motion.button
              onClick={runSimulation}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-semibold disabled:opacity-50 flex items-center space-x-2"
              disabled={loading}
            >
              {loading ? <LoadingSpinner size="small" /> : <span>🚀</span>}
              <span>{loading ? 'Simulating...' : 'Run Simulation'}</span>
            </motion.button>
          </div>
        </div>
        
        <RealTimeSliders 
          goalType={goal.type}
          parameters={parameters}
          onParametersChange={setParameters}
          loading={loading}
        />
      </motion.div>

      {results && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <SimulationResults 
            results={results} 
            goalType={goal.type}
            loading={loading}
          />
        </motion.div>
      )}

      {scenarios.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
        >
          <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
            <span>📚</span>
            <span>Saved Scenarios</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scenarios.map((scenario, index) => (
              <motion.div
                key={scenario.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="border-2 border-gray-200 rounded-xl p-5 hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer bg-gradient-to-br from-white to-gray-50"
                onClick={() => loadScenario(scenario)}
              >
                <h4 className="font-bold text-gray-900 mb-2 text-lg">{scenario.scenarioName}</h4>
                <p className="text-sm text-gray-600 mb-3">
                  {new Date(scenario.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </p>
                <div className="text-blue-600 font-semibold text-sm flex items-center space-x-1">
                  <span>👆</span>
                  <span>Click to load this scenario</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default SimulationEngine