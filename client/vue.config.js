module.exports = {
    baseUrl: process.env.NODE_ENV === 'production'
    ? '/'
    : '/',
    devServer: {
        proxy: 'http://localhost:3000'
      }
}