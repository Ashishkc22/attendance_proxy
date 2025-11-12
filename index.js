// proxy-server.js
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Health check route
app.get('/ping', (req, res) => {
  res.send('Express Proxy Server is running!');
});

// Proxy everything else as-is
app.use(
  '/',
  createProxyMiddleware({
    target: 'http://attendance-sys-1841398519.ap-south-1.elb.amazonaws.com',
    changeOrigin: true,
    pathRewrite: (path, req) => {
      // path remains unchanged — forward exactly what client requested
      return path;
    },
    onProxyReq: (proxyReq, req, res) => {
      console.log(`→ ${req.method} ${req.originalUrl}`);
    },
    onProxyRes: (proxyRes, req, res) => {
      console.log(`← Response from ${proxyRes.req.getHeader('host')}`);
    },
  })
);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Proxy server running on http://localhost:${PORT}`);
});
