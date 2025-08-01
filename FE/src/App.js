import React, { useState, useEffect } from "react";
import {
  User,
  BookOpen,
  Brain,
  Gamepad2,
  Save,
  Share,
  MessageCircle,
  Upload,
  Eye,
  Trash2,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  ChevronDown,
  Activity,
  Users,
  FileText,
  TrendingUp,
  Clock,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Star,
  ChevronRight,
  Home,
  Zap,
  Globe,
  Award,
  Target,
  BarChart3,
  Shield,
  Sun,
  Moon,
  HelpCircle,
  LogOut,
  Plus,
  Minimize2,
  Maximize2,
  Copy,
  ExternalLink,
  Camera,
  Mic,
  Send,
  Heart,
  Bookmark,
  ClipboardCheck,
  UserCheck,
  GraduationCap,
  PieChart,
  BookmarkPlus,
  Lightbulb,
  CheckCircle,
  AlertCircle,
  PlayCircle,
  PauseCircle,
  Folder,
  FolderOpen,
  Archive,
  Layers,
  Monitor,
} from "lucide-react";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

// Enhanced In-memory DB with analytics
const InMemoryDB = {
  content: [],
  sharedContent: [],
  students: [], // Student database
  attendanceRecords: [],
  evaluationSessions: [],
  studentProfiles: [],
  learningPaths: [],
  progressAnalyses: [],
  resourceRecommendations: [],
  analytics: {
    totalViews: 0,
    contentCreated: 0,
    studentsEngaged: 0,
    averageRating: 4.8,
    totalStudents: 0,
    evaluationsCompleted: 0,
  },

  saveContent(content) {
    const id = Date.now().toString();
    const contentWithId = {
      ...content,
      id,
      createdAt: new Date().toISOString(),
      views: 0,
      likes: 0,
      rating: 0,
      tags: content.tags || [],
      shared: false,
      sharedAt: null,
      // Enhanced metadata for visualizations
      metadata: {
        ...content.metadata,
        fileSize: content.htmlContent ? new Blob([content.htmlContent]).size : 0,
        hasInteractivity: content.htmlContent ? content.htmlContent.includes('addEventListener') : false,
        uses3D: content.htmlContent ? content.htmlContent.includes('three.js') || content.htmlContent.includes('THREE') : false,
        usesCharts: content.htmlContent ? content.htmlContent.includes('chart') || content.htmlContent.includes('Chart') : false,
      }
    };
    this.content.push(contentWithId);
    this.analytics.contentCreated++;
    return contentWithId;
  },

  addStudent(student) {
    const existingStudent = this.students.find(s => s.name.toLowerCase() === student.name.toLowerCase());
    if (!existingStudent) {
      const studentWithId = {
        ...student,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      this.students.push(studentWithId);
      this.analytics.totalStudents++;
      return studentWithId;
    }
    return existingStudent;
  },

  getContent(userId, type = null) {
    return this.content.filter(item =>
      item.userId === userId && (type ? item.type === type : true)
    );
  },

  getVisualizationsByTeacher(userId) {
    return this.content.filter(item =>
      item.userId === userId && item.type === 'visualization'
    ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  saveEvaluationSession(session) {
    this.evaluationSessions.push(session);
    if (session.status === 'completed') {
      this.analytics.evaluationsCompleted++;
    }
  },


  saveStudentProfile(profile) {
    const existingIndex = this.studentProfiles.findIndex(p => p.student_name === profile.student_name);
    if (existingIndex >= 0) {
      this.studentProfiles[existingIndex] = profile;
    } else {
      this.studentProfiles.push(profile);
    }
  },

  getContent(userId, type = null) {
    return this.content.filter(item =>
      item.userId === userId && (type ? item.type === type : true)
    );
  },

  shareContent(contentId) {
    const content = this.content.find(item => item.id === contentId);
    if (content && !content.shared) {
      content.shared = true;
      content.sharedAt = new Date().toISOString();
      this.sharedContent.push({ ...content });
      return true;
    }
    return false;
  },

  getSharedContent(type = null) {
    return this.sharedContent.filter(item =>
      type ? item.type === type : true
    );
  },

  deleteContent(contentId, userId) {
    const idx = this.content.findIndex(item => item.id === contentId && item.userId === userId);
    if (idx > -1) {
      this.content.splice(idx, 1);
      return true;
    }
    return false;
  },

  incrementView(contentId) {
    const content = this.content.find(item => item.id === contentId);
    if (content) {
      content.views = (content.views || 0) + 1;
      this.analytics.totalViews++;
    }
  }
};

// Modern UI Components
const Card = ({ children, className = "", hover = true, padding = "p-6" }) => (
  <div className={`
    bg-white rounded-xl shadow-sm border border-gray-100 
    ${hover ? 'hover:shadow-lg hover:border-gray-200 transition-all duration-300' : ''}
    ${padding} ${className}
  `}>
    {children}
  </div>
);

const Button = ({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  icon: Icon,
  className = "",
  loading = false
}) => {
  const variants = {
    primary: "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200",
    success: "bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800",
    danger: "bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800",
    ghost: "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
    outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white",
    purple: "bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800",
    orange: "bg-gradient-to-r from-orange-600 to-orange-700 text-white hover:from-orange-700 hover:to-orange-800"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
    xl: "px-8 py-4 text-lg"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${variants[variant]} ${sizes[size]}
        rounded-lg font-medium transition-all duration-200 
        flex items-center gap-2 justify-center
        disabled:opacity-50 disabled:cursor-not-allowed
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${className}
      `}
    >
      {loading ? (
        <RefreshCw size={16} className="animate-spin" />
      ) : Icon ? (
        <Icon size={16} />
      ) : null}
      {children}
    </button>
  );
};

const Badge = ({ children, variant = "default", size = "sm" }) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    blue: "bg-blue-100 text-blue-800",
    green: "bg-green-100 text-green-800",
    purple: "bg-purple-100 text-purple-800",
    yellow: "bg-yellow-100 text-yellow-800",
    red: "bg-red-100 text-red-800",
    orange: "bg-orange-100 text-orange-800"
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm"
  };

  return (
    <span className={`${variants[variant]} ${sizes[size]} rounded-full font-medium`}>
      {children}
    </span>
  );
};

const Tooltip = ({ children, content }) => (
  <div className="group relative inline-block">
    {children}
    <div className="invisible group-hover:visible absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg whitespace-nowrap">
      {content}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
    </div>
  </div>
);

// Stats Card Component
const StatsCard = ({ title, value, change, icon: Icon, color = "blue" }) => {
  const colors = {
    blue: "text-blue-600 bg-blue-50",
    green: "text-green-600 bg-green-50",
    purple: "text-purple-600 bg-purple-50",
    yellow: "text-yellow-600 bg-yellow-50",
    orange: "text-orange-600 bg-orange-50"
  };

  return (
    <Card className="relative overflow-hidden">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
          {change && (
            <div className="flex items-center mt-2">
              <TrendingUp size={16} className="text-green-500 mr-1" />
              <span className="text-sm text-green-600 font-medium">{change}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${colors[color]}`}>
          <Icon size={24} />
        </div>
      </div>
    </Card>
  );
};

function App() {
  // Core states
  const [mode, setMode] = useState("teacher");
  const [userId, setUserId] = useState("teacher1");
  const [appName] = useState("manager");
  const [sessionId, setSessionId] = useState("");
  const [sidebarView, setSidebarView] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  // MCQ specific states
  const [mcqData, setMcqData] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // 1. Add these new state variables at the top with your other useState declarations (around line 85)
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [useLocalModel, setUseLocalModel] = useState(false);


  // Content/task states
  const [taskInput, setTaskInput] = useState("");
  const [response, setResponse] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const [loading, setLoading] = useState(false);

  // Dashboard/content
  const [savedContent, setSavedContent] = useState([]);
  const [sharedContent, setSharedContent] = useState([]);
  const [raw, setRaw] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

  // Chat states
  const [chat, setChat] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isTyping, setIsTyping] = useState(false);

  // Student Management States
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceStatus, setAttendanceStatus] = useState("present");
  const [attendanceSubject, setAttendanceSubject] = useState("");

  // Evaluation States
  const [evaluationStudent, setEvaluationStudent] = useState("");
  const [currentEvaluation, setCurrentEvaluation] = useState(null);
  const [evaluationAnswer, setEvaluationAnswer] = useState("");
  const [evaluationSessions, setEvaluationSessions] = useState([]);
  const [studentProfiles, setStudentProfiles] = useState([]);

  // Learning Path States
  const [learningPathStudent, setLearningPathStudent] = useState("");
  const [learningPathSubject, setLearningPathSubject] = useState("");
  const [learningPathDuration, setLearningPathDuration] = useState("");

  // Progress Analysis States
  const [progressStudent, setProgressStudent] = useState("");
  const [progressAnalysis, setProgressAnalysis] = useState(null);

  // Resource States
  const [resourceTopic, setResourceTopic] = useState("");
  const [resourceGrade, setResourceGrade] = useState("");
  const [recommendedResources, setRecommendedResources] = useState([]);

  // UI states
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Welcome to Enhanced SahayakAgent!", time: "2 min ago", unread: true },
    { id: 2, message: "All agent capabilities are now available", time: "5 min ago", unread: false }
  ]);

  function generateSessionId() {
    return `s_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  useEffect(() => {
    if (!sessionId) setSessionId(generateSessionId());
    setSavedContent(InMemoryDB.getContent(userId));
    setSharedContent(InMemoryDB.getSharedContent());
    setStudents(InMemoryDB.students);
    setEvaluationSessions(InMemoryDB.evaluationSessions);
    setStudentProfiles(InMemoryDB.studentProfiles);
  }, [userId, sessionId]);

  // 2. Add this useEffect hook after your existing useEffects (around line 120)
  useEffect(() => {
    // Network status listeners
    const handleOnline = () => {
      setIsOnline(true);
      setNotifications(prev => [...prev, {
        id: Date.now(),
        message: "Connection restored - Using cloud AI",
        time: "Just now",
        unread: true
      }]);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setNotifications(prev => [...prev, {
        id: Date.now(),
        message: "Offline mode - Switching to local AI",
        time: "Just now",
        unread: true
      }]);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Replace your existing sendToLocalModel function with this fixed version
async function sendToLocalModel(message) {
  try {
    // Ensure message is a string and not empty
    if (!message || typeof message !== 'string') {
      throw new Error('Invalid message format');
    }

    const requestBody = {
      model: "gemma3", // Use the correct model name format for Ollama
      prompt: message.trim(),
      stream: false // Set to false to get complete response
    };

    // Debug log to check the request body
    console.log('Local model request:', JSON.stringify(requestBody, null, 2));

    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    // Debug log for response status
    console.log('Local model response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Local model error response:', errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('Local model response data:', data);

    // Ollama returns response in data.response field
    if (data && data.response) {
      return data.response.trim() || "Sorry, I couldn't generate a response.";
    } else {
      throw new Error('Invalid response format from local model');
    }
  } catch (error) {
    console.error("Local model error:", error);
    throw new Error(`Local model unavailable: ${error.message}`);
  }
}

  async function createSession() {
    const newSessionId = generateSessionId();
    try {
      const res = await fetch(`${API_BASE}/apps/${appName}/users/${userId}/sessions/${newSessionId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ state: {} })
      });
      if (res.ok) {
        setSessionId(newSessionId);
        setNotifications(prev => [...prev, {
          id: Date.now(),
          message: `New session created: ${newSessionId.substring(0, 12)}...`,
          time: "Just now",
          unread: true
        }]);
      }
    } catch (error) {
      console.error("Error creating session:", error);
    }
  }

  async function sendToADK(promptText, contentType = "general") {
    setLoading(true);
    setResponse("");
    setHtmlContent("");
    setRaw(null);
    setMcqData(null); // Reset MCQ data

    if (!sessionId) {
      setLoading(false);
      alert("Please create a session first.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          app_name: appName,
          user_id: userId,
          session_id: sessionId,
          new_message: {
            role: "user",
            parts: [{ text: promptText }],
          },
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${await res.text()}`);
      }

      const data = await res.json();
      setRaw(data);

      let text = "";
      let html = "";
      if (Array.isArray(data) && data.length > 0) {
        const modelResponses = data.filter(event =>
          event.content?.role === "model" &&
          event.content?.parts?.some(part => part.text)
        );
        if (modelResponses.length > 0) {
          const lastResponse = modelResponses[modelResponses.length - 1];
          const textParts = lastResponse.content.parts.filter(part => part.text);
          text = textParts.map(part => part.text).join('');
          if (text.includes("<!DOCTYPE html") || text.includes("<html")) {
            const htmlMatch = text.match(/<!DOCTYPE html[\s\S]*?<\/html>/i)
              || text.match(/<html[\s\S]*?<\/html>/i);
            if (htmlMatch) html = htmlMatch[0];
          }
        }
      }
      setResponse(text || "No response received.");
      setHtmlContent(html);
      setTaskInput("");

      // Handle MCQ response parsing
      if (contentType === "mcq" && data && Array.isArray(data)) {
        // Look for function response containing MCQ data
        const mcqResponse = data.find(event =>
          event.content?.parts?.some(part =>
            part.functionResponse?.response?.questions
          )
        );

        if (mcqResponse) {
          const mcqQuestions = mcqResponse.content.parts.find(part =>
            part.functionResponse?.response?.questions
          )?.functionResponse?.response;

          if (mcqQuestions) {
            setMcqData(mcqQuestions);
            setSelectedAnswers({});
            setShowResults(false);
          }
        }
      }

      // Handle specific agent responses
      if (contentType === "attendance" && text.includes("attendance saved")) {
        // Refresh students list
        setStudents(InMemoryDB.students);
      } else if (contentType === "evaluation" && text.includes("evaluation")) {
        // Handle evaluation responses
        try {
          const evalData = JSON.parse(text);
          if (evalData.action === "start_student_evaluation") {
            setCurrentEvaluation(evalData);
          } else if (evalData.action === "record_evaluation_answer") {
            setCurrentEvaluation(evalData);
            if (evalData.status === "completed") {
              InMemoryDB.saveStudentProfile(evalData.analysis);
              setStudentProfiles(InMemoryDB.studentProfiles);
              setCurrentEvaluation(null);
            }
          }
        } catch (e) {
          // If not JSON, treat as text response
        }
      }
    } catch (error) {
      console.error("API Error:", error);

      let errorMessage = "An error occurred while connecting to the server.";

      if (error.message.includes("CORS") || error.message.includes("blocked")) {
        errorMessage = "CORS Error: Backend server needs CORS configuration. Please check server settings.";
      } else if (error.message.includes("Failed to fetch") || error.name === "TypeError") {
        errorMessage = `Network Error: Cannot connect to ${API_BASE}. Is the server running?`;
      } else if (error.message.includes("500")) {
        errorMessage = "Server Error: Backend encountered an internal error.";
      } else if (error.message.includes("404")) {
        errorMessage = "API Endpoint Not Found: Check if /run_sse endpoint exists.";
      }

      setResponse(`Error: ${errorMessage}\n\nDetails: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  // Fullscreen helper functions
  function enterFullscreen(element) {
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
  }

  function exitFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }

  function toggleFullscreen() {
    const iframe = document.getElementById('visualization-iframe');
    if (!document.fullscreenElement) {
      setIsFullscreen(true);
      enterFullscreen(iframe);
    } else {
      setIsFullscreen(false);
      exitFullscreen();
    }
  }

  // Listen for fullscreen changes
  useEffect(() => {
    function handleFullscreenChange() {
      setIsFullscreen(!!document.fullscreenElement);
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  // MCQ helper functions
  function handleAnswerSelection(questionId, selectedOption) {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: selectedOption
    }));
  }

  function submitMCQAnswers() {
    setShowResults(true);

    // Calculate score
    let correct = 0;
    mcqData.questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correct_answer) {
        correct++;
      }
    });

    const score = (correct / mcqData.questions.length) * 100;

    setNotifications(prev => [...prev, {
      id: Date.now(),
      message: `MCQ completed! Score: ${score.toFixed(1)}% (${correct}/${mcqData.questions.length})`,
      time: "Just now",
      unread: true
    }]);
  }

  function resetMCQ() {
    setSelectedAnswers({});
    setShowResults(false);
  }

  // Agent-specific functions
  async function saveAttendance() {
    if (!selectedStudent || !attendanceDate || !attendanceSubject) {
      alert("Please fill in all attendance fields.");
      return;
    }

    const prompt = `Save attendance for student: ${selectedStudent}, Date: ${attendanceDate}, Status: ${attendanceStatus}, Subject: ${attendanceSubject}`;
    await sendToADK(prompt, "attendance");
  }

  async function startStudentEvaluation() {
    if (!evaluationStudent) {
      alert("Please enter a student name for evaluation.");
      return;
    }

    const prompt = `Start comprehensive student evaluation for: ${evaluationStudent}`;
    await sendToADK(prompt, "evaluation");
  }

  async function submitEvaluationAnswer() {
    if (!evaluationAnswer.trim() || !currentEvaluation) {
      alert("Please provide an answer.");
      return;
    }

    const prompt = `Record evaluation answer for session ${currentEvaluation.session_id}: ${evaluationAnswer}`;
    await sendToADK(prompt, "evaluation");
    setEvaluationAnswer("");
  }

  async function createLearningPath() {
    if (!learningPathStudent || !learningPathSubject) {
      alert("Please fill in student name and subject.");
      return;
    }

    const prompt = `Create personalized learning path for student: ${learningPathStudent}, Subject: ${learningPathSubject}, Duration: ${learningPathDuration || '4 weeks'}`;
    await sendToADK(prompt, "learning_path");
  }

  async function analyzeProgress() {
    if (!progressStudent) {
      alert("Please select a student for progress analysis.");
      return;
    }

    const prompt = `Analyze comprehensive progress for student: ${progressStudent}`;
    await sendToADK(prompt, "progress");
  }

  async function findResources() {
    if (!resourceTopic) {
      alert("Please enter a topic to search for resources.");
      return;
    }

    const prompt = `Find educational resources for topic: ${resourceTopic}, Grade level: ${resourceGrade || 'any'}`;
    await sendToADK(prompt, "resources");
  }

  function saveContent(type) {
    const title = taskInput.trim()
      ? taskInput.substring(0, 50) + (taskInput.length > 50 ? "..." : "")
      : `[Auto] ${type} content - ${new Date().toLocaleDateString()}`;

    if (!response && !htmlContent) {
      alert("No content to save.");
      return;
    }

    const saved = InMemoryDB.saveContent({
      type,
      title,
      prompt: taskInput,
      response,
      htmlContent,
      userId,
      shared: false,
      tags: [type, mode],
      metadata: {
        createdDate: new Date().toISOString(),
        contentType: htmlContent ? 'interactive' : 'text',
        hasHtml: !!htmlContent,
        wordCount: response ? response.split(' ').length : 0,
        // Add visualization-specific metadata
        ...(type === 'visualization' && {
          hasInteractivity: htmlContent ? htmlContent.includes('addEventListener') || htmlContent.includes('onclick') : false,
          uses3D: htmlContent ? htmlContent.includes('three.js') || htmlContent.includes('THREE') : false,
          usesCharts: htmlContent ? htmlContent.includes('chart') || htmlContent.includes('Chart') : false,
        })
      }
    });

    setSavedContent(InMemoryDB.getContent(userId));
    setNotifications(prev => [...prev, {
      id: Date.now(),
      message: `${type.charAt(0).toUpperCase() + type.slice(1)} content saved successfully!`,
      time: "Just now",
      unread: true
    }]);

    // Clear the form after saving
    setTaskInput("");

    // Show success message for visualizations
    if (type === 'visualization') {
      alert(`✅ Visualization "${title}" saved successfully!\n\nYou can now share it with students from your dashboard.`);
    }

    return saved;
  }

  function unshareContent(contentId) {
    const content = this.content.find(item => item.id === contentId);
    if (content && content.shared) {
      content.shared = false;
      content.sharedAt = null;

      // Remove from shared content array
      this.sharedContent = this.sharedContent.filter(item => item.id !== contentId);
      return true;
    }
    return false;
  }

  // 2. Enhanced shareContent function (replace the existing one)
  function shareContent(contentId) {
    const content = InMemoryDB.content.find(item => item.id === contentId);
    if (!content) {
      alert("Content not found.");
      return;
    }

    if (content.shared) {
      alert("Content is already shared with students.");
      return;
    }

    if (InMemoryDB.shareContent(contentId)) {
      setSavedContent(InMemoryDB.getContent(userId));
      setSharedContent(InMemoryDB.getSharedContent());

      setNotifications(prev => [...prev, {
        id: Date.now(),
        message: `"${content.title}" has been shared with all students!`,
        time: "Just now",
        unread: true
      }]);

      // Show success modal or toast
      alert(`✅ "${content.title}" has been successfully shared with students!\n\nStudents can now access this ${content.type} in their dashboard.`);
    } else {
      alert("Failed to share content. Please try again.");
    }
  }

  // 3. Add bulk share functionality
  function shareAllVisualizations() {
    const unsharedVisualizations = savedContent.filter(content =>
      content.type === 'visualization' && !content.shared
    );

    if (unsharedVisualizations.length === 0) {
      alert("No unshared visualizations found.");
      return;
    }

    const confirmShare = window.confirm(
      `Share ${unsharedVisualizations.length} visualization(s) with students?`
    );

    if (confirmShare) {
      let sharedCount = 0;
      unsharedVisualizations.forEach(content => {
        if (InMemoryDB.shareContent(content.id)) {
          sharedCount++;
        }
      });

      setSavedContent(InMemoryDB.getContent(userId));
      setSharedContent(InMemoryDB.getSharedContent());

      setNotifications(prev => [...prev, {
        id: Date.now(),
        message: `${sharedCount} visualization(s) shared with students!`,
        time: "Just now",
        unread: true
      }]);
    }
  }

  function deleteContent(contentId) {
    if (InMemoryDB.deleteContent(contentId, userId)) {
      setSavedContent(InMemoryDB.getContent(userId));
    }
  }

  // Enhanced sendChatMessage function with better error handling
