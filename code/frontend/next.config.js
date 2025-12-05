/** @type {import('next').NextConfig} */
const nextConfig = {
    // Configure Webpack to handle Node.js core modules on the client side
    webpack: (config, { isServer }) => {
        // We only need to apply this fix for the browser build (client-side)
        if (!isServer) {
            config.resolve.fallback = {
                // Fix for "Module not found: Can't resolve 'net'"
                net: false,
                // Include tls and fs as they often cause related issues in the same libraries
                tls: false,
                fs: false,
            };
        }

        return config;
    },
};

module.exports = nextConfig;
