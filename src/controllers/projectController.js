import Project from '../models/Project.js';

export const getProjects = async (req, res) => {
  try {
    const workspace = req.user.workspaceName;
    if (!workspace) return res.status(400).json({ message: 'User must belong to a workspace' });

    let projects = await Project.find({ workspaceName: workspace });

    // If no projects exist, seed the default mock projects so the sidebar isn't totally empty
    if (projects.length === 0) {
      const defaultProjects = [
        { slug: 'core-auth-revamp', name: 'Core Auth Revamp', workspaceName: workspace, color: 'blue' },
        { slug: 'billing-v2', name: 'Billing v2', workspaceName: workspace, color: 'purple' },
        { slug: 'mobile-sdk', name: 'Mobile SDK', workspaceName: workspace, color: 'red' }
      ];
      projects = await Project.insertMany(defaultProjects);
    }

    res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createProject = async (req, res) => {
  try {
    const { name, slug, color } = req.body;
    const workspace = req.user.workspaceName;
    if (!workspace) return res.status(400).json({ message: 'User must belong to a workspace' });

    const newProject = await Project.create({
      name,
      slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
      workspaceName: workspace,
      color: color || 'emerald',
      epics: []
    });

    res.status(201).json(newProject);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getProject = async (req, res) => {
  try {
    const { slug } = req.params;
    const workspace = req.user.workspaceName;
    
    let project = await Project.findOne({ slug, workspaceName: workspace });

    // Seed mock data if not exists
    if (!project) {
      if (slug === 'core-auth-revamp') {
        project = await Project.create({
          slug: 'core-auth-revamp',
          name: 'Core Auth Revamp',
          workspaceName: workspace,
          epics: [
            {
              name: 'EPIC: AUTHENTICATION',
              color: 'bg-blue-600',
              textColor: 'text-blue-400',
              tasks: [
                { id: 'AUTH-345', title: 'Implement OAuth2 PKCE flow', priority: 'High', status: 'In Progress' },
                { id: 'AUTH-346', title: 'Refactor session token logic', priority: 'Medium', status: 'In Review' },
                { id: 'AUTH-347', title: 'Magic link email templates', priority: 'Low', status: 'To Do' },
                { id: 'AUTH-348', title: 'Add MFA enrollment screen', priority: 'Medium', status: 'To Do' },
              ],
            },
            {
              name: 'EPIC: BILLING',
              color: 'bg-amber-600',
              textColor: 'text-amber-400',
              tasks: [
                { id: 'BILL-12', title: 'Migrate legacy password hashes', priority: 'High', status: 'In Progress' },
                { id: 'BILL-13', title: 'Stripe webhook integration', priority: 'Medium', status: 'In Review' },
                { id: 'BILL-24', title: 'Invoice PDF generation', priority: 'Low', status: 'To Do' },
              ],
            },
          ]
        });
      } else if (slug === 'billing-v2') {
        project = await Project.create({
          slug: 'billing-v2',
          name: 'Billing v2',
          workspaceName: workspace,
          epics: [
            {
              name: 'EPIC: BILLING',
              color: 'bg-purple-600',
              textColor: 'text-purple-400',
              tasks: [
                { id: 'BILL-50', title: 'Subscription plan migration', priority: 'High', status: 'In Progress' },
                { id: 'BILL-51', title: 'Payment retry logic', priority: 'Medium', status: 'To Do' },
              ],
            },
          ]
        });
      } else if (slug === 'mobile-sdk') {
        project = await Project.create({
          slug: 'mobile-sdk',
          name: 'Mobile SDK',
          workspaceName: workspace,
          epics: [
            {
              name: 'EPIC: MOBILE',
              color: 'bg-red-600',
              textColor: 'text-red-400',
              tasks: [
                { id: 'MOB-10', title: 'Biometric unlock SDK shim', priority: 'High', status: 'In Progress' },
                { id: 'MOB-11', title: 'Push notification service', priority: 'Medium', status: 'On Hold' },
                { id: 'MOB-12', title: 'Cross-platform auth bridge', priority: 'Low', status: 'To Do' },
                { id: 'MOB-14', title: 'Offline caching layer', priority: 'Medium', status: 'To Do' },
              ],
            },
          ]
        });
      } else {
        return res.status(404).json({ message: 'Project not found' });
      }
    }

    res.status(200).json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const { slug } = req.params;
    const workspace = req.user.workspaceName;
    
    const project = await Project.findOneAndDelete({ slug, workspaceName: workspace });
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
