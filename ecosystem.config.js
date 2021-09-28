module.exports = {
    apps: [{
        name: "liongov",
        script: "./server.js",
        env_production: {
            NODE_ENV: "production"
        },
        env_development: {
            NODE_ENV: "development"
        }
    }]
}