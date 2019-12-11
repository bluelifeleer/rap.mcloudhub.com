module.exports = {
    apps: [{
        name: 'rap',
        cwd: '/home/bluelife/wwwroot/node/rap.mcloudhub.com',
        script: 'index.js',
        mode: "cluster",

        // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
        args: 'one two',
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: '1G',
        merge_logs: true,
        env: {
            // port: 443,
            NODE_ENV: 'development'
        },
        env_production: {
            // port: 443,
            NODE_ENV: 'production'
        }
    }],

    deploy: {
        production: {
            user: 'node',
            host: '212.83.163.1',
            ref: 'origin/master',
            repo: 'git@github.com:repo.git',
            path: '/var/www/production',
            'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production'
        }
    }
};