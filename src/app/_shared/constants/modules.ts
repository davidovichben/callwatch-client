export const PlatformModules = [
  { name: 'dashboard', icon: 'dashboard', isOpen: true },
  { name: 'units', permission: 'units', icon: 'account_tree' },
  {
    name: 'reports',
    permission: 'reports',
    icon: 'assignment',
    subModules: [
      { name: 'templates', permission: 'reports', label: 'templates' },
      { name: 'timings', permission: 'timed_reports', label: 'timed_reports' },
      { name: 'historical', permission: 'reports', label: 'historical_reports' }
    ]
  },
  { name: 'users', permission: 'users', icon: 'group' },
  {
    name: 'settings',
    icon: 'settings',
    subModules: [
      { name: 'permissions' },
      { name: 'schedules', permission: 'schedules' },
      { name: 'uniqueDays', permission: 'schedules', label: 'unique_days' },
      { name: 'switchboards', permission: 'switchboards' },
      { name: 'callbacks', permission: 'callback'  },
      { name: 'routers', permission: 'routers' },
      { name: 'acds', permission: 'switchboards' },
      { name: 'extensions', permission: 'switchboards' }
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
  { name: 'users', label: 'users' },
  { name: 'groups', label: 'groups_extensions' }
];
