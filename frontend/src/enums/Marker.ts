export const MARKER_TYPES = Object.freeze([
  {value: 'flood', label: 'Flood'},
  {value: 'food', label: 'Foods'},
  {value: 'medicine', label: 'Medicine'},
  {value: 'safe_house', label: 'Safe house'},
  {value: 'emergency', label: 'Emergency'},
] as const);

export const MARKER_VALUES = Object.freeze({
  FLOOD: 'flood',
  FOOD: 'food',
  MEDICINE: 'medicine',
  SAFE_HOUSE: 'safe_house',
  EMERGENCY: 'emergency',
} as const);
