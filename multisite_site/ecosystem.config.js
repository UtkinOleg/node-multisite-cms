module.exports = {
    apps : [
        {
          name: "site",
          script: "./site.js",
          watch: true,
	        instances: 4,
          exec_mode: "cluster",
          env: {
              "PORT": 80,
              "NODE_ENV": "production",
              "PUBLISHED": true
          }
        }
    ]
  }