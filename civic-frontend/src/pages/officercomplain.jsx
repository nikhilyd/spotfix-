/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from "react";
import { OfficerContext } from "../context/officer.context";
import { Socketcontext } from "../context/socket";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { HiFilter, HiRefresh, HiClock } from "react-icons/hi";

export const Complaintpage = () => {
  const [complaints, setComplaints] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [workers, setWorkers] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showWorkerSidebar, setShowWorkerSidebar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ total: 0, pending: 0, assigned: 0, resolved: 0 });
  
  const data = useContext(OfficerContext);
  const { sendmessage, getmessage } = useContext(Socketcontext);

  useEffect(() => {
    console.log(data.officer._id);
    sendmessage("join", {
      userType: "officer",
      userId: data.officer._id
    });
    
    getmessage("complaint-come", (complaint) => {
      setComplaints(prev => [...prev, complaint]);
    });
    
    try {
      axios.get(`${import.meta.env.VITE_API_URL}/complaint/allcomplaint/?id=${data.officer._id}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('token2'))}`
        }
      }).then((response) => {
        setComplaints(response.data.complaint);
        calculateStats(response.data.complaint);
        console.log(response.data.complaint);
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
        return { reported: true, assigned: false, resolved: false, width: "0%" };
      case "Assigned":
        return { reported: true, assigned: true, resolved: false, width: "50%" };
      case "Resolved":
        return { reported: true, assigned: true, resolved: true, width: "100%" };
      default:
        return { reported: false, assigned: false, resolved: false, width: "0%" };
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case "Pending":
        return "⏳";
      case "Assigned":
        return "👷";
      case "Resolved":
        return "✅";
      default:
        return "📋";
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

  const filteredComplaints = complaints.filter(complaint => {
    const statusMatch = statusFilter === 'all' || complaint.status.toLowerCase() === statusFilter;
    const typeMatch = typeFilter === 'all' || complaint.problem_type === typeFilter;
    return statusMatch && typeMatch;
  });

  const resetFilters = () => {
    setStatusFilter('all');
    setTypeFilter('all');
  };

  const handleAssign = async (complaint) => {
    setLoading(true);
    setSelectedComplaint(complaint);
    
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/worker/getallworker?lat=${complaint.location.lat}&lon=${complaint.location.lon}&department=${complaint.department}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('token2'))}`
          }
        }
      );
      
      console.log(response.data.worker);
      setWorkers(response.data.worker);
      setShowWorkerSidebar(true);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const assignWorkerToComplaint = async (workerId) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/complaint/assignworker`,
        {
          complaint: selectedComplaint,
          worker: workerId
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('token2'))}`
          }
        }
      );
      
      setComplaints(prev => 
        prev.map(comp => 
          comp._id === selectedComplaint._id 
            ? {...comp, status: "Assigned", assignedWorker: workerId._id}
            : comp
        )
      );
      
      setShowWorkerSidebar(false);
      setSelectedComplaint(null);
      alert("Worker assigned successfully!");
    } catch (error) {
      console.log(error);
      alert("Error assigning worker");
    }
  };

  const closeWorkerSidebar = () => {
    setShowWorkerSidebar(false);
    setSelectedComplaint(null);
    setWorkers([]);
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
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
              <span className="w-1 h-10 bg-gradient-to-b from-cyan-400 to-blue-400 rounded mr-3"></span>
              My Complaints
            </h1>
            <p className="text-gray-400">
              Track and manage your submitted complaints
            </p>
          </div>
          
          {/* User Info Card - Top Right */}
          <div className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl p-4 shadow-lg flex items-center space-x-4 w-full md:w-auto md:ml-auto">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-cyan-600 font-bold text-xl">
              {data.officer?.name?.charAt(0) || "N"}
            </div>
            <div>
              <p className="font-bold text-white">{data.officer?.name || "Officer"}</p>
              <p className="text-sm text-gray-100">{data.officer?.email || "officer@example.com"}</p>
            </div>
          </div>
        </motion.div>

        {/* Statistics Cards with Left Borders */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {/* Total Complaints */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/10 border-l-4 border-l-cyan-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-400 mb-2">Total Complaints</p>
                <p className="text-4xl font-bold text-white">{stats.total}</p>
              </div>
              <span className="text-2xl">📋</span>
            </div>
            <div className="mt-4 h-12 bg-gradient-to-r from-cyan-500/20 to-cyan-300/20 rounded flex items-center justify-center">
              <svg className="w-full h-full text-cyan-400 opacity-30" viewBox="0 0 100 40" preserveAspectRatio="none">
                <path d="M0,20 Q10,10 20,20 T40,20 T60,20 T80,20 T100,20" stroke="currentColor" fill="none" strokeWidth="2"/>
              </svg>
            </div>
          </div>
          
          {/* Pending */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/10 border-l-4 border-l-yellow-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-400 mb-2">Pending</p>
                <p className="text-4xl font-bold text-yellow-400">{stats.pending}</p>
              </div>
              <span className="text-2xl">⏳</span>
            </div>
            <div className="mt-4 h-12 bg-gradient-to-r from-yellow-500/20 to-yellow-300/20 rounded flex items-center justify-center">
              <svg className="w-full h-full text-yellow-400 opacity-30" viewBox="0 0 100 40" preserveAspectRatio="none">
                <path d="M0,20 Q10,10 20,20 T40,20 T60,20 T80,20 T100,20" stroke="currentColor" fill="none" strokeWidth="2"/>
              </svg>
            </div>
          </div>
          
          {/* Assigned */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/10 border-l-4 border-l-purple-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-400 mb-2">Assigned</p>
                <p className="text-4xl font-bold text-purple-400">{stats.assigned}</p>
              </div>
              <span className="text-2xl">👤</span>
            </div>
            <div className="mt-4 h-12 bg-gradient-to-r from-purple-500/20 to-purple-300/20 rounded flex items-center justify-center">
              <svg className="w-full h-full text-purple-400 opacity-30" viewBox="0 0 100 40" preserveAspectRatio="none">
                <path d="M0,20 Q10,10 20,20 T40,20 T60,20 T80,20 T100,20" stroke="currentColor" fill="none" strokeWidth="2"/>
              </svg>
            </div>
          </div>
          
          {/* Resolved */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/10 border-l-4 border-l-green-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-400 mb-2">Resolved</p>
                <p className="text-4xl font-bold text-green-400">{stats.resolved}</p>
              </div>
              <span className="text-2xl">✅</span>
            </div>
            <div className="mt-4 h-12 bg-gradient-to-r from-green-500/20 to-green-300/20 rounded flex items-center justify-center">
              <svg className="w-full h-full text-green-400 opacity-30" viewBox="0 0 100 40" preserveAspectRatio="none">
                <path d="M0,20 Q10,10 20,20 T40,20 T60,20 T80,20 T100,20" stroke="currentColor" fill="none" strokeWidth="2"/>
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/10 mb-8"
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <h2 className="text-lg font-bold text-white flex items-center">
              <HiFilter className="w-5 h-5 mr-2 text-cyan-400" />
              Filter Complaints
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <div className="relative">
                <select
                  className="w-full sm:w-40 bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 appearance-none"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all" className="bg-slate-950">All Statuses</option>
                  <option value="pending" className="bg-slate-950">Pending</option>
                  <option value="assigned" className="bg-slate-950">Assigned</option>
                  <option value="resolved" className="bg-slate-950">Resolved</option>
                </select>
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">▼</span>
              </div>
              
              <div className="relative">
                <select
                  className="w-full sm:w-40 bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 appearance-none"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option value="all" className="bg-slate-950">All Types</option>
                  <option value="garbage" className="bg-slate-950">Garbage</option>
                  <option value="pothole" className="bg-slate-950">Pothole</option>
                  <option value="water" className="bg-slate-950">Water Issue</option>
                </select>
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">▼</span>
              </div>
              
              <button
                onClick={resetFilters}
                className="px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all duration-300 shadow-lg flex items-center justify-center font-semibold"
              >
                <HiRefresh className="w-4 h-4 mr-2" />
                Reset Filters
              </button>
            </div>
          </div>
        </motion.div>

        {/* Complaints Count */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-cyan-400 flex items-center">
            <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></span>
            {filteredComplaints.length} Complaint{filteredComplaints.length !== 1 ? 's' : ''} Found
          </h3>
        </div>

        {/* Complaints Grid or Empty State */}
        <AnimatePresence>
          {filteredComplaints.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredComplaints.map((complaint, index) => {
                const progress = getProgressStatus(complaint.status);
                const statusClass = complaint.status.toLowerCase();
                
                return (
                  <motion.div
                    key={complaint._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/10 backdrop-blur-xl border border-white/10 relative rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group"
                  >
                    {/* Status Ribbon */}
                    <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold text-white z-10 shadow-lg ${
                      statusClass === 'pending' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                      statusClass === 'assigned' ? 'bg-gradient-to-r from-purple-500 to-indigo-500' :
                      'bg-gradient-to-r from-green-500 to-teal-500'
                    }`}>
                      <span className="mr-1">{getStatusIcon(complaint.status)}</span> {complaint.status}
                    </div>
                    
                    {/* Image Section */}
                    <div className="h-40 overflow-hidden relative">
                      <img 
                        src={complaint.media} 
                        alt={complaint.problem_type}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
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
                        📍 {complaint.address}
                      </p>
                      
                      <p className="text-gray-300 text-sm mb-3 line-clamp-2">{complaint.description}</p>
                      
                      {/* Meta Info */}
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div className="bg-white/5 rounded-lg p-2 border border-white/10">
                          <p className="text-xs text-gray-500">Severity</p>
                          <span className={`text-xs font-semibold ${
                            complaint.severity_level === 'high' ? 'text-red-400' :
                            complaint.severity_level === 'medium' ? 'text-yellow-400' :
                            'text-green-400'
                          }`}>
                            {complaint.severity_level}
                          </span>
                        </div>
                        <div className="bg-white/5 rounded-lg p-2 border border-white/10">
                          <p className="text-xs text-gray-500">Department</p>
                          <p className="text-xs font-semibold text-gray-300 capitalize">{complaint.department.replace('_', ' ')}</p>
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="mb-3">
                        <div className="flex justify-between text-xs text-gray-400 mb-2">
                          <span>Reported</span>
                          <span>Assigned</span>
                          <span>Resolved</span>
                        </div>
                        
                        <div className="relative">
                          <div className="absolute top-2 left-0 right-0 h-1 bg-white/10 rounded-full"></div>
                          
                          <div 
                            className={`absolute top-2 left-0 h-1 rounded-full transition-all duration-500 ${
                              statusClass === 'pending' ? 'bg-yellow-500' :
                              statusClass === 'assigned' ? 'bg-purple-500' :
                              'bg-green-500'
                            }`}
                            style={{ width: progress.width }}
                          ></div>
                          
                          <div className="relative flex justify-between">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold z-10 ${
                              progress.reported ? 'bg-green-500 text-white shadow-lg' : 'bg-white/20 text-gray-400'
                            }`}>
                            </div>
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold z-10 ${
                              progress.assigned ? 'bg-green-500 text-white shadow-lg' : 'bg-white/20 text-gray-400'
                            }`}>
                            </div>
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold z-10 ${
                              progress.resolved ? 'bg-green-500 text-white shadow-lg' : 'bg-white/20 text-gray-400'
                            }`}>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Action Button */}
                      {complaint.status === "Pending" && (
                        <button 
                          onClick={() => handleAssign(complaint)}
                          className="w-full py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all duration-300 shadow-lg text-sm font-semibold"
                          disabled={loading}
                        >
                          {loading && selectedComplaint?._id === complaint._id ? (
                            <span className="flex items-center justify-center">
                              <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></span>
                              Assigning...
                            </span>
                          ) : (
                            <span className="flex items-center justify-center">
                              👷 Assign Worker
                            </span>
                          )}
                        </button>
                      )}
                    </div>
                    
                    {/* Footer */}
                    <div className="px-4 py-3 bg-white/5 flex justify-between items-center border-t border-white/10">
                      <div className="flex items-center">
                        <div className="w-7 h-7 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2">
                          {complaint.name?.charAt(0) || "U"}
                        </div>
                        <span className="text-xs font-medium text-gray-300">
                          {complaint.name}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">{formatDate(complaint.createdAt)}</span>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20 bg-white/10 backdrop-blur-xl rounded-2xl shadow-lg border border-white/10"
            >
              <div className="text-7xl mb-4">📭</div>
              <h3 className="text-2xl font-bold text-white mb-2">No complaints found</h3>
              <p className="text-gray-400 mb-6">No complaints match the selected filters.</p>
              <button 
                className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all duration-300 font-semibold"
                onClick={resetFilters}
              >
                <HiRefresh className="w-4 h-4 mr-2 inline" />
                Reset Filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Worker Assignment Sidebar */}
      {showWorkerSidebar && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-end z-50 transition-opacity duration-300">
          <div className="bg-slate-900 border border-white/10 w-full max-w-md h-full overflow-y-auto shadow-2xl transform transition-transform duration-300">
            <div className="sticky top-0 bg-gradient-to-r from-cyan-600 to-blue-600 text-white p-6 border-b border-white/10">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold flex items-center">
                  <span className="mr-2">👷</span> Assign Worker
                </h2>
                <button 
                  onClick={closeWorkerSidebar}
                  className="text-white hover:text-gray-200 p-1 rounded-full bg-white/20"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mt-4 bg-white/10 border border-white/20 rounded-xl p-3">
                <h3 className="font-semibold mb-2 text-white">Complaint Details:</h3>
                <p className="text-sm truncate text-gray-200">{selectedComplaint?.description}</p>
                <div className="flex justify-between mt-2 text-sm text-gray-300">
                  <span>Type: {selectedComplaint?.problem_type}</span>
                  <span>Severity: {selectedComplaint?.severity_level}</span>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center text-cyan-300">
                <span className="mr-2">👥</span> Available Workers
              </h3>
              
              {workers.length > 0 ? (
                <div className="space-y-4">
                  {workers.map(worker => (
                    <div key={worker._id} className="border border-white/10 bg-white/5 rounded-xl p-4 hover:border-cyan-500/50 hover:bg-white/10 transition-all duration-300 hover:shadow-md">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start">
                          <div className="w-12 h-12 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3">
                            {worker.name?.charAt(0) || "W"}
                          </div>
                          <div>
                            <h4 className="font-semibold text-white">{worker.name}</h4>
                            <p className="text-sm text-gray-300 flex items-center">
                              <span className="mr-1">📱</span> {worker.phone}
                            </p>
                            <p className="text-sm text-gray-300 flex items-center">
                              <span className="mr-1">✉️</span> {worker.email}
                            </p>
                            <div className="mt-2 flex flex-wrap gap-1">
                              {worker.skills.map((skill, index) => (
                                <span key={index} className="bg-cyan-600/30 text-cyan-200 text-xs px-2 py-1 rounded-full border border-cyan-500/30">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        {worker.status !== "busy" ? (
                          <button
                            onClick={() => assignWorkerToComplaint(worker)}
                            className="px-4 py-2 bg-gradient-to-r from-green-600 to-cyan-600 text-white text-sm rounded-xl hover:from-green-500 hover:to-cyan-500 transition-all duration-300 shadow-lg hover:shadow-xl"
                          >
                            Assign
                          </button>
                        ) : (
                          <div className="px-3 py-1 bg-red-600/20 text-red-300 text-sm rounded-lg font-medium border border-red-500/30">
                            Busy
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-white/5 border border-white/10 rounded-xl">
                  <div className="text-4xl mb-2">😔</div>
                  <p className="text-gray-400">No workers available for this department and location.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};