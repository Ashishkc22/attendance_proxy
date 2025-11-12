// proxy-server.js
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Health check / local route
app.get('/ping', (req, res) => {
  res.send('Express Proxy Server is running!');
});

// Proxy all other requests
app.use(
  '/',
  createProxyMiddleware({
    target: 'http://attendance-sys-1841398519.ap-south-1.elb.amazonaws.com/25b490b4-d740-4f90-b9b2-b8c3e27dc6e4/auth/',
    changeOrigin: true,
    pathRewrite: { '^/': '' },
    onProxyReq: (proxyReq, req, res) => {
      console.log(`→ ${req.method} ${req.originalUrl}`);
    },
    onProxyRes: (proxyRes, req, res) => {
      console.log(`← Response from ${proxyRes.req.getHeader('host')}`);
    },
  })
);

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Proxy server running on http://localhost:${PORT}`);
});
