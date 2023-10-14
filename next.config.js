/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "export",
    cleanDistDir: true,
    trailingSlash: true,
    images: {
        unoptimized: true
    }
}

module.exports = nextConfig
