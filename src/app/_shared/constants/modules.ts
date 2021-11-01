export const PlatformModules = [
  { name: 'dashboard' },
  { name: 'units', isGuarded: true },
  {
    name: 'reports',
    isGuarded: true,
    subModules: [
      { name: 'reports', isGuarded: true },
      { name: 'reportSets', label: 'report_sets', isGuarded: true }
    ]
  },
  {
    name: 'users',
    isGuarded: true
  },
  {
    name: 'settings',
    isGuarded: false,
    subModules: [
      { name: 'permissions', isGuarded: true },
      { name: 'schedules', isGuarded: true },
      { name: 'uniqueDays', label: 'unique_days', isGuarded: true },
      { name: 'switchboards', isGuarded: true }
    ]
  },
];

export const AdminModules = [
  { name: 'organizations' }
];

export const UnitModules = [
  { name: 'general', label: 'general' },
  { name: 'users', label: 'users' },
  { name: 'switchboards', label: 'switchboards' },
];

export const Locales = [
  { label: 'עברית', code: 'he', key: 'hebrew' },
  { label: 'English', code: 'en', key: 'english' }
];
