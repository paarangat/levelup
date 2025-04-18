import React from 'react';
import { createGlobalStyle } from 'styled-components';
import MainAppBg from '@assets/Background_Main_App.png';

const StyledGlobals = createGlobalStyle`
  :root {
    --color-primary: #EDC9FF;
    --color-secondary: #FED4E7;
    --color-accent-1: #F2B79F;
    --color-accent-2: #E5B769;
    --color-accent-3: #D8CC34;
    --spacing-xs: 0.25rem;
    --spacing-sm: 0.5rem;
    --spacing-md: 1rem;
    --spacing-lg: 1.5rem;
    --spacing-xl: 2rem;
    --spacing-xxl: 3rem;
    --font-size-sm: 0.875rem;
    --font-size-base: 1rem;
    --font-size-md: 1.125rem;
    --font-size-lg: 1.25rem;
    --font-size-xl: 1.5rem;
    --font-size-xxl: 2rem;
    --font-size-xxxl: 2.5rem;
    --border-radius-sm: 0.25rem;
    --border-radius-md: 0.5rem;
    --border-radius-lg: 1rem;
  }

  * {
    box-sizing: border-box;
  }

  body {
    font-family: 'Outfit', sans-serif;
    font-size: var(--font-size-base);
    overflow-x: hidden;
    margin: 0;
    padding: 0;
    line-height: 1.5;
  }
  
  h1, h2, h3, h4, h5, h6 {
    font-family: 'Poppins', sans-serif;
    margin-top: 0;
    line-height: 1.2;
  }

  h1 {
    font-size: var(--font-size-xxxl);
    margin-bottom: var(--spacing-xl);
  }

  h2 {
    font-size: var(--font-size-xxl);
    margin-bottom: var(--spacing-lg);
  }

  h3 {
    font-size: var(--font-size-xl);
    margin-bottom: var(--spacing-md);
  }

  p {
    margin-bottom: var(--spacing-md);
  }

  button, input, select, textarea {
    font-family: inherit;
    font-size: 100%;
  }
  
  .app-layout {
    min-height: 100vh;
    padding-bottom: var(--spacing-xl);
    background-image: url(${MainAppBg});
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
  }

  .content-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 5rem 1rem 1rem;
  }

  .card {
    background-color: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(5px);
    border-radius: var(--border-radius-lg);
    padding: var(--spacing-lg);
    margin-bottom: var(--spacing-lg);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  }
  
  .gradientText {
    background: linear-gradient(90deg, var(--color-primary), var(--color-secondary));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
  }
  
  ::-webkit-scrollbar {
    width: 10px;
  }
  
  ::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  
  ::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, var(--color-primary), var(--color-secondary));
    border-radius: 10px;
  }

  @keyframes gradient-x {
    0%, 100% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  .animate-float {
    animation: float 3s ease-in-out infinite;
  }

  .bg-animated {
    background-size: 400% 400%;
    animation: gradient-x 15s ease infinite;
  }

  .breathable-text {
    line-height: 1.6;
    letter-spacing: 0.5px;
  }

  .spacer-sm {
    margin: var(--spacing-sm) 0;
  }

  .spacer-md {
    margin: var(--spacing-md) 0;
  }

  .spacer-lg {
    margin: var(--spacing-lg) 0;
  }
`;

const GlobalStyles: React.FC = () => <StyledGlobals />;

export default GlobalStyles;
