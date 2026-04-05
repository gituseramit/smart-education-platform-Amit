const User = require('../models/User');
const MentorshipSession = require('../models/MentorshipSession');
const Post = require('../models/Post');
const CounselingSession = require('../models/CounselingSession');
const Resource = require('../models/Resource');
const MentorProfile = require('../models/MentorProfile');
const CounselorProfile = require('../models/CounselorProfile');

// @desc    Get dashboard overview data
// @route   GET /api/dashboard
const getDashboard = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select('-password');

    // Real aggregation
    const [mentorSessionsCount, postsCount, upcomingMentorship, upcomingCounseling] = await Promise.all([
      MentorshipSession.countDocuments({ studentId: userId }),
      Post.countDocuments({ author: userId }),
      MentorshipSession.find({ studentId: userId, date: { $gte: new Date() } }).populate('mentorId', 'name').limit(2),
      CounselingSession.find({ student: userId, date: { $gte: new Date() } }).populate('counselor', 'name').limit(1)
    ]);

    const dashboard = {
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        university: user.university,
        profileImage: user.profileImage,
      },
      stats: {
        studyHoursThisWeek: 12.5, // Placeholder if no activity model
        coursesEnrolled: 4,
        coursesCompleted: 1,
        streakDays: 5,
        mentorSessions: mentorSessionsCount,
        communityPosts: postsCount,
      },
      upcomingSessions: [
        ...upcomingMentorship.map(s => ({ _id: s._id, title: 'Mentoring Session', mentor: s.mentorId?.name || 'Mentor', date: s.date, type: 'mentoring', status: s.status })),
        ...upcomingCounseling.map(s => ({ _id: s._id, title: 'Counseling Session', mentor: s.counselor?.name || 'Counselor', date: s.date, type: 'counseling', status: s.status }))
      ],
      mentorMessages: [
        { _id: '1', from: 'System', avatar: 'S', message: 'Welcome to your new dashboard! Explore resources and connect with mentors.', time: 'Just now', unread: true },
      ],
      communityActivity: [
        { _id: '1', user: 'Community', action: 'is active on', target: 'Smart Education Platform', time: 'Ongoing', likes: 100 },
      ],
      recommendedResources: [
        { _id: '1', title: 'Platform Orientation', type: 'guide', provider: 'Smart Ed', rating: 5.0, difficulty: 'Beginner' },
      ],
    };

    res.json({ success: true, data: dashboard });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user activity feed
