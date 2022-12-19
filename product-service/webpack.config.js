const slsw = require("serverless-webpack");
const nodeExternals = require("webpack-node-externals");

module.exports = {
    entry: slsw.lib.entries,
    target: "node",
    externals: [nodeExternals()],
    mode: "development",// slsw.lib.webpack.isLocal ? "development" : "production",
    optimization: {
        minimize: false,
        concatenateModules: false
    },
    performance: {
        hints: false
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: "babel-loader",
                include: __dirname,
                exclude: /node_modules/
            }
        ]
    }
};
