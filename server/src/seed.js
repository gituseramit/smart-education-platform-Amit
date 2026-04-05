const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

// Load models
const User = require('./models/User');
const MentorProfile = require('./models/MentorProfile');
const Company = require('./models/Company');
const Internship = require('./models/Internship');
const Post = require('./models/Post');
const Resource = require('./models/Resource');

const seedData = async () => {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB.');

    // Clear existing data
    console.log('Clearing existing data...');
    const collections = ['users', 'mentorprofiles', 'companies', 'internships', 'posts', 'resources'];
    for (const col of collections) {
      try {
        await mongoose.connection.db.dropCollection(col);
      } catch (e) {
        // Collection might not exist, ignore
      }
    }

    // 1. Create Users
    console.log('Creating users...');
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('password123', salt);

    const users = await User.insertMany([
      { name: 'Admin User', email: 'admin@sep.com', password, role: 'admin' },
      { name: 'Dr. Sarah Chen', email: 'sarah.chen@sep.com', password, role: 'mentor' },
      { name: 'Marcus Sterling', email: 'marcus.s@sep.com', password, role: 'mentor' },
      { name: 'Priya Sharma', email: 'priya.s@sep.com', password, role: 'mentor' },
      { name: 'John Doe', email: 'john@student.com', password, role: 'student' },
      { name: 'Jane Smith', email: 'jane@student.com', password, role: 'student' },
      { name: 'Dr. Robert Fox', email: 'robert.fox@sep.com', password, role: 'counselor' }
    ]);

    const admin = users[0];
    const sarah = users[1];
    const marcus = users[2];
    const priya = users[3];
    const student = users[4];

    // 2. Create Mentor Profiles
    console.log('Creating mentor profiles...');
    await MentorProfile.insertMany([
      {
        userId: sarah._id,
        name: 'Dr. Sarah Chen',
        avatar: 'https://i.pravatar.cc/150?u=sarah',
        bio: 'PhD in Neuroscience and AI. 10+ years experience in deep learning and cognitive architectures.',
        expertise: ['Deep Learning', 'Neuroscience', 'Python', 'PyTorch'],
        industry: 'Engineering',
        experience: 12,
        rating: 4.9,
        sessionCount: 156
      },
      {
        userId: marcus._id,
        name: 'Marcus Sterling',
        avatar: 'https://i.pravatar.cc/150?u=marcus',
        bio: 'Senior Architect at Meta. Expert in large scale distributed systems and system design.',
        expertise: ['System Design', 'Distributed Systems', 'Go', 'Kubernetes'],
        industry: 'Engineering',
        experience: 8,
        rating: 4.8,
        sessionCount: 89
      },
      {
        userId: priya._id,
        name: 'Priya Sharma',
        avatar: 'https://i.pravatar.cc/150?u=priya',
        bio: 'Lead UI/UX Designer at Google. Passionate about creating intuitive and accessible digital experiences.',
        expertise: ['UI/UX Design', 'Figma', 'Product Strategy', 'User Research'],
        industry: 'Design',
        experience: 6,
        rating: 4.7,
        sessionCount: 112
      }
    ]);

    // 3. Create Companies
    console.log('Creating companies...');
    const companies = await Company.insertMany([
      { name: 'Google', location: 'Bangalore / Remote', industry: 'Tech', website: 'https://google.com' },
      { name: 'Microsoft', location: 'Hyderabad', industry: 'Tech', website: 'https://microsoft.com' },
      { name: 'Meta', location: 'Remote', industry: 'Tech', website: 'https://meta.com' },
      { name: 'Razorpay', location: 'Bangalore', industry: 'Fintech', website: 'https://razorpay.com' }
    ]);

    // 4. Create Internships
    console.log('Creating internships...');
    await Internship.insertMany([
      {
        company: 'Google',
        companyId: companies[0]._id,
        role: 'Software Engineering Intern',
        description: 'Work on large-scale distributed systems.',
        requirements: ['BS in Computer Science', 'Data structures & Algorithms'],
        skillsRequired: ['C++', 'Java', 'Python'],
        location: 'Bangalore',
        stipend: 80000,
        duration: '3 months',
        type: 'hybrid',
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        postedBy: admin._id
      },
      {
        company: 'Microsoft',
        companyId: companies[1]._id,
        role: 'Cloud Engineering Intern',
        description: 'Azure infrastructure and devops.',
        requirements: ['Basic cloud knowledge', 'Scripting skills'],
        skillsRequired: ['Azure', 'PowerShell', 'Docker'],
        location: 'Hyderabad',
        stipend: 75000,
        duration: '6 months',
        type: 'onsite',
        deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        postedBy: admin._id
      },
      {
        company: 'Meta',
        companyId: companies[2]._id,
        role: 'Product Design Intern',
        description: 'Design mobile-first social experiences.',
        requirements: ['Portfolio in Figma', 'UI principles'],
        skillsRequired: ['Figma', 'Prototyping', 'UX Research'],
        location: 'Remote',
        stipend: 70000,
        duration: '3 months',
        type: 'remote',
        deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        postedBy: admin._id
      }
    ]);

    // 5. Create Community Posts
    console.log('Creating community posts...');
    await Post.insertMany([
      {
        author: student._id,
        title: 'How to prepare for System Design interviews?',
        content: 'I have my interview at a top tech company next week. Any tips for the system design round?',
        category: 'Engineering',
        tags: ['Interview', 'System Design']
      },
      {
        author: sarah._id,
        title: 'Ethics of Generative AI',
        content: 'Does your cognitive focus align with ethical AI development? Let\'s discuss the implications of LLMs.',
        category: 'AI',
        tags: ['AI', 'Ethics'],
        isPinned: true
      }
    ]);

    // 6. Create Resources
    console.log('Creating resources...');
    await Resource.insertMany([
      {
        title: 'Data Structures Masterclass Notes',
        description: 'Complete notes covering Trees, Graphs, and DP.',
        subject: 'Computer Science',
        resourceType: 'pdf',
        uploadedBy: 'Dr. Sarah Chen',
        noteContent: 'Focus on recursion and time complexity.',
      },
      {
        title: 'Advanced React Patterns',
        description: 'Guide on HOCs, Render Props, and Compound Components.',
        subject: 'Web Development',
        resourceType: 'note',
        uploadedBy: 'Marcus Sterling',
        noteContent: 'Modern React patterns for scaling applications.',
      }
    ]);

    console.log('Database seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
