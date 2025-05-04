import { useEffect } from 'react';
import { Route, useLocation } from 'wouter';
import { Loader2 } from 'lucide-react';
import { isWalletActive } from './walletAuth';

export function ProtectedRoute({
  path,
  component: Component,
}: {
  path: string;
  component: () => React.JSX.Element;
}) {
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isWalletActive()) {
      setLocation('/auth');
    }
  }, [setLocation]);

  // We return the route, which will render the component if we haven't redirected
  return (
    <Route path={path}>
      {isWalletActive() ? <Component /> : (
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
    </Route>
  );
}