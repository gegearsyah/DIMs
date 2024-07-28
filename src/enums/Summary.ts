export const LOCATION_CONDITION = Object.freeze([
  {
    label: 'Electricity',
    field: 'electricOn',
    icon: require('@assets/icons/electricity.png'),
    good: 'On',
    bad: 'Off',
  },
  {
    label: 'Clean Water',
    field: 'waterOn',
    icon: require('@assets/icons/water.png'),
    good: 'Available',
    bad: 'Unavailable',
  },
  {
    label: 'Sanitation',
    field: 'isSanitation',
    icon: require('@assets/icons/sanitation.png'),
    good: 'Clean',
    bad: 'Dirty',
  },
] as const);

export const FOOD_TIPS = Object.freeze([
  'Storage: High, dry place.',
  'Containers: Airtight, waterproof.',
  'Rotation: Check regularly, consume oldest first.',
  'Emergency: Ready-to-eat, non-perishable supplies.',
  'Hygiene: Clean hands, utensils, and storage area.',
] as const);

export const MEDICINE_TIPS = Object.freeze([
  'Store: Elevated, dry, dark place.',
  'Containers: Waterproof, airtight.',
  'Labels: Clear, waterproof.',
  'Rotation: Check regularly, replace expired.',
  'Emergency: Have backup supply in safe location.',
] as const);
