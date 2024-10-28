const PROXY_CONFIG = [
    {
        content: [
            '/api',
        ],
        target: "http://localhost:5000",
        secure: true,
        changeOrigin: true,
        pathRewite: {
            "^/":""
        }

    }
]

module.exports = PROXY_CONFIG;