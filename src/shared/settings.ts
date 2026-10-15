export type StoredSettings = {
  keepLineBreaks: boolean;
  pluckTextShortcut: string;
};

export type AppSettings = StoredSettings & {
  launchAtLogin: boolean;
};
