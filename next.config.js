/** @type {import('next').NextConfig} */
module.exports = {
    reactStrictMode: true,
    publicRuntimeConfig: {
        // Will be available on both server and client
        NODE_ENV: process.env.NODE_ENV,
        BACKEND_URL: process.env.BACKEND_URL,
    },

};
