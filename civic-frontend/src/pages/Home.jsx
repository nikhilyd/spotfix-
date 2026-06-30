/* eslint-disable no-unused-vars */
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  WrenchScrewdriverIcon, 
  ClockIcon, 
  ChatBubbleLeftRightIcon, 
  MapPinIcon, 
  ArrowPathIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  DocumentChartBarIcon,
  CheckBadgeIcon,
  RocketLaunchIcon,
  SparklesIcon,
  EyeIcon,
  ChartPieIcon,
  CogIcon,
  UsersIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { UserContext } from '../context/user.context';
import { OfficerContext } from '../context/officer.context';

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const { officer } = useContext(OfficerContext);

  const userType = user ? 'user' : officer ? 'officer' : 'guest';

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  // User-specific content
  const getUserSpecificContent = () => {
    if (user) {
      return {
        heroTitle: "Welcome Back!",
        heroSubtitle: `${user.name || 'Valued Citizen'}`,
        description: "Continue making your community better with AI-powered civic solutions.",
        primaryButton: "Report New Issue",
        primaryLink: "/complaint",
        secondaryButton: "View My Complaints", 
        secondaryLink: "/usercomplaint",
        gradient: "from-blue-600 via-purple-600 to-indigo-700",
        features: [
          {
            icon: <RocketLaunchIcon className="w-12 h-12" />,
            title: "Quick Issue Reporting",
            description: "Report civic issues in under 2 minutes with our smart form."
          },
          {
            icon: <EyeIcon className="w-12 h-12" />,
            title: "Track Resolution Status",
            description: "Real-time updates on your complaint progress and ETA."
          },
          {
            icon: <ChartPieIcon className="w-12 h-12" />,
            title: "Personal Dashboard",
            description: "View all your complaints and resolution history in one place."
          }
        ]
      };
    } else if (officer) {
      return {
        heroTitle: "Officer Dashboard",
        heroSubtitle: `Officer ${officer.name || ''}`,
        description: "Efficiently manage and resolve civic issues with AI assistance.",
        primaryButton: "View Complaints",
        primaryLink: "/complaintpage",
        secondaryButton: "Worker Management",
        secondaryLink: "/worker",
        gradient: "from-amber-600 via-orange-600 to-red-600",
        features: [
          {
            icon: <CogIcon className="w-12 h-12" />,
            title: "Smart Complaint Management",
            description: "AI-powered prioritization and assignment of civic issues."
          },
          {
            icon: <UsersIcon className="w-12 h-12" />,
            title: "Team Coordination",
            description: "Efficiently manage field workers and task assignments."
          },
          {
            icon: <DocumentTextIcon className="w-12 h-12" />,
            title: "Analytics & Reports",
            description: "Detailed insights and performance metrics for your department."
          }
        ]
      };
    } else {
      return {
        heroTitle: "AI-Powered Civic Solutions",
        heroSubtitle: "Smart Community Platform",
        description: "Transforming how communities report and resolve civic issues with artificial intelligence.",
        primaryButton: "Report an Issue",
        primaryLink: "/complaint",
        secondaryButton: "Learn More",
        secondaryLink: "/about",
        gradient: "from-teal-600 via-cyan-600 to-blue-700",
        features: [
          {
            icon: <WrenchScrewdriverIcon className="w-12 h-12" />,
            title: "Quick Issue Resolution",
            description: "AI-powered routing to appropriate departments for faster resolution."
          },
          {
            icon: <ClockIcon className="w-12 h-12" />,
            title: "24/7 Availability",
            description: "Report issues anytime, anywhere with our always-available platform."
          },
          {
            icon: <ChatBubbleLeftRightIcon className="w-12 h-12" />,
            title: "AI Assistant Support",
            description: "Instant help from our AI assistant for guidance and updates."
          }
        ]
      };
    }
  };

  const content = getUserSpecificContent();

  // Stats data with user-specific numbers
  const stats = user ? [
    { value: "15", label: "Your Reports", icon: <DocumentTextIcon className="w-8 h-8" /> },
    { value: "12", label: "Issues Resolved", icon: <CheckBadgeIcon className="w-8 h-8" /> },
    { value: "95%", label: "Satisfaction Rate", icon: <ChartBarIcon className="w-8 h-8" /> },
    { value: "2.5h", label: "Avg. Response Time", icon: <ClockIcon className="w-8 h-8" /> }
  ] : officer ? [
    { value: "248", label: "Active Cases", icon: <DocumentTextIcon className="w-8 h-8" /> },
    { value: "92%", label: "Resolution Rate", icon: <CheckBadgeIcon className="w-8 h-8" /> },
    { value: "15", label: "Team Workers", icon: <UserGroupIcon className="w-8 h-8" /> },
    { value: "4.2★", label: "Performance", icon: <ChartBarIcon className="w-8 h-8" /> }
  ] : [
    { value: "10,000+", label: "Issues Resolved", icon: <CheckBadgeIcon className="w-8 h-8" /> },
    { value: "95%", label: "Satisfaction Rate", icon: <ChartBarIcon className="w-8 h-8" /> },
    { value: "2.5h", label: "Avg. Response Time", icon: <ClockIcon className="w-8 h-8" /> },
    { value: "50+", label: "Cities Served", icon: <MapPinIcon className="w-8 h-8" /> }
  ];

  // How it works steps based on user type
  const getSteps = () => {
    if (user) {
      return [
        {
          number: 1,
          title: "Report Issue",
          description: "Use our simple form with photo upload and location detection.",
          icon: <DocumentTextIcon className="w-8 h-8" />
        },
        {
          number: 2,
          title: "Track Progress",
          description: "Real-time updates and estimated resolution time from our AI.",
          icon: <ArrowPathIcon className="w-8 h-8" />
        },
        {
          number: 3,
          title: "Get Resolved",
          description: "Receive confirmation when your civic issue is successfully resolved.",
          icon: <CheckBadgeIcon className="w-8 h-8" />
        }
      ];
    } else if (officer) {
      return [
        {
          number: 1,
          title: "Review Complaints",
          description: "AI-prioritized list of civic issues requiring your attention.",
          icon: <EyeIcon className="w-8 h-8" />
        },
        {
          number: 2,
          title: "Assign Tasks",
          description: "Efficiently assign issues to field workers with smart scheduling.",
          icon: <UsersIcon className="w-8 h-8" />
        },
        {
          number: 3,
          title: "Monitor Progress",
          description: "Track resolution progress and generate performance reports.",
          icon: <ChartBarIcon className="w-8 h-8" />
        }
      ];
    } else {
      return [
        {
          number: 1,
          title: "Report the Issue",
          description: "Use our simple form to report any civic issue with details and photos.",
          icon: <DocumentTextIcon className="w-8 h-8" />
        },
        {
          number: 2,
          title: "AI Analysis & Routing",
          description: "Our AI system analyzes and routes your complaint to the right department.",
          icon: <CogIcon className="w-8 h-8" />
        },
        {
          number: 3,
          title: "Resolution & Feedback",
          description: "Track resolution progress and provide feedback once resolved.",
          icon: <CheckBadgeIcon className="w-8 h-8" />
        }
      ];
    }
  };

  const steps = getSteps();

  // Additional features for all users
  const additionalFeatures = [
    {
      icon: <MapPinIcon className="w-10 h-10" />,
      title: "Location-Based Services",
      description: "Automatic location detection for precise issue reporting and tracking."
    },
    {
      icon: <ShieldCheckIcon className="w-10 h-10" />,
      title: "Secure Platform",
      description: "Military-grade encryption to protect your data and privacy."
    },
    {
      icon: <SparklesIcon className="w-10 h-10" />,
      title: "AI-Powered Analytics",
      description: "Smart insights and predictive analysis for better civic management."
    }
  ];

  const handleButtonClick = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900" style={{
      '--glow-purple': '0 0 40px rgba(168, 85, 247, 0.3)',
      '--glow-cyan': '0 0 40px rgba(34, 211, 238, 0.2)',
      '--glow-blue': '0 0 40px rgba(59, 130, 246, 0.3)'
    }}>
      {/* Enhanced Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        {/* Animated Background with Glow */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 left-0 w-72 h-72 bg-blue-600/15 rounded-full blur-3xl"></div>
        </div>
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: '50px 50px'
        }}></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, type: "spring" }}
            className="text-center"
          >
            {/* Welcome Badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 backdrop-blur-xl rounded-full mb-8 border border-purple-500/30"
              style={{ boxShadow: 'var(--glow-purple)' }}
            >
              <SparklesIcon className="w-4 h-4 text-purple-400 mr-2" />
              <span className="text-cyan-300 font-semibold text-sm">
                {user ? 'Citizen Portal' : officer ? 'Officer Dashboard' : 'Community Platform'}
              </span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 leading-tight">
              {content.heroTitle}
              <motion.span 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="block text-2xl md:text-4xl bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mt-3 font-light"
              >
                {content.heroSubtitle}
              </motion.span>
            </h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-lg text-slate-300 max-w-3xl mx-auto mb-12 leading-relaxed"
            >
              {content.description}
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row justify-center gap-6 mb-20"
            >
              <motion.button
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 0 30px rgba(168, 85, 247, 0.5)"
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleButtonClick(content.primaryLink)}
                className="px-10 py-4 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-xl font-bold text-base transition-all duration-300 flex items-center justify-center group border border-purple-400/30 hover:border-purple-400/60"
              >
                {content.primaryButton}
                <RocketLaunchIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              
              <motion.button
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 0 30px rgba(34, 211, 238, 0.4)"
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleButtonClick(content.secondaryLink)}
                className="px-10 py-4 bg-transparent border-2 border-cyan-400/40 text-cyan-300 rounded-xl font-bold text-base backdrop-blur-xl hover:bg-cyan-400/10 hover:border-cyan-400/80 transition-all duration-300"
              >
                {content.secondaryButton}
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Enhanced Stats Card */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="bg-slate-950/80 backdrop-blur-3xl rounded-[32px] border border-white/10 p-6 md:p-8"
            style={{ boxShadow: '0 40px 120px rgba(0,0,0,0.35)' }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {stats.map((stat, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.45, delay: 1.1 + index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="relative overflow-hidden rounded-[28px] border border-white/10 bg-slate-900/75 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.55)] transition-all duration-300"
                >
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-400 via-slate-300 to-purple-500 opacity-80"></div>
                  <div className="relative z-10 flex flex-col items-center justify-center gap-4 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 border border-white/10 text-cyan-300 shadow-lg shadow-cyan-500/10">
                      {stat.icon}
                    </div>
                    <div className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                      {stat.value}
                    </div>
                    <div className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
                      {stat.label}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* User-Specific Features Section */}
      <section className="py-24 bg-gradient-to-b from-slate-900/50 to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {user ? 'Your Civic Tools' : officer ? 'Officer Management Features' : 'Why Choose CivicSolver?'}
            </h2>
            <p className="text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
              {user ? 'Everything you need to effectively report and track civic issues in your community.' 
               : officer ? 'Powerful tools to efficiently manage civic issues and coordinate your team.'
               : 'Experience the future of civic issue resolution with our AI-powered platform.'}
            </p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {content.features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ 
                  y: -12,
                  scale: 1.02
                }}
                className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-white/10 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.3)] backdrop-blur-xl transition-all duration-500 hover:border-cyan-300/30 hover:bg-white/20"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-slate-950/10 opacity-80"></div>
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 opacity-80"></div>
                
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-3xl bg-white/15 border border-white/15 flex items-center justify-center mb-6 text-cyan-300 shadow-lg shadow-cyan-500/10 transition-all duration-300 group-hover:bg-white/25 group-hover:text-cyan-200">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-slate-200 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 relative overflow-hidden">
        {/* Background Glow Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-1/2 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: '50px 50px'
        }}></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {user ? 'How It Works for You' : officer ? 'Your Workflow' : 'Simple 3-Step Process'}
            </h2>
            <p className="text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
              {user ? 'From reporting to resolution - see how easy it is to make a difference' 
               : officer ? 'Streamlined process for efficient civic issue management'
               : 'Get started in minutes and see real results in your community'}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting Line with gradient */}
            <div className="hidden md:block absolute top-32 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
            
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -12 }}
                className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/10 p-8 text-center shadow-[0_24px_80px_rgba(15,23,42,0.3)] backdrop-blur-xl transition-all duration-300 hover:border-cyan-300/30 hover:bg-white/20"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/15 via-transparent to-slate-950/10"></div>
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 opacity-90"></div>

                <div className="relative z-10">
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-14 h-14 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 shadow-lg shadow-cyan-500/20 border border-white/20 flex items-center justify-center text-white font-bold">
                    {step.number}
                  </div>

                  <div className="text-cyan-300 mb-8 mt-4 flex justify-center transition-colors duration-300">
                    {step.icon}
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-4">{step.title}</h3>
                  <p className="text-slate-200 leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="py-24 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Advanced Features</h2>
            <p className="text-lg text-slate-300 max-w-3xl mx-auto">
              Powered by cutting-edge technology for the best civic experience
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {additionalFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                whileHover={{ y: -8 }}
                className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-white/10 p-8 text-center shadow-[0_24px_80px_rgba(15,23,42,0.25)] backdrop-blur-xl transition-all duration-300 hover:border-cyan-300/30 hover:bg-white/20"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/10 via-transparent to-slate-950/20"></div>
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 opacity-80"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-3xl bg-white/15 border border-white/15 flex items-center justify-center mx-auto mb-6 text-cyan-300 shadow-lg shadow-cyan-500/10 transition-all duration-300 group-hover:bg-white/25 group-hover:text-cyan-200">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-4">{feature.title}</h3>
                  <p className="text-slate-200 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-24 bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 relative overflow-hidden">
        {/* Glow elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {user ? 'Ready to Report Another Issue?' 
               : officer ? 'Start Managing Complaints?'
               : 'Ready to Transform Your Community?'}
            </h2>
            <p className="text-lg text-slate-300 max-w-3xl mx-auto mb-12 leading-relaxed">
              {user ? 'Join thousands of citizens making their communities better every day.'
               : officer ? 'Efficiently manage civic issues with our AI-powered platform.'
               : 'Experience the future of civic issue resolution today.'}
            </p>
            
            <motion.button
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 0 40px rgba(168, 85, 247, 0.6)"
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleButtonClick(content.primaryLink)}
              className="px-12 py-4 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-xl font-bold text-base transition-all duration-300 inline-flex items-center group border border-purple-400/30 hover:border-purple-400/60"
            >
              {content.primaryButton}
              <RocketLaunchIcon className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
            </motion.button>
            
            <p className="mt-8 text-slate-400 text-base">
              {user ? 'Your previous issues: 12 resolved • 3 in progress' 
               : officer ? 'Active cases: 248 • Team performance: 92%'
               : 'No registration required • Completely free to use'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Custom CSS for glow effects */}
      <style>{`
        @keyframes glow-pulse {
          0%, 100% {
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        .animate-pulse {
          animation: glow-pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .glow-effect {
          box-shadow: 0 0 20px rgba(168, 85, 247, 0.4),
                      0 0 40px rgba(168, 85, 247, 0.2);
        }
      `}</style>
    </div>
  );
};

export default HomePage;