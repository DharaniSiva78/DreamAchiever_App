import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'

const Header = () => {
  const { user, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-effect shadow-sm sticky top-0 z-50"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <motion.a 
            href="/" 
            className="flex items-center space-x-3 group"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
              <span className="text-white font-bold text-xl">D</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">DreamAchiever</h1>
              <p className="text-xs text-gray-500 -mt-1">Achieve your dreams</p>
            </div>
          </motion.a>
          
          {/* Navigation */}
          {user && (
            <nav className="hidden md:flex space-x-8">
              <a 
                href="/dashboard" 
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium relative group"
              >
                Dashboard
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
              </a>
              
            </nav>
          )}
          
          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <div className="hidden md:flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-gray-800 font-semibold">Welcome, {user.username}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <motion.button
                    onClick={logout}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Logout
                  </motion.button>
                </div>

                {/* Mobile menu button */}
                <motion.button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  whileTap={{ scale: 0.95 }}
                  className="md:hidden p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="w-6 h-6 flex flex-col justify-center space-y-1.5">
                    <div className="w-full h-0.5 bg-gray-600 rounded transition-all duration-300"></div>
                    <div className="w-full h-0.5 bg-gray-600 rounded transition-all duration-300"></div>
                    <div className="w-full h-0.5 bg-gray-600 rounded transition-all duration-300"></div>
                  </div>
                </motion.button>
              </>
            ) : (
              <div className="flex space-x-3">
                <motion.a
                  href="/login"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 border-2 border-blue-500 text-blue-500 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300"
                >
                  Login
                </motion.a>
                <motion.a
                  href="/register"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Register
                </motion.a>
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMenuOpen && user && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4"
            >
              <div className="space-y-3">
                <a 
                  href="/dashboard" 
                  className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 transition-colors font-medium py-3 px-4 rounded-xl hover:bg-blue-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>📊</span>
                  <span>Dashboard</span>
                </a>
                <a 
                  href="/goals/new" 
                  className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 transition-colors font-medium py-3 px-4 rounded-xl hover:bg-blue-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>🎯</span>
                  <span>New Goal</span>
                </a>
                <div className="pt-2 border-t border-gray-200">
                  <div className="px-4 py-3">
                    <p className="text-gray-700 font-semibold">Welcome, {user.username}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      logout()
                      setIsMenuOpen(false)
                    }}
                    className="w-full text-left px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-medium flex items-center space-x-3"
                  >
                    <span>🚪</span>
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}

export default Header