async function sendChatMessage() {
  if (!chatInput.trim() && !selectedImage) return;

  const messageText = chatInput.trim();
  if (!messageText) {
    console.error("Empty message, cannot send to local model");
    return;
  }

  const userMsg = {
    id: Date.now(),
    text: messageText,
    image: selectedImage,
    sender: "user",
    timestamp: new Date().toLocaleTimeString()
  };

  setChat(prev => [...prev, userMsg]);
  setIsTyping(true);

  let responseText = "I'm here to help! How can I assist you today?";
  let modelUsed = "cloud";

  try {
    // Check if we should use local model (offline or manual override)
    const shouldUseLocal = !isOnline || useLocalModel;

    if (shouldUseLocal) {
      // Try local model first
      try {
        console.log('Attempting local model with message:', messageText);
        responseText = await sendToLocalModel(messageText);
        modelUsed = "local";
        console.log('Local model response received:', responseText);
      } catch (localError) {
        console.error("Local model failed:", localError);

        // If local fails and we're online, fallback to cloud
        if (isOnline) {
          console.log("Falling back to cloud model...");
          try {
            const prompt = `Chat message: ${messageText}${selectedImage ? " [Image attached]" : ""}`;

            const res = await fetch(`${API_BASE}/run`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                app_name: appName,
                user_id: userId,
                session_id: sessionId,
                new_message: {
                  role: "user",
                  parts: [{ text: prompt }],
                },
              }),
            });

            if (res.ok) {
              const data = await res.json();
              if (Array.isArray(data) && data.length > 0) {
                const modelResponses = data.filter(event =>
                  event.content?.role === "model" &&
                  event.content?.parts?.some(part => part.text)
                );
                if (modelResponses.length > 0) {
                  const lastResponse = modelResponses[modelResponses.length - 1];
                  const textParts = lastResponse.content.parts.filter(part => part.text);
                  if (textParts.length > 0) {
                    responseText = textParts.map(part => part.text).join('');
                    modelUsed = "cloud (fallback)";
                  }
                }
              }
            } else {
              throw new Error(`Cloud API responded with status ${res.status}`);
            }
          } catch (cloudError) {
            console.error("Cloud fallback also failed:", cloudError);
            responseText = `Both local and cloud AI models are unavailable. Local error: ${localError.message}. Cloud error: ${cloudError.message}`;
            modelUsed = "error";
          }
        } else {
          responseText = `Sorry, I'm currently offline and the local AI model encountered an error: ${localError.message}. Please check if the local model server is running on localhost:1234 and properly configured.`;
          modelUsed = "error";
        }
      }
    } else {
      // Use cloud model (online and not forced local)
      const prompt = `Chat message: ${messageText}${selectedImage ? " [Image attached]" : ""}`;

      const res = await fetch(`${API_BASE}/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          app_name: appName,
          user_id: userId,
          session_id: sessionId,
          new_message: {
            role: "user",
            parts: [{ text: prompt }],
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const modelResponses = data.filter(event =>
            event.content?.role === "model" &&
            event.content?.parts?.some(part => part.text)
          );
          if (modelResponses.length > 0) {
            const lastResponse = modelResponses[modelResponses.length - 1];
            const textParts = lastResponse.content.parts.filter(part => part.text);
            if (textParts.length > 0) {
              responseText = textParts.map(part => part.text).join('');
              modelUsed = "cloud";
            }
          }
        }
      } else {
        throw new Error("Cloud API request failed");
      }
    }

  } catch (error) {
    console.error("Chat error:", error);
    responseText = `I apologize, but I'm having trouble connecting right now. ${!isOnline ? 'You appear to be offline. ' : ''}Error details: ${error.message}`;
    modelUsed = "error";
  }

  setTimeout(() => {
    setIsTyping(false);
    setChat(prev => [...prev, {
      id: Date.now() + 1,
      text: responseText,
      sender: "bot",
      timestamp: new Date().toLocaleTimeString(),
      modelUsed // Add this to track which model was used
    }]);

    // Add notification about model used
    if (modelUsed === "local") {
      setNotifications(prev => [...prev, {
        id: Date.now(),
        message: "Response from local AI model",
        time: "Just now",
        unread: true
      }]);
    } else if (modelUsed === "error") {
      setNotifications(prev => [...prev, {
        id: Date.now(),
        message: "AI models unavailable - check configuration",
        time: "Just now",
        unread: true
      }]);
    }
  }, 1000);

  setChatInput("");
  setSelectedImage(null);
}


  function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => setSelectedImage(e.target.result);
    reader.readAsDataURL(file);
  }

  const filteredContent = savedContent.filter(content => {
    const matchesSearch = content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      content.prompt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === "all" || content.type === filterType;
    return matchesSearch && matchesFilter;
  });

  function ContentCard({ content, showActions = true }) {
    const typeColors = {
      mcq: "blue",
      visualization: "green",
      game: "purple",
      attendance: "orange",
      evaluation: "red",
      learning_path: "purple",
      progress: "yellow",
      resources: "blue"
    };

    // Enhanced share handler
    const handleShare = () => {
      if (content.shared) {
        const confirmMessage = `Stop sharing "${content.title}" with students?`;
        if (window.confirm(confirmMessage)) {
          unshareContent(content.id);
        }
      } else {
        const confirmMessage = content.htmlContent
          ? `Share this interactive ${content.type} with students?\n\nStudents will be able to view and interact with the visualization.`
          : `Share this ${content.type} with students?`;

        if (window.confirm(confirmMessage)) {
          shareContent(content.id);
        }
      }
    };

    // Preview handler for visualizations
    const handlePreview = () => {
      if (content.htmlContent) {
        const newWindow = window.open();
        newWindow.document.write(content.htmlContent);
        newWindow.document.close();
        InMemoryDB.incrementView(content.id);
      }
    };

    // Get visualization features
    const getVisualizationFeatures = () => {
      if (content.type !== 'visualization') return [];
      const features = [];
      if (content.metadata?.hasInteractivity) features.push("Interactive");
      if (content.metadata?.uses3D) features.push("3D");
      if (content.metadata?.usesCharts) features.push("Charts");
      return features;
    };

    return (
      <Card className="group relative overflow-hidden" hover>
        <div className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 bg-gradient-to-br from-blue-50 to-transparent rounded-full opacity-50"></div>
        <div className="relative">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                  {content.title}
                </h3>
                <Badge variant={typeColors[content.type] || "default"}>
                  {content.type.toUpperCase()}
                </Badge>
                {content.shared && <Badge variant="green">SHARED</Badge>}
              </div>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{content.prompt}</p>

              {/* Show visualization features */}
              {content.type === 'visualization' && getVisualizationFeatures().length > 0 && (
                <div className="flex items-center gap-2 mb-3">
                  {getVisualizationFeatures().map(feature => (
                    <Badge key={feature} variant="purple" size="sm">{feature}</Badge>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar size={12} />
                  {new Date(content.createdAt).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <Eye size={12} />
                  {content.views || 0} views
                </div>
                <div className="flex items-center gap-1">
                  <Heart size={12} />
                  {content.likes || 0} likes
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced preview for visualizations */}
          {content.htmlContent && (
            <div className="mb-4 relative group">
              <div className="relative overflow-hidden rounded-lg border border-gray-200">
                <iframe
                  title={`Preview ${content.id}`}
                  srcDoc={content.htmlContent}
                  className="w-full h-48 bg-white"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>

                {/* Overlay buttons for interactive content */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                  <Button
                    onClick={handlePreview}
                    variant="primary"
                    size="sm"
                    icon={ExternalLink}
                    className="bg-white/90 text-gray-900 hover:bg-white"
                  >
                    Full View
                  </Button>
                  {showActions && mode === "teacher" && (
                    <Button
                      onClick={handleShare}
                      variant={content.shared ? "secondary" : "success"}
                      size="sm"
                      icon={content.shared ? CheckCircle : Share}
                      className="bg-white/90 text-gray-900 hover:bg-white"
                    >
                      {content.shared ? "Shared" : "Share"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}

          {showActions && mode === "teacher" && (
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex gap-2">
                <Button
                  onClick={handleShare}
                  variant={content.shared ? "secondary" : "success"}
                  size="sm"
                  icon={content.shared ? CheckCircle : Share}
                >
                  {content.shared ? "Shared with Students" : "Share with Students"}
                </Button>

                {content.htmlContent && (
                  <Button
                    onClick={handlePreview}
                    variant="outline"
                    size="sm"
                    icon={ExternalLink}
                  >
                    Preview
                  </Button>
                )}

                <Button
                  onClick={() => {
                    const textToCopy = content.htmlContent || content.response;
                    navigator.clipboard.writeText(textToCopy);
                    setNotifications(prev => [...prev, {
                      id: Date.now(),
                      message: "Content copied to clipboard!",
                      time: "Just now",
                      unread: true
                    }]);
                  }}
                  variant="ghost"
                  size="sm"
                  icon={Copy}
                />
              </div>
              <div className="flex gap-2">
                <Tooltip content="View Details">
                  <Button
                    onClick={() => InMemoryDB.incrementView(content.id)}
                    variant="ghost"
                    size="sm"
                    icon={Eye}
                  />
                </Tooltip>
                <Tooltip content="Delete">
                  <Button
                    onClick={() => {
                      if (window.confirm(`Delete "${content.title}"?`)) {
                        deleteContent(content.id);
                      }
                    }}
                    variant="ghost"
                    size="sm"
                    icon={Trash2}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  />
                </Tooltip>
              </div>
            </div>
          )}

          {/* Show shared info for students */}
          {mode === "student" && content.sharedAt && (
            <div className="mt-3 p-2 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 text-sm text-blue-700">
                <Share size={14} />
                <span>Shared by teacher on {new Date(content.sharedAt).toLocaleDateString()}</span>
              </div>
            </div>
          )}
        </div>
      </Card>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
      }`}>
      {/* Enhanced Header */}
      <header className={`backdrop-blur-xl border-b sticky top-0 z-50 ${darkMode ? 'bg-gray-900/80 border-gray-700' : 'bg-white/80 border-gray-200'
        }`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Zap className="text-white" size={20} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    SahayakAgent
                  </h1>
                  <p className="text-xs text-gray-500">AI-Powered Educational Platform</p>
                </div>
              </div>

              <div className="hidden md:flex items-center gap-3">
                <Button
                  onClick={() => {
                    setMode("teacher");
                    setUserId("teacher1");
                  }}
                  variant={mode === "teacher" ? "primary" : "secondary"}
                  size="sm"
                  icon={User}
                >
                  Teacher
                </Button>
                <Button
                  onClick={() => {
                    setMode("student");
                    setUserId("student1");
                  }}
                  variant={mode === "student" ? "primary" : "secondary"}
                  size="sm"
                  icon={BookOpen}
                >
                  Student
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Search Bar */}
              <div className="hidden lg:block relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-64 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50 backdrop-blur"
                />
              </div>

              {/* Notifications */}
              <div className="relative">
                <Button variant="ghost" size="sm" icon={Bell}>
                  {notifications.filter(n => n.unread).length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {notifications.filter(n => n.unread).length}
                    </span>
                  )}
                </Button>
              </div>

              {/* Theme Toggle */}
              <Button
                onClick={() => setDarkMode(!darkMode)}
                variant="ghost"
                size="sm"
                icon={darkMode ? Sun : Moon}
              />

              {/* Session Info */}
              <div className="hidden xl:flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
                <Activity size={16} className="text-green-500" />
                <div className="text-sm">
                  <div className="font-medium text-gray-900">
                    {mode.charAt(0).toUpperCase() + mode.slice(1)} Mode
                  </div>
                  <div className="text-xs text-gray-500">
                    {sessionId.substring(0, 12)}...
                  </div>
                </div>
              </div>

              <Button onClick={createSession} size="sm" icon={Plus}>
                New Session
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex max-w-7xl mx-auto">
        {/* Enhanced Sidebar */}
        <aside className={`${sidebarCollapsed ? 'w-16' : 'w-80'
          } transition-all duration-300 p-6 min-h-screen`}>
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-6">
              {!sidebarCollapsed && (
                <h3 className="font-semibold text-gray-900">Navigation</h3>
              )}
              <Button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                variant="ghost"
                size="sm"
                icon={sidebarCollapsed ? Menu : X}
              />
            </div>

            {/* Navigation Items */}
            <NavItem
              icon={Home}
              label="Dashboard"
              active={sidebarView === "dashboard"}
              onClick={() => setSidebarView("dashboard")}
              collapsed={sidebarCollapsed}
            />

            {mode === "teacher" && (
              <>
                <div className={!sidebarCollapsed ? "mt-6 mb-3" : "hidden"}>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Content Creation</h4>
                </div>

                <NavItem
                  icon={BookOpen}
                  label="Generate MCQs"
                  active={sidebarView === "mcq"}
                  onClick={() => setSidebarView("mcq")}
                  collapsed={sidebarCollapsed}
                  badge="AI"
                />
                <NavItem
                  icon={Brain}
                  label="Visualizations"
                  active={sidebarView === "visualize"}
                  onClick={() => setSidebarView("visualize")}
                  collapsed={sidebarCollapsed}
                />
                <NavItem
                  icon={Gamepad2}
                  label="Create Games"
                  active={sidebarView === "game"}
                  onClick={() => setSidebarView("game")}
                  collapsed={sidebarCollapsed}
                />

                <div className={!sidebarCollapsed ? "mt-6 mb-3" : "hidden"}>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Student Management</h4>
                </div>

                {/* <NavItem
                  icon={UserCheck}
                  label="Attendance"
                  active={sidebarView === "attendance"}
                  onClick={() => setSidebarView("attendance")}
                  collapsed={sidebarCollapsed}
                /> */}
                {/* <NavItem
                  icon={ClipboardCheck}
                  label="Student Evaluation"
                  active={sidebarView === "evaluation"}
                  onClick={() => setSidebarView("evaluation")}
                  collapsed={sidebarCollapsed}
                  badge="New"
                /> */}
                <NavItem
                  icon={Target}
                  label="Learning Paths"
                  active={sidebarView === "learning_paths"}
                  onClick={() => setSidebarView("learning_paths")}
                  collapsed={sidebarCollapsed}
                />
                <NavItem
                  icon={BarChart3}
                  label="Progress Analysis"
                  active={sidebarView === "progress"}
                  onClick={() => setSidebarView("progress")}
                  collapsed={sidebarCollapsed}
                />
                {/* <NavItem
                  icon={Lightbulb}
                  label="Find Resources"
                  active={sidebarView === "resources"}
                  onClick={() => setSidebarView("resources")}
                  collapsed={sidebarCollapsed}
                /> */}
                <NavItem
                  icon={Folder}
                  label="My Visualizations"
                  active={sidebarView === "saved_visualizations"}
                  onClick={() => setSidebarView("saved_visualizations")}
                  collapsed={sidebarCollapsed}
                  badge={InMemoryDB.getVisualizationsByTeacher(userId).length.toString()}
                />
              </>
            )}

            <div className={!sidebarCollapsed ? "mt-6 mb-3" : "hidden"}>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Support</h4>
            </div>

            <NavItem
              icon={MessageCircle}
              label="AI Assistant"
              active={sidebarView === "chat"}
              onClick={() => setSidebarView("chat")}
              collapsed={sidebarCollapsed}
            />

            {!sidebarCollapsed && (
              <div className="pt-6 mt-6 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3">Quick Stats</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Total Content</span>
                    <Badge variant="blue">{savedContent.length}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Students</span>
                    <Badge variant="green">{InMemoryDB.analytics.totalStudents}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Evaluations</span>
                    <Badge variant="purple">{InMemoryDB.analytics.evaluationsCompleted}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Views</span>
                    <Badge variant="orange">{InMemoryDB.analytics.totalViews}</Badge>
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-6">
          {/* Dashboard View */}
          {sidebarView === "dashboard" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    {mode === "teacher" ? "Teacher Dashboard" : "Student Dashboard"}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {mode === "teacher"
                      ? "Comprehensive educational management with AI-powered tools"
                      : "Access shared content and learning materials"
                    }
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" size="sm" icon={Download}>
                    Export Data
                  </Button>
                  <Button variant="primary" size="sm" icon={RefreshCw}>
                    Refresh
                  </Button>
                </div>
              </div>

              {mode === "teacher" ? (
                <>
                  {/* Enhanced Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                    <StatsCard
                      title="Total Content"
                      value={savedContent.length}
                      change="+12% this week"
                      icon={FileText}
                      color="blue"
                    />
                    <StatsCard
                      title="Students"
                      value={InMemoryDB.analytics.totalStudents}
                      change="+3 this week"
                      icon={Users}
                      color="green"
                    />
                    <StatsCard
                      title="Evaluations"
                      value={InMemoryDB.analytics.evaluationsCompleted}
                      change="+5 this week"
                      icon={ClipboardCheck}
                      color="purple"
                    />
                    <StatsCard
                      title="Total Views"
                      value={InMemoryDB.analytics.totalViews}
                      change="+24% this week"
                      icon={Eye}
                      color="orange"
                    />
                    <StatsCard
                      title="Avg. Rating"
                      value={InMemoryDB.analytics.averageRating}
                      change="+0.2 this week"
                      icon={Star}
                      color="yellow"
                    />
                  </div>

                  {/* Content Management */}
                  <Card>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-gray-900">Content Library</h3>
                      <div className="flex items-center gap-3">
                        <select
                          value={filterType}
                          onChange={(e) => setFilterType(e.target.value)}
                          className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="all">All Types</option>
                          <option value="mcq">MCQs</option>
                          <option value="visualization">Visualizations</option>
                          <option value="game">Games</option>
                          <option value="attendance">Attendance</option>
                          <option value="evaluation">Evaluations</option>
                          <option value="learning_path">Learning Paths</option>
                          <option value="progress">Progress Reports</option>
                          <option value="resources">Resources</option>
                        </select>
                        <Button variant="outline" size="sm" icon={Filter}>
                          Filter
                        </Button>
                      </div>
                    </div>

                    {filteredContent.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <FileText size={32} className="text-gray-400" />
                        </div>
                        <h4 className="text-lg font-medium text-gray-900 mb-2">No content found</h4>
                        <p className="text-gray-600 mb-6">
                          {searchQuery || filterType !== "all"
                            ? "Try adjusting your search or filter"
                            : "Create your first piece of educational content to get started"
                          }
                        </p>
                        <Button variant="primary" icon={Plus}>
                          Create Content
                        </Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {filteredContent.map(content => (
                          <ContentCard key={content.id} content={content} />
                        ))}
                      </div>
                    )}
                  </Card>
                </>
              ) : (
                /* Student Dashboard */
                <div className="space-y-6">
                  <Card>
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Shared Learning Materials</h3>
                    {sharedContent.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Globe size={32} className="text-gray-400" />
                        </div>
                        <h4 className="text-lg font-medium text-gray-900 mb-2">No shared content yet</h4>
                        <p className="text-gray-600">
                          Your teachers haven't shared any content yet. Check back later!
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {sharedContent.map(content => (
                          <ContentCard key={content.id} content={content} showActions={false} />
                        ))}
                      </div>
                    )}
                  </Card>
                </div>
              )}
            </div>
          )}

          {/* Saved Visualizations View */}
          {sidebarView === "saved_visualizations" && mode === "teacher" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Folder className="text-green-600" size={24} />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">My Visualizations</h2>
                  <p className="text-gray-600">Manage and share your saved visualizations</p>
                </div>
              </div>

              {/* Visualization Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatsCard
                  title="Total Created"
                  value={InMemoryDB.getVisualizationsByTeacher(userId).length}
                  icon={Layers}
                  color="green"
                />
                <StatsCard
                  title="Shared"
                  value={InMemoryDB.getVisualizationsByTeacher(userId).filter(v => v.shared).length}
                  icon={Share}
                  color="blue"
                />
                <StatsCard
                  title="Total Views"
                  value={InMemoryDB.getVisualizationsByTeacher(userId).reduce((sum, v) => sum + (v.views || 0), 0)}
                  icon={Eye}
                  color="purple"
                />
                <StatsCard
                  title="This Week"
                  value={InMemoryDB.getVisualizationsByTeacher(userId).filter(v =>
                    new Date() - new Date(v.createdAt) < 7 * 24 * 60 * 60 * 1000
                  ).length}
                  icon={Calendar}
                  color="orange"
                />
              </div>

              {/* Visualizations Grid */}
              <Card>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Your Visualizations</h3>
                  <div className="flex gap-3">
                    <Button
                      onClick={() => setSidebarView("visualize")}
                      variant="primary"
                      size="sm"
                      icon={Plus}
                    >
                      Create New
                    </Button>
                    <Button
                      onClick={() => {
                        const unsharedViz = InMemoryDB.getVisualizationsByTeacher(userId).filter(v => !v.shared);
                        if (unsharedViz.length === 0) {
                          alert("No unshared visualizations found.");
                          return;
                        }
                        if (window.confirm(`Share all ${unsharedViz.length} unshared visualizations with students?`)) {
                          let sharedCount = 0;
                          unsharedViz.forEach(viz => {
                            if (InMemoryDB.shareContent(viz.id)) sharedCount++;
                          });
                          setSavedContent(InMemoryDB.getContent(userId));
                          setSharedContent(InMemoryDB.getSharedContent());
                          alert(`${sharedCount} visualizations shared with students!`);
                        }
                      }}
                      variant="success"
                      size="sm"
                      icon={Share}
                    >
                      Share All
                    </Button>
                  </div>
                </div>

                {InMemoryDB.getVisualizationsByTeacher(userId).length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Brain size={32} className="text-gray-400" />
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No visualizations yet</h4>
                    <p className="text-gray-600 mb-6">Create your first visualization to get started</p>
                    <Button
                      onClick={() => setSidebarView("visualize")}
                      variant="primary"
                      icon={Plus}
                    >
                      Create Visualization
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {InMemoryDB.getVisualizationsByTeacher(userId).map(content => (
                      <ContentCard key={content.id} content={content} />
                    ))}
                  </div>
                )}
              </Card>
            </div>
          )}

          {/* Attendance Management View */}
          {sidebarView === "attendance" && mode === "teacher" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <UserCheck className="text-orange-600" size={24} />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Student Attendance</h2>
                  <p className="text-gray-600">Smart attendance management with automated student database</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Attendance Form */}
                <Card>
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Mark Attendance</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Student Name
                      </label>
                      <input
                        type="text"
                        value={selectedStudent}
                        onChange={(e) => setSelectedStudent(e.target.value)}
                        placeholder="Enter student name (will be added to database if new)"
                        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Date
                      </label>
                      <input
                        type="date"
                        value={attendanceDate}
                        onChange={(e) => setAttendanceDate(e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Status
                      </label>
                      <select
                        value={attendanceStatus}
                        onChange={(e) => setAttendanceStatus(e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="present">Present</option>
                        <option value="absent">Absent</option>
                        <option value="late">Late</option>
                        <option value="excused">Excused</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Subject
                      </label>
                      <input
                        type="text"
                        value={attendanceSubject}
                        onChange={(e) => setAttendanceSubject(e.target.value)}
                        placeholder="e.g., Mathematics, Science, English"
                        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    <Button
                      onClick={saveAttendance}
                      disabled={loading}
                      variant="orange"
                      size="lg"
                      icon={Save}
                      loading={loading}
                      className="w-full"
                    >
                      {loading ? "Saving Attendance..." : "Save Attendance"}
                    </Button>
                  </div>
                </Card>

                {/* Student Database */}
                <Card>
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Student Database</h3>
                  {students.length === 0 ? (
                    <div className="text-center py-8">
                      <Users size={48} className="text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No students in database yet.</p>
                      <p className="text-sm text-gray-500 mt-2">Students are automatically added when you mark attendance.</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {students.map(student => (
                        <div key={student.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-medium text-gray-900">{student.name}</div>
                            <div className="text-sm text-gray-500">Grade: {student.grade || 'Not specified'}</div>
                          </div>
                          <Badge variant="blue">ID: {student.id.substring(0, 8)}</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </div>

              {response && (
                <Card>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Attendance Response</h3>
                  <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-6 rounded-xl border border-orange-100">
                    <pre className="whitespace-pre-wrap text-sm text-gray-800 leading-relaxed">
                      {response}
                    </pre>
                  </div>
                </Card>
              )}
            </div>
          )}

          {/* Student Evaluation View */}
          {sidebarView === "evaluation" && mode === "teacher" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <ClipboardCheck className="text-red-600" size={24} />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Student Evaluation</h2>
                  <p className="text-gray-600">Comprehensive psychological and academic assessment</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Evaluation Controls */}
                <Card>
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Start New Evaluation</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Student Name
                      </label>
                      <input
                        type="text"
                        value={evaluationStudent}
                        onChange={(e) => setEvaluationStudent(e.target.value)}
                        placeholder="Enter student name for comprehensive evaluation"
                        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        disabled={currentEvaluation !== null}
                      />
                    </div>

                    <Button
                      onClick={startStudentEvaluation}
                      disabled={loading || !evaluationStudent.trim() || currentEvaluation !== null}
                      variant="danger"
                      size="lg"
                      icon={PlayCircle}
                      loading={loading}
                      className="w-full"
                    >
                      {loading ? "Starting Evaluation..." : "Start Comprehensive Evaluation"}
                    </Button>

                    <div className="text-sm text-gray-600 bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertCircle size={16} className="text-blue-600 mt-0.5" />
                        <div>
                          <strong>Evaluation Features:</strong>
                          <ul className="mt-2 space-y-1 text-xs">
                            <li>• 15+ strategic questions covering learning styles</li>
                            <li>• Psychological analysis and behavioral insights</li>
                            <li>• Evidence-based recommendations for teachers</li>
                            <li>• Comprehensive student profile generation</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Active Evaluation */}
                {currentEvaluation ? (
                  <Card>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-900">Active Evaluation</h3>
                      <Badge variant="red">In Progress</Badge>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Progress</span>
                        <span>{currentEvaluation.progress_percentage?.toFixed(1) || 0}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-red-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${currentEvaluation.progress_percentage || 0}%` }}
                        ></div>
                      </div>
                    </div>

                    {currentEvaluation.next_question ? (
                      <div className="space-y-4">
                        <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                          <div className="text-sm font-medium text-red-800 mb-2">
                            Question {currentEvaluation.question_number || 1} of {currentEvaluation.total_questions || 15}
                          </div>
                          <p className="text-gray-800">{currentEvaluation.next_question.question}</p>
                        </div>

                        <textarea
                          value={evaluationAnswer}
                          onChange={(e) => setEvaluationAnswer(e.target.value)}
                          placeholder="Enter the student's answer..."
                          className="w-full h-24 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                        />

                        <Button
                          onClick={submitEvaluationAnswer}
                          disabled={loading || !evaluationAnswer.trim()}
                          variant="danger"
                          size="lg"
                          icon={Send}
                          loading={loading}
                          className="w-full"
                        >
                          {loading ? "Recording Answer..." : "Submit Answer"}
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
                        <h4 className="text-lg font-medium text-gray-900 mb-2">Evaluation Completed!</h4>
                        <p className="text-gray-600">Student profile has been generated and saved.</p>
                      </div>
                    )}
                  </Card>
                ) : (
                  /* Student Profiles */
                  <Card>
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Student Profiles</h3>
                    {studentProfiles.length === 0 ? (
                      <div className="text-center py-8">
                        <GraduationCap size={48} className="text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No student profiles yet.</p>
                        <p className="text-sm text-gray-500 mt-2">Complete evaluations to build student profiles.</p>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {studentProfiles.map((profile, index) => (
                          <div key={index} className="p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-gray-900">{profile.student_name}</h4>
                              <Badge variant="green">Completed</Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{profile.analysis?.summary}</p>
                            <div className="flex gap-2">
                              <Badge variant="blue" size="sm">
                                {profile.analysis?.learning_style_analysis?.primary_style || 'Unknown'} Learner
                              </Badge>
                              <Badge variant="purple" size="sm">
                                {profile.analysis?.strengths?.length || 0} Strengths
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                )}
              </div>

              {response && (
                <Card>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Evaluation Response</h3>
                  <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-xl border border-red-100">
                    <pre className="whitespace-pre-wrap text-sm text-gray-800 leading-relaxed">
                      {response}
                    </pre>
                  </div>
                </Card>
              )}
            </div>
          )}

          {/* Learning Paths View */}
          {sidebarView === "learning_paths" && mode === "teacher" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Target className="text-purple-600" size={24} />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Personalized Learning Paths</h2>
                  <p className="text-gray-600">Create individualized learning journeys based on student profiles</p>
                </div>
              </div>

              <Card className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900">Create Learning Path</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Student Name
                    </label>
                    <input
                      type="text"
                      value={learningPathStudent}
                      onChange={(e) => setLearningPathStudent(e.target.value)}
                      placeholder="Enter student name"
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Subject/Topic
                    </label>
                    <input
                      type="text"
                      value={learningPathSubject}
                      onChange={(e) => setLearningPathSubject(e.target.value)}
                      placeholder="e.g., Mathematics, Science, English"
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Duration (Optional)
                    </label>
                    <select
                      value={learningPathDuration}
                      onChange={(e) => setLearningPathDuration(e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Select duration</option>
                      <option value="2 weeks">2 weeks</option>
                      <option value="4 weeks">4 weeks</option>
                      <option value="6 weeks">6 weeks</option>
                      <option value="8 weeks">8 weeks</option>
                      <option value="12 weeks">12 weeks</option>
                    </select>
                  </div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                  <div className="flex items-start gap-2">
                    <Lightbulb size={16} className="text-purple-600 mt-0.5" />
                    <div>
                      <strong className="text-purple-800">AI-Powered Personalization:</strong>
                      <p className="text-sm text-purple-700 mt-1">
                        Learning paths are automatically customized based on student evaluation data,
                        learning styles, and psychological profiles for maximum effectiveness.
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={createLearningPath}
                  disabled={loading || !learningPathStudent.trim() || !learningPathSubject.trim()}
                  variant="purple"
                  size="lg"
                  icon={Target}
                  loading={loading}
                  className="w-full"
                >
                  {loading ? "Creating Learning Path..." : "Create Personalized Learning Path"}
                </Button>
              </Card>

              {response && (
                <Card>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Generated Learning Path</h3>
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-100">
                    <pre className="whitespace-pre-wrap text-sm text-gray-800 leading-relaxed">
                      {response}
                    </pre>
                  </div>
                </Card>
              )}
            </div>
          )}

          {/* Progress Analysis View */}
          {sidebarView === "progress" && mode === "teacher" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <BarChart3 className="text-yellow-600" size={24} />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Progress Analysis</h2>
                  <p className="text-gray-600">Comprehensive student progress tracking and analytics</p>
                </div>
              </div>

              <Card className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900">Analyze Student Progress</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Select Student
                    </label>
                    <select
                      value={progressStudent}
                      onChange={(e) => setProgressStudent(e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    >
                      <option value="">Choose a student</option>
                      {students.map(student => (
                        <option key={student.id} value={student.name}>
                          {student.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                  <div className="flex items-start gap-2">
                    <PieChart size={16} className="text-yellow-600 mt-0.5" />
                    <div>
                      <strong className="text-yellow-800">Multi-Source Analysis:</strong>
                      <p className="text-sm text-yellow-700 mt-1">
                        Combines data from attendance records, MCQ performance, game engagement,
                        learning paths, and evaluation results for comprehensive insights.
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={analyzeProgress}
                  disabled={loading || !progressStudent}
                  variant="orange"
                  size="lg"
                  icon={BarChart3}
                  loading={loading}
                  className="w-full"
                >
                  {loading ? "Analyzing Progress..." : "Generate Progress Report"}
                </Button>
              </Card>

              {response && (
                <Card>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Progress Analysis Report</h3>
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl border border-yellow-100">
                    <pre className="whitespace-pre-wrap text-sm text-gray-800 leading-relaxed">
                      {response}
                    </pre>
                  </div>
                </Card>
              )}
            </div>
          )}

          {/* Resource Recommendation View */}
          {sidebarView === "resources" && mode === "teacher" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Lightbulb className="text-blue-600" size={24} />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Educational Resources</h2>
                  <p className="text-gray-600">AI-powered resource discovery with web search capabilities</p>
                </div>
              </div>

              <Card className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900">Find Educational Resources</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Topic/Subject
                    </label>
                    <input
                      type="text"
                      value={resourceTopic}
                      onChange={(e) => setResourceTopic(e.target.value)}
                      placeholder="e.g., Photosynthesis, World War II, Algebra"
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Grade Level (Optional)
                    </label>
                    <select
                      value={resourceGrade}
                      onChange={(e) => setResourceGrade(e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Any grade level</option>
                      <option value="elementary">Elementary (K-5)</option>
                      <option value="middle">Middle School (6-8)</option>
                      <option value="high">High School (9-12)</option>
                      <option value="college">College/University</option>
                    </select>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <div className="flex items-start gap-2">
                    <Globe size={16} className="text-blue-600 mt-0.5" />
                    <div>
                      <strong className="text-blue-800">Web-Based Discovery:</strong>
                      <p className="text-sm text-blue-700 mt-1">
                        Searches across YouTube, Khan Academy, Coursera, academic papers, and interactive
                        simulations to find the best educational materials.
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={findResources}
                  disabled={loading || !resourceTopic.trim()}
                  variant="primary"
                  size="lg"
                  icon={Search}
                  loading={loading}
                  className="w-full"
                >
                  {loading ? "Searching Resources..." : "Find Educational Resources"}
                </Button>
              </Card>

              {response && (
                <Card>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Recommended Resources</h3>
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                    <pre className="whitespace-pre-wrap text-sm text-gray-800 leading-relaxed">
                      {response}
                    </pre>
                  </div>
                </Card>
              )}
            </div>
          )}

          {/* MCQ Generation View */}
          {sidebarView === "mcq" && mode === "teacher" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <BookOpen className="text-blue-600" size={24} />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Generate MCQ Questions</h2>
                  <p className="text-gray-600">Create engaging multiple choice questions for your students</p>
                </div>
              </div>

              <Card className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Topic and Requirements
                  </label>
                  <textarea
                    value={taskInput}
                    onChange={e => setTaskInput(e.target.value)}
                    placeholder="e.g., Create 5 MCQ questions on photosynthesis for grade 10 students with detailed explanations..."
                    className="w-full h-32 p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    disabled={loading}
                  />
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500">
                      {taskInput.length}/500 characters
                    </span>
                    <div className="flex gap-2">
                      <Badge variant="blue">AI-Powered</Badge>
                      <Badge variant="green">Instant Generation</Badge>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => sendToADK(`Generate MCQ questions: ${taskInput}`, "mcq")}
                    disabled={loading || !taskInput.trim()}
                    variant="primary"
                    size="lg"
                    icon={Brain}
                    loading={loading}
                    className="flex-1 sm:flex-none"
                  >
                    {loading ? "Generating MCQs..." : "Generate MCQs"}
                  </Button>

                  {response && (
                    <Button
                      onClick={() => saveContent("mcq")}
                      variant="success"
                      size="lg"
                      icon={Save}
                    >
                      Save MCQs
                    </Button>
                  )}
                </div>
              </Card>
              Display MCQ Questions
              Display MCQ Questions for Teachers
              {mcqData && (
                <Card>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Generated MCQ Questions</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Topic: {mcqData.metadata?.topic} • {mcqData.questions?.length} Questions • {mcqData.metadata?.difficulty} Difficulty
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" icon={Copy}>
                        Copy All
                      </Button>
                      <Button variant="outline" size="sm" icon={Download}>
                        Export PDF
                      </Button>
                      <Button variant="outline" size="sm" icon={Share}>
                        Share with Students
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {mcqData.questions?.map((question, index) => (
                      <div key={question.id} className="p-6 rounded-xl border border-gray-200 bg-white hover:shadow-sm transition-all">
                        <div className="flex items-start gap-4">
                          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            {/* Question */}
                            <h4 className="text-lg font-medium text-gray-900 mb-4 leading-relaxed">
                              {question.question}
                            </h4>

                            {/* Options */}
                            <div className="grid grid-cols-1 gap-3 mb-4">
                              {Object.entries(question.options).map(([option, text]) => {
                                const isCorrect = question.correct_answer === option;

                                return (
                                  <div
                                    key={option}
                                    className={`p-4 rounded-lg border-2 ${isCorrect
                                      ? 'border-green-500 bg-green-50'
                                      : 'border-gray-300 bg-gray-50'
                                      }`}
                                  >
                                    <div className="flex items-start gap-3">
                                      <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold ${isCorrect
                                        ? 'border-green-500 bg-green-500 text-white'
                                        : 'border-gray-400 bg-white text-gray-600'
                                        }`}>
                                        {option}
                                      </span>
                                      <span className="flex-1 text-gray-800">{text}</span>
                                      {isCorrect && (
                                        <div className="flex items-center gap-2">
                                          <CheckCircle size={20} className="text-green-600" />
                                          <Badge variant="green" size="sm">Correct Answer</Badge>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                            {/* Answer Explanation */}
                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                              <div className="flex items-start gap-2">
                                <Lightbulb size={16} className="text-blue-600 mt-0.5" />
                                <div>
                                  <strong className="text-blue-800">Explanation:</strong>
                                  <p className="text-sm text-blue-700 mt-1">{question.explanation}</p>
                                </div>
                              </div>
                            </div>

                            {/* Question Metadata */}
                            <div className="flex items-center gap-4 mt-4 text-xs">
                              <Badge variant="blue" size="sm">
                                {question.difficulty || 'Medium'}
                              </Badge>
                              <Badge variant="purple" size="sm">
                                {question.question_type?.replace('_', ' ') || 'General'}
                              </Badge>
                              <Badge variant="green" size="sm">
                                Answer: {question.correct_answer}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Summary Footer */}
                  <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900">Question Set Summary</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {mcqData.questions?.length} questions ready for distribution •
                          Generated on {new Date().toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="primary" size="sm" icon={Share}>
                          Share with Class
                        </Button>
                        <Button variant="outline" size="sm" icon={Settings}>
                          Modify Questions
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              {/* Fallback response display */}
              {response && !mcqData && (
                <Card>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">Response</h3>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" icon={Copy}>
                        Copy
                      </Button>
                      <Button variant="outline" size="sm" icon={ExternalLink}>
                        Export
                      </Button>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-100">
                    <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 leading-relaxed">
                      {response}
                    </pre>
                  </div>
                </Card>
              )}
            </div>
          )}

          {/* Visualization View */}
          {sidebarView === "visualize" && mode === "teacher" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Brain className="text-green-600" size={24} />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Create Visualizations</h2>
                  <p className="text-gray-600">Build interactive visual content to enhance learning</p>
                </div>
              </div>

              <Card className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Visualization Request
                  </label>
                  <textarea
                    value={taskInput}
                    onChange={e => setTaskInput(e.target.value)}
                    placeholder="e.g., Create a 3D interactive model of the solar system with planet animations and information panels..."
                    className="w-full h-32 p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                    disabled={loading}
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => sendToADK(`Create visualization: ${taskInput}`, "visualization")}
                    disabled={loading || !taskInput.trim()}
                    variant="success"
                    size="lg"
                    icon={Brain}
                    loading={loading}
                    className="flex-1 sm:flex-none"
                  >
                    {loading ? "Creating..." : "Create Visualization"}
                  </Button>

                  {htmlContent && (
                    <Button
                      onClick={() => saveContent("visualization")}
                      variant="primary"
                      size="lg"
                      icon={Save}
                    >
                      Save Visualization
                    </Button>
                  )}
                </div>
              </Card>

              {htmlContent && (
                <Card>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">Generated Visualization</h3>
                    <div className="flex gap-2">
                      <Button
                        onClick={toggleFullscreen}
                        variant="outline"
                        size="sm"
                        icon={isFullscreen ? Minimize2 : Maximize2}
                      >
                        {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                      </Button>
                      <Button
                        onClick={() => {
                          const blob = new Blob([htmlContent], { type: 'text/html' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = 'visualization.html';
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          URL.revokeObjectURL(url);
                        }}
                        variant="outline"
                        size="sm"
                        icon={Download}
                      >
                        Download HTML
                      </Button>
                      <Button
                        onClick={() => {
                          navigator.clipboard.writeText(htmlContent);
                          setNotifications(prev => [...prev, {
                            id: Date.now(),
                            message: "HTML code copied to clipboard!",
                            time: "Just now",
                            unread: true
                          }]);
                        }}
                        variant="outline"
                        size="sm"
                        icon={Copy}
                      >
                        Copy Code
                      </Button>
                    </div>
                  </div>
                  <div className="relative overflow-hidden rounded-xl border border-gray-200">
                    <iframe
                      id="visualization-iframe"
                      title="Visualization Preview"
                      srcDoc={htmlContent}
                      className={`w-full bg-white transition-all duration-300 ${isFullscreen
                        ? 'fixed inset-0 z-50 h-screen'
                        : 'h-96'
                        }`}
                      style={{
                        ...(isFullscreen && {
                          position: 'fixed',
                          top: 0,
                          left: 0,
                          width: '100vw',
                          height: '100vh',
                          zIndex: 9999,
                          border: 'none',
                          borderRadius: 0
                        })
                      }}
                    />
                    {isFullscreen && (
                      <div className="fixed top-4 right-4 z-[10000]">
                        <Button
                          onClick={toggleFullscreen}
                          variant="secondary"
                          size="sm"
                          icon={X}
                          className="bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg"
                        >
                          Exit Fullscreen
                        </Button>
                      </div>
                    )}
                  </div>
                  {!isFullscreen && (
                    <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-100">
                      <div className="flex items-center gap-2 text-sm text-green-700">
                        <Eye size={16} />
                        <span>Click fullscreen button above for better viewing experience</span>
                      </div>
                    </div>
                  )}
                </Card>
              )}



              {response && !htmlContent && (
                <Card>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Response</h3>
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border border-green-100">
                    <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 leading-relaxed">
                      {response}
                    </pre>
                  </div>
                </Card>
              )}
            </div>
          )}

          {/* Game Creation View */}
          {sidebarView === "game" && mode === "teacher" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Gamepad2 className="text-purple-600" size={24} />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Create Educational Games</h2>
                  <p className="text-gray-600">Design interactive games to make learning fun and engaging</p>
                </div>
              </div>

              <Card className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Game Description
                  </label>
                  <textarea
                    value={taskInput}
                    onChange={e => setTaskInput(e.target.value)}
                    placeholder="e.g., Create a math puzzle game with increasing difficulty levels for elementary students..."
                    className="w-full h-32 p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    disabled={loading}
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => sendToADK(`Create educational game: ${taskInput}`, "game")}
                    disabled={loading || !taskInput.trim()}
                    variant="purple"
                    size="lg"
                    icon={Gamepad2}
                    loading={loading}
                    className="flex-1 sm:flex-none"
                  >
                    {loading ? "Creating Game..." : "Create Game"}
                  </Button>

                  {htmlContent && (
                    <Button
                      onClick={() => saveContent("visualization")}
                      variant="primary"
                      size="lg"
                      icon={Save}
                    >
                      Save Game
                    </Button>
                  )}
                </div>
              </Card>
              {htmlContent && (
                <Card>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">Generated Visualization</h3>
                    <div className="flex gap-2">
                      <Button
                        onClick={toggleFullscreen}
                        variant="outline"
                        size="sm"
                        icon={isFullscreen ? Minimize2 : Maximize2}
                      >
                        {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                      </Button>
                      <Button
                        onClick={() => {
                          const blob = new Blob([htmlContent], { type: 'text/html' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = 'visualization.html';
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          URL.revokeObjectURL(url);
                        }}
                        variant="outline"
                        size="sm"
                        icon={Download}
                      >
                        Download HTML
                      </Button>
                      <Button
                        onClick={() => {
                          navigator.clipboard.writeText(htmlContent);
                          setNotifications(prev => [...prev, {
                            id: Date.now(),
                            message: "HTML code copied to clipboard!",
                            time: "Just now",
                            unread: true
                          }]);
                        }}
                        variant="outline"
                        size="sm"
                        icon={Copy}
                      >
                        Copy Code
                      </Button>
                    </div>
                  </div>
                  <div className="relative overflow-hidden rounded-xl border border-gray-200">
                    <iframe
                      id="visualization-iframe"
                      title="Visualization Preview"
                      srcDoc={htmlContent}
                      className={`w-full bg-white transition-all duration-300 ${isFullscreen
                        ? 'fixed inset-0 z-50 h-screen'
                        : 'h-96'
                        }`}
                      style={{
                        ...(isFullscreen && {
                          position: 'fixed',
                          top: 0,
                          left: 0,
                          width: '100vw',
                          height: '100vh',
                          zIndex: 9999,
                          border: 'none',
                          borderRadius: 0
                        })
                      }}
                    />
                    {isFullscreen && (
                      <div className="fixed top-4 right-4 z-[10000]">
                        <Button
                          onClick={toggleFullscreen}
                          variant="secondary"
                          size="sm"
                          icon={X}
                          className="bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg"
                        >
                          Exit Fullscreen
                        </Button>
                      </div>
                    )}
                  </div>
                  {!isFullscreen && (
                    <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-100">
                      <div className="flex items-center gap-2 text-sm text-green-700">
                        <Eye size={16} />
                        <span>Click fullscreen button above for better viewing experience</span>
                      </div>
                    </div>
                  )}
                </Card>
              )}

              {response && !htmlContent && (
                <Card>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Response</h3>
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-100">
                    <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 leading-relaxed">
                      {response}
                    </pre>
                  </div>
                </Card>
              )}
            </div>
          )}

          {/* Enhanced Chat View */}
          {sidebarView === "chat" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <MessageCircle className="text-white" size={24} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">AI Assistant</h2>
                    <p className="text-gray-600">Get instant help and answers to your questions</p>
                  </div>
                </div>

                {/* Connection Status & Model Toggle */}
                <div className="flex items-center gap-3">
                  {/* Connection Status */}
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${isOnline ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                    }`}>
                    <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                    <span className="text-sm font-medium">
                      {isOnline ? 'Online' : 'Offline'}
                    </span>
                  </div>

                  {/* Model Toggle */}
                  <Button
                    onClick={() => setUseLocalModel(!useLocalModel)}
                    variant={useLocalModel ? "success" : "outline"}
                    size="sm"
                    icon={useLocalModel ? Shield : Globe}
                  >
                    {useLocalModel ? 'Local AI' : 'Cloud AI'}
                  </Button>
                </div>
              </div>

              <Card className="h-[600px] flex flex-col">
                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {chat.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageCircle size={32} className="text-blue-600" />
                      </div>
                      <h4 className="text-lg font-medium text-gray-900 mb-2">Start a conversation</h4>
                      <p className="text-gray-600 mb-6">
                        Ask questions, upload images for analysis, or get help with educational content
                      </p>
                      <div className="flex gap-2 justify-center flex-wrap">
                        <Badge variant="blue">Text Analysis</Badge>
                        <Badge variant="green">Image Recognition</Badge>
                        <Badge variant="purple">Educational Support</Badge>
                        <Badge variant="orange">All Agent Features</Badge>
                      </div>
                    </div>
                  ) : (
                    <>
                      {chat.map(message => (
                        <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                          <div className={`max-w-xs lg:max-w-md ${message.sender === "user"
                            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                            : "bg-gray-50 text-gray-800 border border-gray-200"
                            } rounded-2xl px-6 py-4 shadow-sm`}>
                            {message.image && (
                              <img
                                src={message.image}
                                alt="Uploaded"
                                className="max-w-full h-32 object-cover rounded-lg mb-3 border"
                              />
                            )}
                            <p className="text-sm leading-relaxed">{message.text}</p>
                            <div className="flex items-center justify-between mt-2">
                              <p className={`text-xs ${message.sender === "user" ? "text-blue-100" : "text-gray-500"}`}>
                                {message.timestamp}
                              </p>
                              {message.sender === "bot" && message.modelUsed && (
                                <Badge
                                  variant={message.modelUsed === "local" ? "green" : "blue"}
                                  size="sm"
                                  className="ml-2"
                                >
                                  {message.modelUsed === "local" ? "Local AI" :
                                    message.modelUsed === "cloud (fallback)" ? "Cloud (FB)" : "Cloud"}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}

                      {isTyping && (
                        <div className="flex justify-start">
                          <div className="bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 shadow-sm">
                            <div className="flex items-center gap-2">
                              <div className="flex gap-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                              </div>
                              <span className="text-xs text-gray-500">AI is typing...</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Image Preview */}
                {selectedImage && (
                  <div className="border-t border-gray-200 p-4">
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <img src={selectedImage} alt="Preview" className="w-12 h-12 object-cover rounded-lg" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-blue-800">Image ready for upload</p>
                        <p className="text-xs text-blue-600">The AI will analyze this image with your message</p>
                      </div>
                      <Button
                        onClick={() => setSelectedImage(null)}
                        variant="ghost"
                        size="sm"
                        icon={X}
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                      />
                    </div>
                  </div>
                )}

                {/* Chat Input */}
                <div className="border-t border-gray-200 p-4">
                  <div className="flex gap-3">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={chatInput}
                        onChange={e => setChatInput(e.target.value)}
                        placeholder="Ask anything or describe what you need help with..."
                        className="w-full p-4 pr-16 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        onKeyDown={e => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            sendChatMessage();
                          }
                        }}
                      />
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex gap-2">
                        <label className="cursor-pointer text-gray-400 hover:text-gray-600 transition-colors">
                          <Camera size={20} />
                          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                        </label>
                        <button className="text-gray-400 hover:text-gray-600 transition-colors">
                          <Mic size={20} />
                        </button>
                      </div>
                    </div>
                    <Button
                      onClick={sendChatMessage}
                      disabled={!chatInput.trim() && !selectedImage}
                      variant="primary"
                      size="lg"
                      icon={Send}
                      className="px-6"
                    >
                    </Button>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <p className="text-xs text-gray-500">
                      Press Enter to send, Shift+Enter for new line
                    </p>
                    <div className="flex gap-2">
                      <Badge variant="blue">All Agents Available</Badge>
                      <Badge variant="green">24/7 Support</Badge>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </main>
      </div>

      {/* Debug Panel */}
      {raw && (
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Card>
            <details>
              <summary className="cursor-pointer font-medium text-gray-700 hover:text-gray-900 flex items-center gap-2">
                <Settings size={16} />
                View Raw Response (Debug Mode)
              </summary>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                <pre className="text-xs overflow-auto max-h-64 text-gray-600 font-mono">
                  {JSON.stringify(raw, null, 2)}
                </pre>
              </div>
            </details>
          </Card>
        </div>
      )}
    </div>
  );
}

// Navigation Item Component
function NavItem({ icon: Icon, label, active, onClick, collapsed, badge }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group ${active
        ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border-l-4 border-blue-500 shadow-sm'
        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
        }`}
    >
      <Icon size={20} className={active ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'} />
      {!collapsed && (
        <>
          <span className="font-medium flex-1">{label}</span>
          {badge && <Badge variant="blue" size="sm">{badge}</Badge>}
          {active && <ChevronRight size={16} className="text-blue-600" />}
        </>
      )}
    </button>
  );
}

export default App;