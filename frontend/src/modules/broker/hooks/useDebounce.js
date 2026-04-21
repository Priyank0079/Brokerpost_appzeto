import { useState, useEffect } from 'react';
export const useDebounce = (value, delay) => { const [debouncedValue, setDebouncedValue] = useState(value); return debouncedValue; };
