import MetricDashboard from './models/MetricDashboard.js';

export const seedMetricDashboards = async () => {
  try {
    const count = await MetricDashboard.countDocuments();
    if (count > 0) {
      console.log('Metric dashboards already seeded.');
      return;
    }

    const dashboards = [
      {
        slug: 'platform-eng',
        title: 'Platform Engineering',
        metrics: [
          { label: 'Global Uptime', value: '99.98%', subtext: 'Across all core services', iconType: 'Server', color: 'emerald' },
          { label: 'Active Deployments', value: '14', subtext: '4 environments currently deploying', iconType: 'Activity', color: 'blue' },
          { label: 'Infrastructure Cost', value: '$14.2k', subtext: '-2.4% vs last month', iconType: 'Database', color: 'purple' }
        ],
        items: [
          { id: 'PL-773', name: 'Authentication Service Migration', stage: 'UAT', health: '98%', status: 'Stable', statusColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', uptime: '99.99%', deployments: 12 },
          { id: 'PL-774', name: 'GraphQL API Gateway', stage: 'Production', health: '92%', status: 'Degraded', statusColor: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20', uptime: '99.95%', deployments: 45 },
          { id: 'PL-775', name: 'Event Streaming Cluster', stage: 'Development', health: '100%', status: 'Stable', statusColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', uptime: '100%', deployments: 3 }
        ]
      },
      {
        slug: 'qa-automation',
        title: 'QA Automation',
        metrics: [
          { label: 'Total Coverage', value: '87.2%', subtext: '+1.4% from last sprint', iconType: 'Shield', color: 'emerald' },
          { label: 'Tests Passed', value: '858', subtext: 'Out of 883 total tests executed', iconType: 'CheckCircle2', color: 'blue' },
          { label: 'Avg Execution Time', value: '14m 20s', subtext: '-2m 10s optimization', iconType: 'Clock', color: 'purple' }
        ],
        items: [
          { id: 'QA-401', name: 'Core API Integration Suite', coverage: '94%', lastRun: '2 hrs ago', status: 'Passing', statusColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', tests: 342, failures: 2 },
          { id: 'QA-402', name: 'Payment Processing E2E', coverage: '88%', lastRun: '4 hrs ago', status: 'Warning', statusColor: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20', tests: 156, failures: 8 },
          { id: 'QA-403', name: 'Authentication Flow Regression', coverage: '97%', lastRun: '1 hr ago', status: 'Passing', statusColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', tests: 89, failures: 0 },
          { id: 'QA-404', name: 'Mobile SDK Compatibility Matrix', coverage: '72%', lastRun: '6 hrs ago', status: 'Critical', statusColor: 'bg-red-500/10 text-red-400 border-red-500/20', tests: 204, failures: 14 },
          { id: 'QA-405', name: 'Infrastructure Load Testing', coverage: '85%', lastRun: '3 hrs ago', status: 'Passing', statusColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', tests: 67, failures: 1 }
        ]
      },
      {
        slug: 'release-train',
        title: 'Release Train',
        metrics: [
          { label: 'Active Trains', value: '3', subtext: '1 in Production Deployment', iconType: 'Train', color: 'emerald' },
          { label: 'Velocity', value: '18.4 pts', subtext: '+2.1 pts week over week', iconType: 'CheckCircle2', color: 'blue' },
          { label: 'Active Blockers', value: '3', subtext: 'Impacting Mobile SDK Beta', iconType: 'AlertCircle', color: 'red' }
        ],
        items: [
          { id: 'REL-v2.4.0', name: 'Q2 Core Platform Update', stage: 'Staging', lastUpdated: '10 mins ago', status: 'On Track', statusColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', tickets: 45, blockers: 0 },
          { id: 'REL-v2.5.0-beta', name: 'Mobile SDK Overhaul', stage: 'Development', lastUpdated: '2 hrs ago', status: 'At Risk', statusColor: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20', tickets: 120, blockers: 3 },
          { id: 'REL-v2.3.9', name: 'Hotfix: Auth Providers', stage: 'Production Deployment', lastUpdated: '1 min ago', status: 'Deploying', statusColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20', tickets: 2, blockers: 0 }
        ]
      },
      {
        slug: 'design-review',
        title: 'Design Review',
        metrics: [
          { label: 'Active Reviews', value: '12', subtext: '3 pending your approval', iconType: 'PenTool', color: 'emerald' },
          { label: 'Approved This Week', value: '8', subtext: '+2 from last week', iconType: 'CheckCircle2', color: 'blue' },
          { label: 'Avg Feedback Time', value: '4.2 hrs', subtext: '-1.1 hrs optimization', iconType: 'Clock', color: 'purple' }
        ],
        items: [
          { id: 'DES-112', name: 'Authentication Redesign UI', stage: 'Final Review', health: 'Approved', status: 'Ready', statusColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', designer: 'Alex R.', comments: 2 },
          { id: 'DES-113', name: 'Mobile SDK Documentation Portal', stage: 'Initial Concepts', health: 'Pending Changes', status: 'Blocked', statusColor: 'bg-red-500/10 text-red-400 border-red-500/20', designer: 'Sarah W.', comments: 15 },
          { id: 'DES-114', name: 'Billing Dashboard V2', stage: 'Prototyping', health: 'In Progress', status: 'Active', statusColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20', designer: 'Marcus T.', comments: 8 }
        ]
      },
      {
        slug: 'infra-ops',
        title: 'Infra Ops',
        metrics: [
          { label: 'Global Compute', value: '42%', subtext: 'Average across 142 nodes', iconType: 'Cpu', color: 'emerald' },
          { label: 'Active Incidents', value: '1', subtext: '1 Critical, 0 Warning', iconType: 'ShieldAlert', color: 'red' },
          { label: 'Cloud Spend', value: '$42.1k', subtext: 'Projected monthly total', iconType: 'Cloud', color: 'blue' }
        ],
        items: [
          { id: 'INC-991', name: 'High Memory Usage - Primary DB', severity: 'Critical', status: 'Investigating', statusColor: 'bg-red-500/10 text-red-400 border-red-500/20', time: '15 mins ago', engineer: 'David K.' },
          { id: 'INC-990', name: 'Cache Node Failover', severity: 'Warning', status: 'Resolved', statusColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', time: '2 hrs ago', engineer: 'Sarah W.' },
          { id: 'INC-989', name: 'Spike in API Latency', severity: 'High', status: 'Monitoring', statusColor: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20', time: '4 hrs ago', engineer: 'Marcus T.' }
        ]
      }
    ];

    await MetricDashboard.insertMany(dashboards);
    console.log('Metric dashboards seeded successfully.');
  } catch (error) {
    console.error('Error seeding metric dashboards:', error);
  }
};
