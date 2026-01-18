import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.SERVER_URL,
});

/**
 * Toggle logging (VERY IMPORTANT for production)
 * Set ENABLE_API_LOGS=false in prod
 */
const ENABLE_API_LOGS = process.env.ENABLE_API_LOGS !== 'false';

// ---------------- REQUEST ----------------
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  (config as any).metadata = {
    startTime: Date.now(),
  };

  if (ENABLE_API_LOGS && config.baseURL && config.url) {
    console.log('➡️ API REQUEST');
    console.log('Method:', config.method?.toUpperCase());
    console.log('URL:', config.baseURL + config?.url);
    console.log('Headers:', config.headers);
    console.log('Params:', config.params);
    console.log('Payload:', config.data);
  }

  return config;
});

// ---------------- RESPONSE ----------------
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    const metadata = (response.config as any).metadata;
    const duration = metadata?.startTime
      ? Date.now() - metadata.startTime
      : null;

    if (ENABLE_API_LOGS) {
      console.log('✅ API RESPONSE');
      console.log(
        `${response.config.method?.toUpperCase()} ${response.config.url}`,
      );
      console.log('Status:', response.status);
      console.log('Time:', `${duration} ms`);
      console.log('Response Data:', response.data);
    }

    (response as any).duration = duration;
    return response;
  },

  (error) => {
    const config = error.config || {};
    const metadata = (config as any)?.metadata;
    const duration = metadata?.startTime
      ? Date.now() - metadata.startTime
      : null;

    if (ENABLE_API_LOGS) {
      console.log('❌ API ERROR');
      console.log(
        `${config.method?.toUpperCase()} ${config.url}`,
      );
      console.log('Time:', `${duration} ms`);
      console.log('Status:', error.response?.status);
      console.log('Error Message:', error.message);
      console.log('Error Response:', error.response?.data);
    }

    (error as any).duration = duration;
    return Promise.reject(error);
  },
);

export default apiClient;
