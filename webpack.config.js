const path = require('path');

module.exports = (options, webpack) => {
  const lazyImports = [
    '@nestjs/microservices/microservices-module',
    '@nestjs/websocket/socket-module',
  ];

  return {
    ...options,
    externals: {},
    output: {
      ...options.output,
      libraryTarget: 'commonjs2',
    },
    resolve: {
      ...options.resolve,
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@app': path.resolve(__dirname, 'src/app'),
        '@config': path.resolve(__dirname, 'src/config'),
        '@common': path.resolve(__dirname, 'src/common'),
        '@modules': path.resolve(__dirname, 'src/modules'),
        '@entities': path.resolve(__dirname, 'src/entities'),
        '@dto': path.resolve(__dirname, 'src/dto'),
        '@interfaces': path.resolve(__dirname, 'src/interfaces'),
        '@guards': path.resolve(__dirname, 'src/guards'),
        '@decorators': path.resolve(__dirname, 'src/decorators'),
        '@pipes': path.resolve(__dirname, 'src/pipes'),
        '@filters': path.resolve(__dirname, 'src/filters'),
        '@middleware': path.resolve(__dirname, 'src/middleware'),
        '@utils': path.resolve(__dirname, 'src/utils'),
        '@constants': path.resolve(__dirname, 'src/constants'),
        '@types': path.resolve(__dirname, 'src/types'),
      },
    },
    plugins: [
      ...options.plugins,
      new webpack.IgnorePlugin({
        checkResource(resource) {
          if (lazyImports.includes(resource)) {
            try {
              require.resolve(resource);
            } catch (err) {
              return true;
            }
          }
          return false;
        },
      }),
    ],
  };
};
