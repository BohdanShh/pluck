import { lazy, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';

const Settings = lazy(() => import('./settings').then(module => ({ default: module.Settings })));
const Update = lazy(() => import('./update').then(module => ({ default: module.Update })));

const App = new URLSearchParams(location.search).get('window') === 'update' ? Update : Settings;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
