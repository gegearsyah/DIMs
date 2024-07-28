let LoadingService = {
  initialize: (setLoading: (isLoading: boolean, message?: string) => void) => {
    LoadingService.setLoading = setLoading;
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setLoading: (isLoading: boolean, message?: string) => {}, // to be initialized in MainApp
};

export default LoadingService;
