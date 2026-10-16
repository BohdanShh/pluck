import { app, dialog, type MessageBoxOptions } from 'electron';

type ConfirmOptions = {
  message: string;
  detail: string;
  confirmLabel: string;
  cancelLabel?: string;
};

export function showMessage(options: MessageBoxOptions) {
  app.focus({ steal: true });

  return dialog.showMessageBox(options);
}

export async function confirm({
  message,
  detail,
  confirmLabel,
  cancelLabel = 'Cancel',
}: ConfirmOptions) {
  const { response } = await showMessage({
    message,
    detail,
    buttons: [confirmLabel, cancelLabel],
    defaultId: 0,
    cancelId: 1,
  });

  return response === 0;
}
