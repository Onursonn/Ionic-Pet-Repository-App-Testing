import { useIonToast } from '@ionic/react';

export type UndoToastOptions = {
  message: string;
  undoText?: string;
  durationMs?: number;
  onUndo?: () => void | Promise<void>;
};

export const useUndoToast = (): ((options: UndoToastOptions) => Promise<void>) => {
  const [presentToast] = useIonToast();

  return async (options: UndoToastOptions) => {
    await presentToast({
      message: options.message,
      duration: options.durationMs ?? 3200,
      position: 'bottom',
      buttons: [
        {
          text: options.undoText ?? 'Undo',
          role: 'cancel',
          handler: () => {
            options.onUndo?.();
          },
        },
      ],
    });
  };
};
