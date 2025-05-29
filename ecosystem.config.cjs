module.exports = {
  apps: [
    {
      name: 'xrj-site',
      port: '3000',
      exec_mode: 'cluster',
      instances: 1, 
      script: './.output/server/index.mjs',
      node_args: '--max-old-space-size=1024',
      env: {
        NITRO_PORT: 3000,
        NITRO_HOST: '127.0.0.1',
        NODE_ENV: 'production'
      },
      log_file: './logs/combined.log',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      max_restarts: 10,
      min_uptime: '10s',
      max_memory_restart: '512M',
      watch: false,
      ignore_watch: ['node_modules', 'logs'],
      kill_timeout: 5000,
      listen_timeout: 3000,
      autorestart: true,
      instances: 'max',
      exec_mode: 'cluster'
    }
  ]
} 