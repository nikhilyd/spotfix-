/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HomeIcon,
  DocumentTextIcon,
  UserIcon,
  InformationCircleIcon,
  XMarkIcon,
  Bars3Icon,
  ChatBubbleLeftRightIcon,
  ShieldCheckIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  BuildingOfficeIcon,
  IdentificationIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { useContext } from 'react';
import { UserContext } from '../context/user.context';
import { OfficerContext } from '../context/officer.context';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const { officer, setofficer } = useContext(OfficerContext);

  // Scroll listener removed - navbar stays consistent

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    if (user) setUser(null);
    if (officer) setofficer(null);
    navigate('/');
    setIsOpen(false);
  };

  const getUserType = () => {
    if (user) return 'user';
    if (officer) return 'officer';
    return 'guest';
  };

  const userType = getUserType();

  const navItems = {
    user: [
      { name: 'Home', path: '/', icon: HomeIcon },
      { name: 'File Complaint', path: '/complaint', icon: DocumentTextIcon },
      { name: 'My Complaints', path: '/usercomplaint', icon: UserIcon },
      { name: 'Upcoming Features', path: '/upcoming', icon: StarIcon },

    ],
    officer: [
      { name: 'Dashboard', path: '/', icon: HomeIcon },
      { name: 'Complaints', path: '/complaintpage', icon: DocumentTextIcon },
      { name: 'Workers', path: '/worker', icon: UserIcon },
      
      { name: 'Upcoming Features', path: '/upcoming', icon: StarIcon },
    ],
    guest: [
      { name: 'Home', path: '/', icon: HomeIcon },
      { name: 'About', path: '/about', icon: InformationCircleIcon },
     
      { name: 'UserLogin', path: '/login', icon: UserCircleIcon },
      { name: 'OfficerLogin', path: '/officerlogin', icon: UserCircleIcon },
      { name: 'Register', path: '/register', icon: ShieldCheckIcon },
       { name: 'OfficerRegister', path: '/officer', icon: ShieldCheckIcon },

    ]
  };

  const menuVariants = {
    closed: {
      x: "100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      }
    },
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      }
    }
  };

  const itemVariants = {
    closed: { opacity: 0, x: 20 },
    open: { opacity: 1, x: 0 }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Icons with better visibility
  const getLogoIcon = () => {
    // Simplified - just return the C letter icon
    return null;
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
      className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[95%] max-w-6xl transition-all duration-500 bg-gradient-to-br from-slate-900/40 via-slate-800/30 to-slate-900/40 backdrop-blur-2xl border border-cyan-500/30 rounded-2xl"
      style={{ boxShadow: '0 0 40px rgba(34, 211, 238, 0.25), inset 0 1px 0 rgba(34, 211, 238, 0.2), inset 0 -1px 0 rgba(0, 0, 0, 0.2)' }}
    >
      <div className="max-w-full mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex justify-between items-center h-20">
          {/* Logo with Larger Font */}
          <motion.div 
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="flex-shrink-0 flex items-center mr-[50px]"
          >
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <motion.div 
                  whileHover={{ rotate: 5 }}
                  className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center transition-all duration-300 group-hover:shadow-lg border border-cyan-300/50"
                  style={{ boxShadow: '0 0 20px rgba(34, 211, 238, 0.3)' }}
                >
                  <span className="text-white font-bold text-lg">C</span>
                </motion.div>
              </div>
              <div className="flex flex-col">
                <motion.span 
                  className="text-xl font-bold text-white tracking-tight"
                  whileHover={{ x: 2 }}
                >
                  CivicSolver
                </motion.span>
                <span className="text-xs font-medium text-cyan-300 tracking-wide mt-0.5">
                  AI-Powered Civic Platform
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation - All items visible */}
          <div className="hidden lg:flex items-center space-x-2">
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex items-center space-x-2"
            >
              {navItems[userType].map((item, index) => {
                const isActive = location.pathname === item.path;
                return (
                  <motion.div
                    key={item.name}
                    variants={itemVariants}
                    whileHover={{ y: -2 }}
                    whileTap={{ y: 0 }}
                    custom={index}
                  >
                    <Link
                      to={item.path}
                      className={`relative flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 group ${
                        isActive
                          ? 'text-cyan-300'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      <item.icon className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:scale-110" />
                      {item.name}
                      
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                    </Link>
                  </motion.div>
                );
              })}

              {/* Logout Button */}
              {(user || officer) && (
                <motion.button
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, x: 2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 transition-all duration-300"
                >
                  <ArrowRightOnRectangleIcon className="w-4 h-4 mr-2" />
                  Logout
                </motion.button>
              )}
            </motion.div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-4">
            {(user || officer) && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hidden sm:block text-sm font-bold px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 backdrop-blur-sm border border-cyan-500/30"
              >
                {user ? user.name.split(' ')[0] : officer ? `Officer` : ''}
              </motion.div>
            )}
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2.5 rounded-lg bg-slate-700/40 text-cyan-300 hover:bg-slate-600/40 hover:text-cyan-200 transition-all duration-300 border border-cyan-500/20 backdrop-blur-sm"
            >
              {isOpen ? (
                <XMarkIcon className="h-5 w-5" />
              ) : (
                <Bars3Icon className="h-5 w-5" /> 
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Enhanced Mobile Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-lg lg:hidden z-40"
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed top-24 right-4 w-80 z-50 lg:hidden bg-gradient-to-b from-slate-900/50 to-slate-950/60 shadow-2xl border border-cyan-500/30 rounded-2xl backdrop-blur-2xl"
            >
              {/* Mobile Header */}
              <div className="px-6 py-4 flex items-center justify-between bg-gradient-to-r from-slate-900/40 via-slate-800/30 to-slate-900/40 border-b border-cyan-500/20 rounded-t-2xl">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center border border-cyan-300/50"
                    style={{ boxShadow: '0 0 15px rgba(34, 211, 238, 0.3)' }}>
                    <span className="text-white font-bold text-sm">C</span>
                  </div>
                  <div className="text-white">
                    <div className="font-bold text-lg">CivicSolver</div>
                    <div className="text-xs text-cyan-300 mt-0">Platform</div>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg text-cyan-300 hover:bg-slate-700/60 hover:text-cyan-200 transition-all duration-200"
                >
                  <XMarkIcon className="h-6 w-6" />
                </motion.button>
              </div>

              {/* User Info Section */}
              {(user || officer) && (
                <div className="px-6 py-4 border-b border-cyan-500/20 bg-slate-800/40">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-cyan-500/20 border border-cyan-500/30">
                      {userType === 'user' ? (
                        <UserCircleIcon className="w-6 h-6 text-cyan-300" />
                      ) : (
                        <IdentificationIcon className="w-6 h-6 text-cyan-300" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-white text-sm">
                        {user ? user.name : officer ? `Officer ${officer.name}` : ''}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {userType === 'user' ? 'Citizen Account' : 'Municipal Officer'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Mobile Menu Items */}
              <div className="px-4 py-5 h-full flex flex-col">
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex-1 space-y-2" 
                >
                  {navItems[userType].map((item, index) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <motion.div
                        key={item.name}
                        variants={itemVariants}
                        whileHover={{ x: 5 }}
                        custom={index}
                      >
                        <Link
                          to={item.path}
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 group ${
                            isActive
                              ? 'text-cyan-300 bg-cyan-500/20 border border-cyan-500/40 backdrop-blur-sm'
                              : 'text-slate-300 hover:text-white hover:bg-slate-700/30 border border-transparent backdrop-blur-sm'
                          }`}
                        >
                          <item.icon className="w-5 h-5 mr-3 transition-transform duration-300 group-hover:scale-110" />
                          {item.name}
                          {isActive && (
                            <motion.div
                              layoutId="mobileActiveIndicator"
                              className="ml-auto w-2 h-2 bg-cyan-400 rounded-full"
                            />
                          )}
                        </Link>
                      </motion.div>
                    );
                  })}
                </motion.div>

                {/* Mobile Logout Button */}
                {(user || officer) && (
                  <motion.button
                    variants={itemVariants}
                    onClick={handleLogout}
                    className="flex items-center justify-center w-full px-4 py-3 mt-6 rounded-lg text-sm font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-all duration-300 border border-red-500/30 backdrop-blur-sm"
                  >
                    <ArrowRightOnRectangleIcon className="w-5 h-5 mr-2" />
                    Sign Out
                  </motion.button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Custom CSS for glassmorphism glow effects */}
      <style>{`
        @keyframes glow-pulse {
          0%, 100% {
            box-shadow: 0 0 40px rgba(34, 211, 238, 0.25), inset 0 1px 0 rgba(34, 211, 238, 0.2), inset 0 -1px 0 rgba(0, 0, 0, 0.2);
          }
          50% {
            box-shadow: 0 0 60px rgba(34, 211, 238, 0.4), inset 0 1px 0 rgba(34, 211, 238, 0.25), inset 0 -1px 0 rgba(0, 0, 0, 0.3);
          }
        }
        
        nav {
          animation: glow-pulse 3s ease-in-out infinite;
        }
      `}</style>
    </motion.nav>
  );
};

export default Navbar;