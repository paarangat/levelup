export const theme = {
  colors: {
    primary: {
      pink: '#e81cff',
      blue: '#40c9ff',
    },
    secondary: {
      lavender: '#EDC9FF',
      pink: '#FED4E7',
      peach: '#F2B79F',
      gold: '#E5B769',
      yellow: '#D8CC34',
    },
    // Adding direct color references for easier access
    accent1: '#F2B79F',
    accent2: '#E5B769',
    accent3: '#D8CC34',
    black: '#000000',
    status: {
      excellent: '#22c55e', // green-500
      good: '#3b82f6',     // blue-500
      fair: '#f59e0b',     // amber-500
      needsWork: '#ef4444', // red-500
    },
    dark: '#333333',
    light: '#f8f9fa',
    white: '#ffffff',
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    }
  },
  gradients: {
    primary: 'linear-gradient(90deg, #C27AFF, #FFA6CE, #F49C82, #D9983F, #C6B420)',
    secondary: 'linear-gradient(135deg, #F49C82 0%, #E5B769 100%)',
    cardBefore: 'linear-gradient(135deg, #EDC9FF 0%, #FFA6CE 100%)',
    cardAfter: 'linear-gradient(135deg, #F2B79F 0%, #E5B769 100%)',
    background: 'linear-gradient(135deg, #EDC9FF 0%, #FED4E7 20%, #F2B79F 40%, #E5B769 70%, #D8CC34 100%)',
  },

  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
  borderRadius: {
    sm: '0.125rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px',
  },
  transitions: {
    default: '0.3s ease',
    slow: '0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },
  fontFamily: {
    outfit: "'Outfit', sans-serif",
    poppins: "'Poppins', sans-serif",
    montserrat: "'Poppins', sans-serif", // Fallback to Poppins for references to montserrat
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    regular: 400, // Alias for normal weight
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    md: '1.125rem',
    lg: '1.25rem',
    xl: '1.5rem',
    '2xl': '2rem',
    '3xl': '2.5rem',
    '4xl': '3rem',
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
};

export default theme;
