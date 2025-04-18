import React from 'react';
import { Route, Switch, useLocation } from 'wouter';
import { QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'styled-components';
import { UserProvider, useUser } from './contexts/UserContext';
import {theme} from './styles/theme';
import {queryClient} from './lib/queryClient';

// Pages
import Home from './pages/Home';
import Landing from './pages/Landing';
import AvatarCreation from './pages/AvatarCreation';
import Challenge from './pages/Challenge';
import Connect from './pages/Connect';
import Profile from './pages/Profile';
import Rewards from './pages/Rewards';
import Settings from './pages/Settings';
import NotFound from './pages/not-found';
import Todo from './pages/Todo';

// Router component to handle user state-based routing
const Router: React.FC = () => {
  const { user } = useUser();
  const [location] = useLocation();
  
  // If user is not set, only show landing and avatar creation pages
  if (!user.name) {
    // Allow only these routes for non-logged in users
    if (location !== "/" && location !== "/create-avatar") {
      window.location.href = "/";
      return null;
    }
    
    return (
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/create-avatar" component={AvatarCreation} />
        <Route path="/:rest*" component={Landing} />
      </Switch>
    );
  }
  
  // For logged in users
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/home" component={Home} />
      <Route path="/create-avatar" component={AvatarCreation} />
      <Route path="/todo" component={Todo} />
      <Route path="/challenge" component={Challenge} />
      <Route path="/connect" component={Connect} />
      <Route path="/profile" component={Profile} />
      <Route path="/rewards" component={Rewards} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
};

const App: React.FC = () => {
  return (
    <UserProvider>
      <ThemeProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <Router />
        </QueryClientProvider>
      </ThemeProvider>
    </UserProvider>
  );
};

export default App;