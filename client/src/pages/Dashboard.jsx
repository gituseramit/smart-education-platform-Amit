import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import analyticsApi from '../services/analyticsApi';
import mentorApi from '../services/mentorApi';
import communityApi from '../services/communityApi';
import { AIInsightsWidget, WellnessWidget, MentorSessionsWidget, CommunityPulseWidget } from '../components/dashboard/widgets/PremiumWidgets';

const Dashboard = () => {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] || 'there';
  
  const [stats, setStats] = useState({ mastery: 82, weeklyGain: 5, nextTopic: 'Optimization Protocols' });
  const [sessions, setSessions] = useState([]);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const [sessionsData, postsData, analyticsData] = await Promise.all([
          mentorApi.getSessions(),
          communityApi.getPosts(),
          analyticsApi.getAnalytics()
        ]);
        setSessions(sessionsData || []);
        setPosts(postsData || []);
        if (analyticsData) {
          setStats({
            mastery: analyticsData.totalMentorshipSessions || 82,
            weeklyGain: analyticsData.totalPosts || 5,
            nextTopic: 'Advanced Architecture'
          });
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div style={{ padding: '1rem 0', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      
      {/* Welcome Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, margin: '0 0 0.5rem', color: '#111827', letterSpacing: '-0.02em' }}>
            Welcome back, {firstName}.
          </h1>
          <p style={{ margin: 0, color: 'var(--cs-text-muted)', fontSize: '1.05rem', maxWidth: '600px' }}>
            Your personal command center for growth is ready. Standardized across the Smart Education Platform.
          </p>
        </div>
        
        <button className="cs-button-primary" style={{ background: '#15803d', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.2rem' }}>⚡</span> Quick Study
        </button>
      </div>

      {/* Row 1: Insights & Wellness */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '2rem' }}>
        <AIInsightsWidget stats={stats} recentMessage={posts[0]?.title} />
        <WellnessWidget />
      </div>

      {/* Row 2: Mentors & Community */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '2rem' }}>
        <MentorSessionsWidget sessions={sessions} />
        <CommunityPulseWidget posts={posts} />
      </div>

      {/* Footer */}
      <footer style={{ 
        marginTop: '2rem', 
        paddingTop: '2rem', 
        borderTop: '1px solid var(--cs-border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: 'var(--cs-text-light)',
        fontSize: '0.85rem'
      }}>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
          <span>Accessibility</span>
          <span>Contact Support</span>
        </div>
        <div>© 2024 Smart Education Platform. All rights reserved.</div>
      </footer>
    </div>
  );
};

export default Dashboard;
