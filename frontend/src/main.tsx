import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Grid, ThemeProvider, createTheme } from '@mui/material';
import { AuthProvider } from '@/utils/auth-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from '@/utils/auth-context';
import { CircularProgress } from '@mui/material';
import './main.css';

// Import the generated route tree
import { routeTree } from './routeTree.gen';

const queryClient = new QueryClient();

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {
    queryClient,
    auth: undefined!,
  },
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const theme = createTheme({
  typography: {
    fontFamily: 'roboto',
  },
  palette: {
    primary: {
      main: '#294174',
      light: '#FAF8FF',
    },
    secondary: {
      main: '#575E71',
    },
    error: {
      main: '#BA1A1A',
    },
  },
});

const App: React.FC = () => {
  const auth = useAuth();
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      {auth.refreshTokenStatus === 'pending' ? (
        <Grid container justifyContent="center" alignContent="center" height="100%">
          <CircularProgress size={60} />
        </Grid>
      ) : (
        <RouterProvider router={router} context={{ auth }} />
      )}
    </div>
  );
};

const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <AuthProvider>
          <StrictMode>
            <ThemeProvider theme={theme}>
              <App />
            </ThemeProvider>
          </StrictMode>
        </AuthProvider>
      </GoogleOAuthProvider>
    </QueryClientProvider>
  );
}
