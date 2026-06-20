import { createRoot } from 'react-dom/client'
import './index.css';
import App from '@app/App'
import { AppProviders } from '@app/providers/AppProviders';
import { AppErrorBoundary } from '@shared/error';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

createRoot(document.getElementById('root')!).render(
  <AppErrorBoundary name="root">
    <AppProviders>
      <App />
    </AppProviders>
  </AppErrorBoundary>,
);
