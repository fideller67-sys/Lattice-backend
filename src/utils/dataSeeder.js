import mongoose from 'mongoose';
import dotenv from 'dotenv';
import NavigationNode from '../models/NavigationNode.js';
import PageContent from '../models/PageContent.js';
import connectDB from '../config/db.js';

dotenv.config();

const navNodes = [
  { title: 'Workspace Settings', slug: 'workspace-settings', category: 'WORKSPACE', displayOrder: 1 },
  { title: 'General Channel', slug: 'general-channel', category: 'TEAM CHANNELS', displayOrder: 1 },
  { title: 'Frontend Team', slug: 'frontend-team', category: 'TEAM CHANNELS', displayOrder: 2 },
  { title: 'Sprint 14 Board', slug: 'sprint-14-board', category: 'PROJECTS', displayOrder: 1 },
  { title: 'User Research', slug: 'user-research', category: 'PROJECTS', displayOrder: 2 },
  { title: 'Admin Dashboard', slug: 'admin-dashboard', category: 'ADMINISTRATION', displayOrder: 1, isLocked: true },
];

const pageContents = [
  {
    title: 'Sprint 14 Board',
    slug: 'sprint-14-board',
    category: 'PROJECTS',
    developerPayload: {
      activeSprintVelocity: 42,
      openBlockersCount: 3,
      codeTelemetryLogs: 'All systems nominal',
      assignedBranches: ['feature/login', 'bugfix/header'],
    },
    pmPayload: {
      okrAlignmentTags: ['Q2-Growth', 'User-Retention'],
      userImpactScore: 8.5,
      cohortRolloutPercentage: 50,
      dependencyMapping: { 'API Gateway': 'Pending' },
    },
    directorPayload: {
      headcountAllocated: 5,
      capExBudgetBurn: 15000,
      riskLevelAssessment: 'Low',
      complianceFlags: { 'GDPR': 'Clear' },
    }
  }
];

const seedData = async () => {
  try {
    await connectDB();

    console.log('Clearing existing Navigation Nodes and Page Content...');
    await NavigationNode.deleteMany();
    await PageContent.deleteMany();

    console.log('Seeding Navigation Nodes...');
    await NavigationNode.insertMany(navNodes);

    console.log('Seeding Page Content...');
    await PageContent.insertMany(pageContents);

    console.log('✅ Data Seeded Successfully');
    process.exit();
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
