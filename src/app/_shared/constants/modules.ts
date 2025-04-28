export const PlatformModules = [
  { name: 'dashboard', icon: 'dashboard', isOpen: true },
  { name: 'units', permission: 'units', icon: 'account_tree' },
  {
    name: 'reports',
    permission: 'reports',
    icon: 'assignment',
    subModules: [
      // { name: 'templates', permission: 'reports', label: 'templates' },
      // { name: 'timings', permission: 'timed_reports', label: 'timed_reports' },
      { name: 'historical', permission: 'reports', label: 'historical_reports' }
    ]
  },
  { name: 'users', permission: 'users', icon: 'group' },
  {
    name: 'settings',
    icon: 'settings',
    subModules: [
      { name: 'general' },
      { name: 'keywords' },
      { name: 'permissions' },
      { name: 'mailServers', label: 'mail_servers', permission: 'mailServers' },
      { name: 'mailboxes', permission: 'mailServers' }
    ]
  },
  { name: 'auditTrail', label: 'audit_trail', icon: 'library_books', isOpen: true },
];

export const AdminModules = [
  { name: 'organizations' },
  { name: 'exceptions', label: 'exception_log' }
];

export const UnitModules = [
  { name: 'general', label: 'general' },
  { name: 'users', label: 'users' }
];
