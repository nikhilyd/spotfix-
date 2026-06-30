/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/user.context";
import { Socketcontext } from "../context/socket";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiFilter,
  HiRefresh,
  HiClock,
  HiUser,
  HiLocationMarker,
  HiExclamation,
  HiCheckCircle,
  HiUserCircle,
  HiCalendar,
  HiTrendingUp,
  HiTrash
} from "react-icons/hi";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
};

const cardVariants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
};

export const UserComplaintpage = () => {
  const [complaints, setComplaints] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ total: 0, pending: 0, assigned: 0, resolved: 0 });
  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  
  const data = useContext(UserContext);
  const { sendmessage, getmessage } = useContext(Socketcontext);

  useEffect(() => {
    console.log(data.user._id);
    sendmessage("join", {
      userType: "user",
      userId: data.user._id
    });
    
    getmessage("complaint-come", (complaint) => {
      setComplaints(prev => [...prev, complaint]);
      calculateStats([...complaints, complaint]);
    });
    
    try {
      axios.get(`${import.meta.env.VITE_API_URL}/complaint/usercomplaint/?id=${data.user._id}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`
        }
      }).then((response) => {
        setComplaints(response.data.complaint);
        calculateStats(response.data.complaint);
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  const calculateStats = (complaintsData) => {
    const total = complaintsData.length;
    const pending = complaintsData.filter(c => c.status === "Pending").length;
    const assigned = complaintsData.filter(c => c.status === "Assigned").length;
    const resolved = complaintsData.filter(c => c.status === "Resolved").length;
    
    setStats({ total, pending, assigned, resolved });
  };

  const [deleting, setDeleting] = useState(null);

  const handleDelete = async (complaintId) => {
    if (!window.confirm('Are you sure you want to delete this complaint?')) return;
    setDeleting(complaintId);
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/complaint/delete/${complaintId}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`
        }
      });
      setComplaints(prev => prev.filter(c => c._id !== complaintId));
      calculateStats(complaints.filter(c => c._id !== complaintId));
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete complaint');
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} days ago`;
    }
  };

  const getProgressStatus = (status) => {
    switch(status) {
      case "Pending":
        return { reported: true, assigned: false, resolved: false, width: "33%" };
      case "Assigned":
        return { reported: true, assigned: true, resolved: false, width: "66%" };
      case "Resolved":
        return { reported: true, assigned: true, resolved: true, width: "100%" };
      default:
        return { reported: false, assigned: false, resolved: false, width: "0%" };
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case "Pending":
        return { icon: "⏳", color: "yellow", bg: "from-yellow-400 to-orange-400" };
      case "Assigned":
        return { icon: "👷", color: "blue", bg: "from-blue-400 to-indigo-400" };
      case "Resolved":
        return { icon: "✅", color: "green", bg: "from-green-400 to-teal-400" };
      default:
        return { icon: "📋", color: "gray", bg: "from-gray-400 to-gray-500" };
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case "garbage":
        return "🗑️";
      case "pothole":
        return "🕳️";
      case "water":
        return "💧";
      default:
        return "📌";
    }
  };

  const getSeverityColor = (severity) => {
    switch(severity) {
      case "high":
        return "text-red-400 bg-red-900/30 border-red-600/50";
      case "medium":
        return "text-yellow-400 bg-yellow-900/30 border-yellow-600/50";
      case "low":
        return "text-green-400 bg-green-900/30 border-green-600/50";
      default:
        return "text-gray-400 bg-gray-900/30 border-gray-600/50";
    }
  };

  const filteredComplaints = complaints.filter(complaint => {
    const statusMatch = statusFilter === 'all' || complaint.status.toLowerCase() === statusFilter;
    const typeMatch = typeFilter === 'all' || complaint.problem_type === typeFilter;
    return statusMatch && typeMatch;
  });

  const resetFilters = () => {
    setStatusFilter('all');
    setTypeFilter('all');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 pt-36 pb-8 px-4 md:px-6 relative">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header with Title and User Card */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              My Complaints
            </h1>
            <p className="text-gray-400">
              Track and manage your submitted complaints
            </p>
          </div>
          
          {/* User Info Card - Top Right */}
          <div className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl p-4 shadow-lg flex items-center space-x-4 w-full md:w-auto md:ml-auto">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-cyan-600 font-bold text-xl">
              {data.user?.name?.charAt(0) || "N"}
            </div>
            <div>
              <p className="font-bold text-white">{data.user?.name || "User"}</p>
              <p className="text-sm text-gray-100">{data.user?.email || "user@example.com"}</p>
            </div>
          </div>
        </motion.div>

        {/* Statistics Cards */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {/* Total Complaints */}
          <motion.div variants={itemVariants} className="bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/10">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-400 mb-2">Total Complaints</p>
                <p className="text-4xl font-bold text-white">{stats.total}</p>
              </div>
              <div className="w-10 h-10 bg-cyan-500/30 rounded-lg flex items-center justify-center">
                <span className="text-lg">📋</span>
              </div>
            </div>
            <div className="mt-3 h-1 bg-gradient-to-r from-cyan-500 to-cyan-300 rounded-full opacity-40"></div>
          </motion.div>
          
          {/* Pending */}
          <motion.div variants={itemVariants} className="bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/10">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-400 mb-2">Pending</p>
                <p className="text-4xl font-bold text-yellow-400">{stats.pending}</p>
              </div>
              <div className="w-10 h-10 bg-yellow-500/30 rounded-lg flex items-center justify-center">
                <span className="text-lg">⏳</span>
              </div>
            </div>
            <div className="mt-3 h-1 bg-gradient-to-r from-yellow-500 to-yellow-300 rounded-full opacity-40"></div>
          </motion.div>
          
          {/* Assigned */}
          <motion.div variants={itemVariants} className="bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/10">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-400 mb-2">Assigned</p>
                <p className="text-4xl font-bold text-blue-400">{stats.assigned}</p>
              </div>
              <div className="w-10 h-10 bg-blue-500/30 rounded-lg flex items-center justify-center">
                <span className="text-lg">👤</span>
              </div>
            </div>
            <div className="mt-3 h-1 bg-gradient-to-r from-blue-500 to-blue-300 rounded-full opacity-40"></div>
          </motion.div>
          
          {/* Resolved */}
          <motion.div variants={itemVariants} className="bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/10">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-400 mb-2">Resolved</p>
                <p className="text-4xl font-bold text-green-400">{stats.resolved}</p>
              </div>
              <div className="w-10 h-10 bg-green-500/30 rounded-lg flex items-center justify-center">
                <span className="text-lg">✅</span>
              </div>
            </div>
            <div className="mt-3 h-1 bg-gradient-to-r from-green-500 to-green-300 rounded-full opacity-40"></div>
          </motion.div>
        </motion.div>

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Filters */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/10 sticky top-40">
              <h2 className="text-lg font-bold text-white mb-6 flex items-center">
                <HiFilter className="w-5 h-5 mr-2 text-cyan-400" />
                Filters
              </h2>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm text-gray-400 mb-2">Search Complaint</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by title or ID..."
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2">🔍</span>
                </div>
              </div>

              {/* Status */}
              <div className="mb-6">
                <label className="block text-sm text-gray-400 mb-2">Status</label>
                <select
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all" className="bg-slate-950">All Statuses</option>
                  <option value="pending" className="bg-slate-950">Pending</option>
                  <option value="assigned" className="bg-slate-950">Assigned</option>
                  <option value="resolved" className="bg-slate-950">Resolved</option>
                </select>
              </div>

              {/* Category */}
              <div className="mb-6">
                <label className="block text-sm text-gray-400 mb-2">Category</label>
                <select
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option value="all" className="bg-slate-950">All Types</option>
                  <option value="garbage" className="bg-slate-950">Garbage</option>
                  <option value="pothole" className="bg-slate-950">Pothole</option>
                  <option value="water" className="bg-slate-950">Water Issue</option>
                </select>
              </div>

              {/* Date Range */}
              <div className="mb-6">
                <label className="block text-sm text-gray-400 mb-2">Date Range</label>
                <input
                  type="date"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              {/* Reset Button */}
              <button
                onClick={resetFilters}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-all duration-300 flex items-center justify-center"
              >
                <HiRefresh className="w-4 h-4 mr-2" />
                Reset Filters
              </button>
            </div>
          </motion.div>

          {/* Right Content - Complaints List */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3"
          >

            {/* Tabs and Sort */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-6 border-b border-white/20">
              <div className="flex gap-4">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-4 py-2 font-semibold transition-all duration-300 ${
                    activeTab === 'all'
                      ? 'text-cyan-400 border-b-2 border-cyan-400'
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                >
                  ✓ All Complaints
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`px-4 py-2 font-semibold transition-all duration-300 ${
                    activeTab === 'history'
                      ? 'text-cyan-400 border-b-2 border-cyan-400'
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                >
                  ⏱️ History
                </button>
              </div>
              
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-400">Sort by:</label>
                <select
                  className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest" className="bg-slate-950">Newest First</option>
                  <option value="oldest" className="bg-slate-950">Oldest First</option>
                  <option value="status" className="bg-slate-950">By Status</option>
                </select>
              </div>
            </div>

            {/* Results Count */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-gray-300 font-semibold">
                {filteredComplaints.length} Complaint{filteredComplaints.length !== 1 ? 's' : ''} Found
              </h3>
            </div>

            {/* Complaints Grid or Empty State */}
            <AnimatePresence>
              {filteredComplaints.length > 0 ? (
                <motion.div 
                  layout
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  {filteredComplaints.map((complaint, index) => {
                    const progress = getProgressStatus(complaint.status);
                    const statusInfo = getStatusIcon(complaint.status);
                    
                    return (
                        <motion.div
                          key={complaint._id}
                          variants={cardVariants}
                          layout
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          transition={{ delay: index * 0.1 }}
                          className="bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group border border-white/10"
                        >
                        {/* Status Badge */}
                        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold text-white z-10 shadow-lg bg-gradient-to-r ${statusInfo.bg}`}>
                          <span className="mr-1">{statusInfo.icon}</span> {complaint.status}
                        </div>
                        
                        {/* Delete Button */}
                        <button
                          onClick={() => handleDelete(complaint._id)}
                          disabled={deleting === complaint._id}
                          className="absolute top-4 left-4 z-10 w-8 h-8 bg-red-500/80 hover:bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-200 disabled:opacity-50"
                        >
                          {deleting === complaint._id ? (
                            <span className="text-xs animate-spin">⏳</span>
                          ) : (
                            <HiTrash className="w-4 h-4" />
                          )}
                        </button>
                        
                        {/* Image Section */}
                        <div className="h-40 overflow-hidden relative">
                          {complaint.media ? (
                            <img 
                              src={complaint.media} 
                              alt={complaint.title || complaint.problem_type}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                              <span className="text-5xl opacity-40">{getTypeIcon(complaint.problem_type)}</span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                          <div className="absolute bottom-3 left-4 flex items-center">
                            <span className="text-xl mr-2">{getTypeIcon(complaint.problem_type)}</span>
                            <span className="text-white font-semibold capitalize text-sm">{complaint.problem_type}</span>
                          </div>
                        </div>
                        
                        {/* Content Section */}
                        <div className="p-4">
                          <h2 className="text-lg font-bold text-gray-100 mb-1 line-clamp-1">{complaint.title || "Untitled Complaint"}</h2>
                          <p className="text-gray-400 text-xs mb-3 flex items-center">
                            <HiLocationMarker className="w-3 h-3 mr-1" />
                            {complaint.address}
                          </p>
                          
                          <p className="text-gray-300 text-sm mb-3 line-clamp-2">{complaint.description}</p>
                          
                          {/* Meta Info */}
                          <div className="grid grid-cols-2 gap-2 mb-3">
                            <div className="bg-slate-700/60 rounded-lg p-2 border border-white/10">
                              <p className="text-xs text-gray-500">Severity</p>
                              <span className={`text-xs font-semibold ${getSeverityColor(complaint.severity_level)}`}>
                                {complaint.severity_level}
                              </span>
                            </div>
                            <div className="bg-slate-700/60 rounded-lg p-2 border border-white/10">
                              <p className="text-xs text-gray-500">Department</p>
                              <p className="text-xs font-semibold text-gray-300 capitalize">{complaint.department.replace('_', ' ')}</p>
                            </div>
                          </div>
                          
                          {/* Progress Bar */}
                          <div className="mb-3">
                            <div className="flex justify-between text-xs text-gray-400 mb-2">
                              <span className={progress.reported ? "text-green-400 font-semibold" : ""}>Reported</span>
                              <span className={progress.assigned ? "text-green-400 font-semibold" : ""}>Assigned</span>
                              <span className={progress.resolved ? "text-green-400 font-semibold" : ""}>Resolved</span>
                            </div>
                            
                            <div className="relative">
                              <div className="absolute top-2 left-0 right-0 h-1 bg-white/10 rounded-full"></div>
                              
                              <div 
                                className={`absolute top-2 left-0 h-1 rounded-full transition-all duration-500 ${
                                  complaint.status === 'Pending' ? 'bg-yellow-500' :
                                  complaint.status === 'Assigned' ? 'bg-blue-500' :
                                  'bg-green-500'
                                }`}
                                style={{ width: progress.width }}
                              ></div>
                              
                              <div className="relative flex justify-between">
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold z-10 ${
                                  progress.reported ? 'bg-green-500 text-white shadow-lg' : 'bg-white/20 text-gray-400'
                                }`}>
                                  1
                                </div>
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold z-10 ${
                                  progress.assigned ? 'bg-green-500 text-white shadow-lg' : 'bg-white/20 text-gray-400'
                                }`}>
                                  2
                                </div>
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold z-10 ${
                                  progress.resolved ? 'bg-green-500 text-white shadow-lg' : 'bg-white/20 text-gray-400'
                                }`}>
                                  3
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Footer */}
                        <div className="px-4 py-3 bg-slate-700/50 flex justify-between items-center border-t border-white/10">
                          <div className="flex items-center">
                            <div className="w-7 h-7 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2">
                              {data.user?.name?.charAt(0) || "U"}
                            </div>
                            <span className="text-xs font-medium text-gray-300">
                              {data.user?.name || "User"}
                            </span>
                          </div>
                          <div className="flex items-center text-xs text-gray-500">
                            <HiCalendar className="w-3 h-3 mr-1" />
                            {formatDate(complaint.createdAt)}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-20 bg-slate-800/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/10"
                >
                  <div className="text-7xl mb-4">📁</div>
                  <h3 className="text-2xl font-bold text-white mb-2">No complaints found</h3>
                  <p className="text-gray-400 mb-6">You haven't submitted any complaints yet.</p>
                  <button 
                    className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl hover:from-cyan-700 hover:to-blue-700 transition-all duration-300 font-semibold"
                    onClick={resetFilters}
                  >
                    + File Your First Complaint
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
};