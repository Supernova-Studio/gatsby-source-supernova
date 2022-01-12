'use strict'

const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const nodeExternals = require('webpack-node-externals')
const path = require('path')

const config = {
    target: ['node'],
    entry: './src/exports.ts',
    output: {
        path: path.resolve(__dirname, 'build/main'),
        filename: 'supernova.js',
        libraryTarget: 'commonjs',
        devtoolModuleFilenameTemplate: '../[resource-path]'
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['.ts', '.js'],
        plugins: [
            // @ts-ignore
            new TsconfigPathsPlugin.default({})
        ]
    },
    externals: [nodeExternals()],
    module: {
        rules: [{
            test: /\.ts$/,
            exclude: /node_modules/,
            use: [{
                loader: 'ts-loader',
                options: {
                    compilerOptions: {
                        module: 'commonjs' // override `tsconfig.json` so that TypeScript emits native JavaScript modules.
                    }
                }
            }]
        }]
    }
}

module.exports = config