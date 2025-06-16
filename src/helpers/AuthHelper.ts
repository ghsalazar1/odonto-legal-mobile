let signOutFunction: (() => Promise<void>) | null = null;

export const AuthHelper = {
  setSignOut: (fn: () => Promise<void>) => {
    signOutFunction = fn;
  },
  triggerSignOut: async () => {
    if (signOutFunction) {
      await signOutFunction();
    }
  },
};
