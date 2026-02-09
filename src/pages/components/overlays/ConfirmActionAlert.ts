import { useIonAlert } from '@ionic/react';

export type ConfirmActionOptions = {
  header?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmRole?: 'destructive' | string;
  backdropDismiss?: boolean;
};

export const useConfirmAction = (): ((options: ConfirmActionOptions) => Promise<boolean>) => {
  const [presentAlert] = useIonAlert();

  return (options: ConfirmActionOptions) =>
    new Promise((resolve) => {
      presentAlert({
        header: options.header ?? 'Are you sure?',
        message: options.message,
        backdropDismiss: options.backdropDismiss ?? false,
        buttons: [
          {
            text: options.cancelText ?? 'Cancel',
            role: 'cancel',
            handler: () => resolve(false),
          },
          {
            text: options.confirmText ?? 'Confirm',
            role: options.confirmRole ?? 'destructive',
            handler: () => resolve(true),
          },
        ],
      });
    });
};
