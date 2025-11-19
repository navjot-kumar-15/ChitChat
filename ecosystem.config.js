// ecosystem.config.js   ← create this file
module.exports = {
  apps: [
    {
      name: 'Nest js',
      script: 'dist/src/main.js',        // your NestJS API
      instances: 2,                  // or "max" or 1
      exec_mode: 'cluster',
      watch: false,
      autorestart: true,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    },
    // {
    //   name: 'worker',
    //   script: 'worker.js',           // your RabbitMQ worker
    //   instances: 'max',              // or 4, 8, etc.
    //   exec_mode: 'cluster',
    //   autorestart: true,
    //   watch: false
    // }
  ]
};