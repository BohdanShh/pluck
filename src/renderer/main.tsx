import { lazy, StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';

import type { RendererPage } from '../shared/ipc';

import './index.css';

const Settings = lazy(() => import('./settings').then(module => ({ default: module.Settings })));
const Update = lazy(() => import('./update').then(module => ({ default: module.Update })));

const PAGES: Record<RendererPage, typeof Settings> = { settings: Settings, update: Update };

const page = new URLSearchParams(location.search).get('page') as RendererPage | null;
const Page = PAGES[page ?? 'settings'] ?? Settings;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense>
      <Page />
    </Suspense>
  </StrictMode>
);
