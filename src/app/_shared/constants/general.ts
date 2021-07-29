export const PlatformModules = [
  { name: 'dashboard', isGuarded: false },
  { name: 'campaigns', isGuarded: true },
  { name: 'reports', isGuarded: true },
  { name: 'units', isGuarded: true },
  { name: 'users', isGuarded: true },
  {
    name: 'settings',
    isGuarded: false,
    subModules: [
      { name: 'permissions', isGuarded: false },
      { name: 'schedules', isGuarded: false }
    ]
  },
];

export const AdminModules = [
  { name: 'organizations' }
];

export const UnitModules = [
  { name: '', label: 'general' },
  { name: 'campaigns', label: 'campaigns' },
  { name: 'calls', label: 'incoming_calls' },
];

export const Langs = [
  { label: 'עברית', code: 'he', key: 'hebrew' },
  { label: 'English', code: 'en', key: 'english' }
];
