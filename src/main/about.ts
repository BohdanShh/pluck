import { app } from 'electron';

const FIRST_YEAR = 2026;

function copyrightYears() {
  const currentYear = new Date().getFullYear();

  return currentYear > FIRST_YEAR ? `${FIRST_YEAR}–${currentYear}` : `${FIRST_YEAR}`;
}

export function setupAbout() {
  app.setAboutPanelOptions({
    applicationName: 'Pluck',
    applicationVersion: app.getVersion(),
    version: '',
    copyright: `Copyright © ${copyrightYears()} Bohdan Shemyhon`,
  });
}

export function openAbout() {
  app.focus({ steal: true });
  setImmediate(() => app.showAboutPanel());
}
