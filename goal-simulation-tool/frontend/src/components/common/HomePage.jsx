import React from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'

const HomePage = () => {
  const { user } = useAuth()

  const features = [
    {
      icon: '🎯',
      title: 'Smart Goal Setting',
      description: 'Set clear, measurable goals with intelligent tracking and progress monitoring.',
      color: 'from-emerald-500 to-cyan-500',
      bgColor: 'bg-gradient-to-br from-emerald-50 to-cyan-50',
      borderColor: 'border-emerald-200'
    },
    {
      icon: '📊',
      title: 'Real-time Simulations',
      description: 'Run simulations to see how different strategies affect your goal achievement timeline.',
      color: 'from-blue-500 to-indigo-500',
      bgColor: 'bg-gradient-to-br from-blue-50 to-indigo-50',
      borderColor: 'border-blue-200'
    },
    {
      icon: '📈',
      title: 'Progress Analytics',
      description: 'Beautiful charts and insights to track your journey and stay motivated.',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-gradient-to-br from-purple-50 to-pink-50',
      borderColor: 'border-purple-200'
    },
    {
      icon: '🔄',
      title: 'Flexible Tracking',
      description: 'Track progress daily, weekly, or monthly based on your goal type.',
      color: 'from-orange-500 to-amber-500',
      bgColor: 'bg-gradient-to-br from-orange-50 to-amber-50',
      borderColor: 'border-orange-200'
    }
  ]

  const stats = [
    { number: '15K+', label: 'Goals Achieved', icon: '🏆' },
    { number: '92%', label: 'Success Rate', icon: '📊' },
    { number: '50K+', label: 'Active Users', icon: '👥' },
    { number: '4.8', label: 'Rating', icon: '⭐' }
  ]

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Entrepreneur',
      content: 'DreamAchiever helped me launch my business 3 months ahead of schedule. The simulation feature was a game-changer!',
      avatar: '👩‍💼',
      bgColor: 'bg-gradient-to-br from-emerald-50 to-cyan-50'
    },
    {
      name: 'Marcus Johnson',
      role: 'Fitness Coach',
      content: 'Finally reached my fitness goals after years of trying. The progress tracking kept me motivated daily.',
      avatar: '💪',
      bgColor: 'bg-gradient-to-br from-blue-50 to-indigo-50'
    },
    {
      name: 'Emily Davis',
      role: 'Student',
      content: 'As a student, DreamAchiever helped me organize my academic and personal goals. Highly recommended!',
      avatar: '🎓',
      bgColor: 'bg-gradient-to-br from-purple-50 to-pink-50'
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      {/* Hero Section with Beautiful Gradient */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-500 via-cyan-500 to-blue-600">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-white/20 rounded-full mix-blend-soft-light filter blur-3xl opacity-70 animate-float"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-emerald-400/30 rounded-full mix-blend-soft-light filter blur-3xl opacity-50 animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-cyan-400/40 rounded-full mix-blend-soft-light filter blur-3xl opacity-60 animate-float" style={{ animationDelay: '4s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-400/30 rounded-full mix-blend-soft-light filter blur-3xl opacity-40 animate-float" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

        <div className="relative z-10 container mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center max-w-6xl mx-auto"
          >
            

            <motion.h1 
              variants={itemVariants}
              className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6"
            >
              <span className="text-white">
                Achieve
              </span>
              <br />
              <span className="bg-gradient-to-r from-white via-emerald-100 to-cyan-100 bg-clip-text text-transparent">
                Your Dreams
              </span>
            </motion.h1>

            <motion.p 
              variants={itemVariants}
              className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              "Transform your aspirations into reality with our advanced goal simulation platform. 
              Plan, track, and visualize your path to success with personalized recommendations and progress analytics."
            </motion.p>

            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
            >
              {user ? (
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="/dashboard"
                  className="px-8 py-4 bg-white text-emerald-600 rounded-xl font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 text-lg"
                >
                  🚀 Go to Dashboard
                </motion.a>
              ) : (
                <>
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href="/register"
                    className="px-8 py-4 bg-white text-emerald-600 rounded-xl font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 text-lg"
                  >
                    Start Free Today
                  </motion.a>
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href="/login"
                    className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-emerald-600 transition-all duration-300 transform hover:scale-105 text-lg"
                  >
                    Sign In
                  </motion.a>
                </>
              )}
            </motion.div>

          </motion.div>
        </div>

      </section>

      

      {/* Features Section with Colorful Background */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Why Choose <span className="bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">DreamAchiever</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to transform how you plan, track, and achieve your most ambitious goals
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group"
              >
                <div className={`relative p-8 h-full ${feature.bgColor} rounded-2xl shadow-lg border ${feature.borderColor} hover:shadow-2xl transition-all duration-500 overflow-hidden`}>
                  
                  {/* Animated Background Element */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                  
                  {/* Icon Container */}
                  <div className={`relative z-10 w-16 h-16 ${feature.bgColor} rounded-2xl flex items-center justify-center mb-6 border ${feature.borderColor} group-hover:scale-110 transition-transform duration-300`}>
                    <div className={`text-2xl bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`}>
                      {feature.icon}
                    </div>
                  </div>
                  
                  <h3 className={`text-xl font-bold mb-4 bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`}>
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed relative z-10">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage