module.exports = {
    apps : [
        {
          name: "multisite-api",
          script: "./server.js",
          watch: true,
	        instances: 4,
          exec_mode: "cluster",
          env: {
              "PORT": 8080,
              "NODE_ENV": "production"
          }
        }
    ]
  }