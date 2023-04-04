const path = require('path');

const config = {
  entry: './App/src/ContainerGenerator.ts',
  target: 'node',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'ts-loader',
            options: {allowTsInNodeModules: true}
          }
        ],
        resolve: {
          extensions: ['.tsx', '.ts', '.js'],
          alias: {}
        }
      }
    ]
  },
  plugins: [],
  output: {
    filename: 'ContainerGenerator.js',
    path: path.resolve(__dirname, 'build'),
    clean: true
  },
  resolve: {
    alias: {
      App: path.resolve(__dirname, 'App/src'),
      Core: path.resolve(__dirname, 'Core/src'),
      Infrastructure: path.resolve(__dirname, 'NodeInfrastructure/src')
    }
  }
};

module.exports = config;
