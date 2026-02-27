import axiosClient from '../lib/axiosClient';

// Re-export axios instance
export { axiosClient };

export { default as authAPI } from './endpoints/auth'
export { usersAPI } from './endpoints/users';
export { workspacesAPI } from './endpoints/workspaces';
export { projectsAPI } from './endpoints/projects';
export { tasksAPI } from './endpoints/tasks';
export { sectionsAPI } from './endpoints/sections';
export { milestonesAPI } from './endpoints/milestones';
export { timeEntriesAPI } from './endpoints/timeEntries'
export { notificationsAPI } from './endpoints/notifications';
export { invitationsAPI } from './endpoints/invitations';