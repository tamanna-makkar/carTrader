module.exports = {
    devServer: {
        proxy: {
            '^/api': {
                target: 'https://carconfigurator-api.dev.deploy.nl',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            },
            '^/elastic-api': {
                target: 'https://carconfigurator-elastic-api.dev.deploy.nl',
                changeOrigin: true,
                pathRewrite: {
                    '^/elastic-api': ''
                }
            }
        }
    },
    css: {
        loaderOptions: {
            sass: {
                prependData: `@import "/sass/all.sass"`
            }
        }
    },
    chainWebpack: config => {
        config
            .plugin('html')
            .tap(args => {
                args[0].title = "Hubble - Car Configurator"
                return args;
            })
    }
}