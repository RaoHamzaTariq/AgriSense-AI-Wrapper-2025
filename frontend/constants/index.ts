export const SOIL_TYPES = [
    { value: 'sandy', label: 'Sandy' },
    { value: 'clay', label: 'Clay' },
    { value: 'loamy', label: 'Loamy' },
  ] as const;
  
  export const SEASONS = [
    { value: 'summer', label: 'Summer' },
    { value: 'winter', label: 'Winter' },
    { value: 'monsoon', label: 'Monsoon' },
  ] as const;
  
  export const LOADING_STEPS = [
    "Analyzing climate patterns...",
    "Evaluating soil compatibility...",
    "Comparing crop suitability...",
    "Creating optimized farming plan...",
    "Finalizing recommendations..."
  ];