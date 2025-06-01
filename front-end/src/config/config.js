const publicRuntimeConfig = {
    BE_API_LOCAL: import.meta.env.VITE_BE_API,
    VITE_SOCKET_BE: import.meta.env.VITE_SOCKET_BE,
};

export const { BE_API_LOCAL, VITE_SOCKET_BE } = publicRuntimeConfig;
export default publicRuntimeConfig;
