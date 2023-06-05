const slsw = require("serverless-webpack");
const nodeExternals = require("webpack-node-externals");


module.exports = {
    entry: slsw.lib.entries,
    target: "node",
    // Generate sourcemaps for proper error messages
    devtool: 'source-map',
    // Since 'aws-sdk' is not compatible with webpack,
    // we exclude all node dependencies
    externals: [nodeExternals()],
    mode: slsw.lib.webpack.isLocal ? "development" : "production",
    optimization: {
        // We do not want to minimize our code.
        minimize: false
    },
    performance: {
        // Turn off size warnings for entry points
        hints: false
    },
    // Run babel on all .js files and skip those in node_modules
    module: {
        // noParse: [/aws\-sdk/],
        // noParse: [
        //     /aws/
        //    ],
        rules: [
            {
                test: /\.js$/,
                loader: "babel-loader",
                include: __dirname,
                exclude: /node_modules/,
                // parser: {
                //     commonjs: false, // disable CommonJS
                // }
            }
        ]
    }
};

// const slsw = require('serverless-webpack');

// module.exports = {
//     entry: slsw.lib.entries,
//     target: 'node',
//     mode: slsw.lib.webpack.isLocal ? "development" : "production",
//     externals: {
//         'aws-sdk': 'aws-sdk'
//     },
//     module: {
//         // noParse: [/aws\-sdk/],
//                 rules: [
//                                 {
//                                     test: /\.m?js$/,
//                                     loader: "babel-loader",
//                                     include: __dirname,
//                                     exclude: /node_modules/,
//                                     // parser: {
//                                     //     commonjs: false, // disable CommonJS
//                                     // },

//                                 }
//                             ]

//             }
//   };