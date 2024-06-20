import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import './main.css';

// Import the generated route tree
import { routeTree } from './routeTree.gen';
import { ThemeProvider, createTheme } from '@mui/material';

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#294174'
    }
  }
});

const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <ThemeProvider theme={theme}>
        <div style={{width: '100vw', height: '100vh'}}>
          <RouterProvider router={router} />
      </div>
      </ThemeProvider>
    </StrictMode>
  );
}
