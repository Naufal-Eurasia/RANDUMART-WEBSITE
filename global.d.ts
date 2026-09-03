declare module '*.css';
declare module '*.scss';
declare module '*.sass';

interface Window {
  snap: {
    pay: (
      token: string,
      options?: {
        onSuccess?: (result: unknown) => void;
        onPending?: (result: unknown) => void;
        onError?: (result: unknown) => void;
        onClose?: () => void;
      }
    ) => void;
  };
}
