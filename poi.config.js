const nodeModules = require('webpack-node-modules')
const repoLatestCommit = require('repo-latest-commit')
const pkg = require('./package')

module.exports = {
  entry: 'src/dev/index.js',
  templateCompiler: true,
  extendWebpack(config) {
    // Improve build performance.
    config.module.set('noParse', /babel-preset-vue/)

    // Use es module
    config.module.rule('js')
      .include
      .add(nodeModules())

    config.node.set('fs', 'empty')

  },
  filename: {
    chunk: '[name].chunk.js',
    vendor: '[name].vendor.js',
    client: 'v-codemirror.core.js',
  },
  copy: [
    {
      from: './node_modules/codemirror/mode', to: 'mode'
    },
    {
      from: './node_modules/codemirror/theme', to: 'theme'
    }
  ],
  production: {
    sourceMap: false,
    extractCSS: false
  },
  hash: false,
  homepage: '/',
  port: 1995,
  env: Object.assign({
    VERSION: `v${pkg.version}-${repoLatestCommit().commit.slice(0, 7)}`,
    LATEST_COMMIT: repoLatestCommit().commit.slice(0, 7)
  }),
  presets: [
    require('poi-preset-bundle-report')(),
    require('poi-preset-babel-minify')()
  ],
  babel: {
    babelrc: false,
    presets: [
      require.resolve('babel-preset-poi')
    ]
  }
}