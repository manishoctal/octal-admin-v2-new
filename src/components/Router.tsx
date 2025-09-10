import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface RouteContextType {
  currentRoute: string;
  currentPath: string; // For backwards compatibility
  params: Record<string, string>;
  queryParams: URLSearchParams;
  navigate: (path: string, options?: { replace?: boolean; state?: any }) => void;
  goBack: () => void;
  goForward: () => void;
  push: (path: string, state?: any) => void;
  replace: (path: string, state?: any) => void;
}

const RouteContext = createContext<RouteContextType | undefined>(undefined);

export function useRouter() {
  const context = useContext(RouteContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
}

interface RouterProviderProps {
  children: ReactNode;
  initialRoute?: string;
}

// Route matching utilities
function matchRoute(pattern: string, path: string): { matches: boolean; params: Record<string, string> } {
  // Handle exact matches first
  if (pattern === path) {
    return { matches: true, params: {} };
  }

  // Handle dynamic segments like /users/:id or /users/:id/edit
  const patternSegments = pattern.split('/').filter(Boolean);
  const pathSegments = path.split('/').filter(Boolean);

  if (patternSegments.length !== pathSegments.length) {
    return { matches: false, params: {} };
  }

  const params: Record<string, string> = {};

  for (let i = 0; i < patternSegments.length; i++) {
    const patternSegment = patternSegments[i];
    const pathSegment = pathSegments[i];

    if (patternSegment.startsWith(':')) {
      // Dynamic segment
      const paramName = patternSegment.slice(1);
      params[paramName] = pathSegment;
    } else if (patternSegment !== pathSegment) {
      // Static segment doesn't match
      return { matches: false, params: {} };
    }
  }

  return { matches: true, params };
}

function extractPath(): string {
  // Get the current path from the URL, removing any base path if needed
  const path = window.location.pathname;
  // Remove leading slash and return, default to 'dashboard' if empty
  const cleanPath = path.slice(1) || 'dashboard';
  return cleanPath;
}

export function RouterProvider({ children, initialRoute = 'dashboard' }: RouterProviderProps) {
  const [currentRoute, setCurrentRoute] = useState(() => {
    // Initialize from current URL
    return extractPath();
  });

  const [params, setParams] = useState<Record<string, string>>({});
  const [queryParams, setQueryParams] = useState(() => new URLSearchParams(window.location.search));

  // Update route when URL changes (back/forward buttons)
  useEffect(() => {
    const handlePopState = () => {
      const newPath = extractPath();
      setCurrentRoute(newPath);
      setQueryParams(new URLSearchParams(window.location.search));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update URL when route changes
  useEffect(() => {
    const expectedPath = `/${currentRoute}`;
    if (window.location.pathname !== expectedPath) {
      // Only update if the URL doesn't already match (prevents infinite loops)
      const url = new URL(window.location.href);
      url.pathname = expectedPath;
      window.history.replaceState(null, '', url.toString());
    }
  }, [currentRoute]);

  const navigate = (path: string, options: { replace?: boolean; state?: any } = {}) => {
    const { replace = false, state = null } = options;

    // Remove leading slash if present
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;

    // Update internal state
    setCurrentRoute(cleanPath);

    // Update browser URL and history
    const url = new URL(window.location.href);
    url.pathname = `/${cleanPath}`;

    if (replace) {
      window.history.replaceState(state, '', url.toString());
    } else {
      window.history.pushState(state, '', url.toString());
    }

    // Update query params
    setQueryParams(new URLSearchParams(url.search));
  };

  const push = (path: string, state?: any) => {
    navigate(path, { replace: false, state });
  };

  const replace = (path: string, state?: any) => {
    navigate(path, { replace: true, state });
  };

  const goBack = () => {
    window.history.back();
  };

  const goForward = () => {
    window.history.forward();
  };

  return (
    <RouteContext.Provider value={{
      currentRoute,
      currentPath: currentRoute,
      params,
      queryParams,
      navigate,
      goBack,
      goForward,
      push,
      replace
    }}>
     
        {children}
     
    </RouteContext.Provider>
  );
}

interface RouteProps {
  path: string;
  children: ReactNode;
  exact?: boolean;
}

export function Route({ path, children, exact = false }: RouteProps) {
  const { currentRoute } = useRouter();

  // Handle exact matching
  if (exact && currentRoute === path) {
    return <>{children}</>;
  }

  // Handle prefix matching for nested routes
  if (!exact && (currentRoute === path || currentRoute.startsWith(path + '/'))) {
    return <>{children}</>;
  }

  return null;
}

// Dynamic route component for parameterized routes
interface DynamicRouteProps {
  pattern: string;
  children: (params: Record<string, string>) => ReactNode;
}

export function DynamicRoute({ pattern, children }: DynamicRouteProps) {
  const { currentRoute } = useRouter();

  const { matches, params } = matchRoute(pattern, currentRoute);

  if (matches) {
    return <>{children(params)}</>;
  }

  return null;
}

// Route guard component
interface RouteGuardProps {
  condition: boolean;
  fallback: ReactNode;
  children: ReactNode;
}

export function RouteGuard({ condition, fallback, children }: RouteGuardProps) {
  return condition ? <>{children}</> : <>{fallback}</>;
}

// Redirect component
interface RedirectProps {
  to: string;
  replace?: boolean;
}

export function Redirect({ to, replace = false }: RedirectProps) {
  const { navigate } = useRouter();

  useEffect(() => {
    navigate(to, { replace });
  }, [to, replace, navigate]);

  return null;
}