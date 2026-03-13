export { default as requestInterceptor } from './request_interceptor';
export { default as responseInterceptor } from './response_interceptor';

import requestInterceptor from './request_interceptor';
import responseInterceptor from './response_interceptor';

export const setupInterceptors = (axiosInstance) => {
    requestInterceptor(axiosInstance);
    responseInterceptor(axiosInstance);
}