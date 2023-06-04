const axiosApiInstance = axios.create({
  baseURL: bluga.appLink + '/api',
});

axiosApiInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      await axiosApiInstance.post('/user/refresh');
      return axiosApiInstance(originalRequest);
    }

    return Promise.reject(error);
  },
);

const BlugaUtils = {};
