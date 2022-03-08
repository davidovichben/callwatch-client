export const PlatformModules = [
  { name: 'dashboard', icon: 'dashboard', isOpen: true },
  { name: 'units', icon: 'account_tree' },
  {
    name: 'reports',
    icon: 'assignment',
    subModules: [
      { name: 'templates', label: 'templates' },
      { name: 'sets', label: 'report_sets' },
      { name: 'timings', label: 'timed_reports' },
      { name: 'historical', label: 'historical_reports' }
    ]
  },
  { name: 'users', icon: 'group' },
  // { name: 'auditLog', label: 'audit_log', icon: 'group', isGuarded: true },
  {
    name: 'settings',
    icon: 'settings',
    isOpen: true,
    subModules: [
      { name: 'permissions' },
      { name: 'schedules' },
      { name: 'uniqueDays', label: 'unique_days' },
      { name: 'switchboards' },
      { name: 'callbacks' },
      { name: 'routers' },
      { name: 'acds' },
      { name: 'extensions' }
    ]
  },
];

export const AdminModules = [
  { name: 'organizations' }
];

export const UnitModules = [
  { name: 'general', label: 'general' },
  { name: 'users', label: 'users' },
  { name: 'groups', label: 'groups_extensions' }
];

export const Locales = [
  { label: 'עברית', code: 'he', key: 'hebrew' },
  { label: 'English', code: 'en', key: 'english' }
];
