import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { AuthProvider } from '@/contexts/AuthContext';
import { GamificationProvider } from '@/contexts/GamificationContext';

import Home from '@/pages/Home';
import ServerDirectory from '@/pages/ServerDirectory';
import ServerPage from '@/pages/ServerPage';
import Guide from '@/pages/Guide';
import LeonidaWaitlist from '@/pages/LeonidaWaitlist';
import Plans from '@/pages/Plans';
import AdminLogin from '@/pages/AdminLogin';
import AdminPanel from '@/pages/AdminPanel';
import About from '@/pages/About';
import News from '@/pages/News';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/servidores" component={ServerDirectory} />
      <Route path="/servidor/:slug" component={ServerPage} />
      <Route path="/guia" component={Guide} />
      <Route path="/leonida" component={LeonidaWaitlist} />
      <Route path="/planos" component={Plans} />
      <Route path="/noticias" component={News} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin" component={AdminPanel} />
      <Route path="/sobre" component={About} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Force dark mode on body element
  if (typeof document !== 'undefined') {
    document.documentElement.classList.add('dark');
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <GamificationProvider>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
              <Router />
            </WouterRouter>
            <Toaster />
          </TooltipProvider>
        </GamificationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
