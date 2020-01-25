const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackShellPlugin = require('webpack-shell-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
  mode: "production",
  devtool: "none",

  entry: {
    style: "./src/webpack.script.js",
  },

  output: {
  path: path.resolve(__dirname, "dist"),
  filename: "bundle.js"
  },

  optimization: {
    minimizer: [
      new OptimizeCssAssetsPlugin({
        cssProcessorPluginOptions: {
          preset: ['default', { discardComments: { removeAll: true } }],
        }
      }),
      new TerserPlugin()
    ],
  },

  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates a separate bundled CSS-file
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              //publicPath: "../../",
            },
          },
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader',
        ],
      },

      {
        test: /\.html$/i,
        use: ['html-loader'],
      },

      {
        test: /\.(svg|png|jpe?g|gif)$/i,

        use: {
          loader: 'file-loader',
          options: {
            name: "[name].[hash].[ext]",
            outputPath: 'assets/images',
            esModule: false, //////////////////// [object Module]
          },
        }

      },

      {
        test: /\.(otf|ttf)$/i,

        use: {
          loader: 'file-loader',
          options: {
            name: "[name].[hash].[ext]",
            outputPath: 'assets/fonts',
            esModule: false, //////////////////// [object Module]
          },
        }

      },

    ],

  },

  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "src/html-template.ejs",
      inject: false,
      minify: {
       removeAttributeQuotes: true,
       collapseWhitespace: true,
       removeComments: true,
      }
    }),
    new MiniCssExtractPlugin({
     filename: '[name].[contentHash].css',
     // chunkFilename: '[id].css',
    }),
    new CleanWebpackPlugin(),
    new WebpackShellPlugin({onBuildEnd:['rm dist/bundle.js']})
  ],

}
