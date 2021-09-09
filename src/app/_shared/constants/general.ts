export const PlatformModules = [
  { name: 'dashboard' },
  { name: 'campaigns', isGuarded: true },
  { name: 'units', isGuarded: true },
  {
    name: 'reports',
    isGuarded: true,
    subModules: [
      { name: 'reports', isGuarded: true },
      { name: 'sets', isGuarded: true, hasParentPrefix: true }
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
      { name: 'schedules', isGuarded: true }
    ]
  },
];

export const AdminModules = [
  { name: 'organizations' }
];

export const UnitModules = [
  { name: 'general', label: 'general' },
  { name: 'campaigns', label: 'campaigns' },
  { name: 'calls', label: 'incoming_calls' },
];

export const Locales = [
  { label: 'עברית', code: 'he', key: 'hebrew' },
  { label: 'English', code: 'en', key: 'english' }
];