// @route   GET /api/dashboard/activity
const getActivity = async (req, res) => {
  try {
    const activity = [
      { _id: '1', type: 'study', title: 'Completed Chapter 5: Data Structures', description: 'Finished binary trees and heap implementations', time: '1h ago', icon: 'book' },
      { _id: '2', type: 'mentoring', title: 'Mentor Session with Dr. Sarah Chen', description: 'Reviewed calculus integration techniques', time: '3h ago', icon: 'users' },
      { _id: '3', type: 'community', title: 'Posted in CS201 Discussion', description: 'Shared solution approach for sorting algorithms', time: '5h ago', icon: 'message' },
      { _id: '4', type: 'achievement', title: 'Earned "Week Warrior" Badge', description: '7-day study streak achieved!', time: '1d ago', icon: 'award' },
      { _id: '5', type: 'study', title: 'Started Machine Learning Module', description: 'Beginning neural network fundamentals', time: '1d ago', icon: 'book' },
      { _id: '6', type: 'internship', title: 'Applied to Google SWE Internship', description: 'Application submitted successfully', time: '2d ago', icon: 'briefcase' },
      { _id: '7', type: 'counseling', title: 'Wellbeing Check-in Completed', description: 'Monthly mental health assessment', time: '3d ago', icon: 'heart' },
      { _id: '8', type: 'study', title: 'Completed Quiz: Database Systems', description: 'Scored 92% on normalization quiz', time: '3d ago', icon: 'book' },
    ];

    res.json({ success: true, data: activity });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get progress / chart data
// @route   GET /api/dashboard/progress
const getProgress = async (req, res) => {
  try {
    const progress = {
      weeklyStudyHours: [
        { day: 'Mon', hours: 3.5 },
        { day: 'Tue', hours: 2.0 },
        { day: 'Wed', hours: 4.5 },
        { day: 'Thu', hours: 1.5 },
        { day: 'Fri', hours: 3.0 },
        { day: 'Sat', hours: 2.5 },
        { day: 'Sun', hours: 1.5 },
      ],
      courseCompletion: [
        { name: 'Data Structures', progress: 85, total: 100, color: '#6366f1' },
        { name: 'Calculus II', progress: 62, total: 100, color: '#8b5cf6' },
        { name: 'Machine Learning', progress: 30, total: 100, color: '#a855f7' },
        { name: 'Technical Writing', progress: 95, total: 100, color: '#10b981' },
        { name: 'Database Systems', progress: 48, total: 100, color: '#f59e0b' },
      ],
      overallProgress: 64,
      totalStudyHours: 142,
      averageScore: 87,
      completedAssignments: 34,
      totalAssignments: 42,
    };

    res.json({ success: true, data: progress });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get mentor dashboard data
// @route   GET /api/dashboard/mentor
const getMentorDashboard = async (req, res) => {
  try {
    const mentorProfile = await MentorProfile.findOne({ userId: req.user._id });
    if (!mentorProfile) return res.status(404).json({ success: false, message: 'Mentor profile not found' });

    const [sessions, pendingRequestsCount] = await Promise.all([
      MentorshipSession.find({ mentorId: mentorProfile._id }).populate('studentId', 'name'),
      MentorshipSession.countDocuments({ mentorId: mentorProfile._id, status: 'pending' })
    ]);

    const activeMentees = [...new Set(sessions.map(s => s.studentId?._id))].length;
    const completedSessions = sessions.filter(s => s.status === 'completed').length;
    const upcomingSessions = sessions.filter(s => s.date >= new Date() && s.status === 'confirmed');

    res.json({
      success: true,
      data: {
        stats: {
          activeMentees,
          sessionsThisMonth: completedSessions,
          avgRating: mentorProfile.rating || 4.8,
          pendingRequests: pendingRequestsCount
        },
        upcomingSessions: upcomingSessions.map(s => ({
          name: s.studentId?.name || 'Student',
          time: s.date,
          type: '1-on-1 Mentoring',
          color: '#AC6AFF'
        })),
        pendingRequests: sessions.filter(s => s.status === 'pending').slice(0, 3).map(s => ({
          name: s.studentId?.name || 'Student',
          subject: s.requestMessage || 'Help request',
          time: s.createdAt
        }))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get counselor dashboard data
// @route   GET /api/dashboard/counselor
const getCounselorDashboard = async (req, res) => {
  try {
    const counselorProfile = await CounselorProfile.findOne({ userId: req.user._id });
    if (!counselorProfile) return res.status(404).json({ success: false, message: 'Counselor profile not found' });

    const sessions = await CounselingSession.find({ counselor: req.user._id }).populate('student', 'name email');
    
    const activeClients = [...new Set(sessions.map(s => s.student?._id))].length;
    const upcomingSessions = sessions.filter(s => s.date >= new Date() && s.status === 'confirmed');

    res.json({
      success: true,
      data: {
        stats: {
          activeClients,
          sessionsThisMonth: sessions.length,
          avgSatisfaction: 4.9,
          moodImproved: '76%'
        },
        todayAppointments: upcomingSessions.map(s => ({
          name: s.student?.name || 'Student',
          time: s.date,
          type: 'Counseling Session',
          mood: 'Neutral',
          color: '#858DFF'
        })),
        recentClients: sessions.slice(0, 4).map(s => ({
          id: s.student?._id,
          name: s.student?.name || 'Student',
          concern: 'Wellbeing',
          progress: 50,
          mood: 'Neutral'
        }))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getDashboard, getActivity, getProgress, getMentorDashboard, getCounselorDashboard };
