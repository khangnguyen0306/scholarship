const publicRuntimeConfig = {
    BE_API_LOCAL: import.meta.env.VITE_BE_API,
};

export const { BE_API_LOCAL } = publicRuntimeConfig;
export default publicRuntimeConfig;
