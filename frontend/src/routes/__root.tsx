import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

export const Route = createRootRoute({
  component: () => (
    <div className="root-route">
      <Outlet />
      {(() => {
        if (!import.meta.env.PROD)
          return (
            <>
              <TanStackRouterDevtools position="bottom-right" />
            </>
          );
      })()}
    </div>
  ),
});
