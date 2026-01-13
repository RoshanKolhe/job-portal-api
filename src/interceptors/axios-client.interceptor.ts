import axios, {AxiosInstance, AxiosResponse, InternalAxiosRequestConfig} from 'axios';

const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.SERVER_URL,
});

// Request Interceptor → store start time
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  (config as any).metadata = {startTime: Date.now()};
  return config;
});

// Response Interceptor → measure duration
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    const metadata = (response.config as any).metadata;
    if (metadata?.startTime) {
      const duration = Date.now() - metadata.startTime;
      (response as any).duration = duration;

      console.log(
        `⚡ API Call: ${response.config.method?.toUpperCase()} ${response.config.url} → ${duration} ms`,
      );
    }
    return response;
  },

  (error) => {
    const metadata = (error.config as any)?.metadata;
    if (metadata?.startTime) {
      const duration = Date.now() - metadata.startTime;
      (error as any).duration = duration;

      console.log(
        `❌ API ERROR: ${error.config?.method?.toUpperCase()} ${
          error.config?.url
        } → ${duration} ms`,
      );
      console.log('error', error);
    }
    return Promise.reject(error);
  },
);

export default apiClient;
