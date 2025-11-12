// proxy-server.js
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const cors = require('cors');

// Health check route
app.get('/ping', (req, res) => {
  res.send('Express Proxy Server is running!');
});

app.use(cors({
  origin: '*', // Allow all origins; change this to restrict
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Proxy everything else as-is
app.use(
  '/',
  (req,res,next)=>{
    console.log(`Incoming request: ${req.method} ${req.originalUrl}`);
    next();
  },
  createProxyMiddleware({
    target: 'http://attendance-sys-1841398519.ap-south-1.elb.amazonaws.com',
    changeOrigin: true,
    pathRewrite: (path, req) => {
      console.log(`Rewriting path: ${path}`);
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

const PORT = 3005;
app.listen(PORT, () => {
  console.log(`✅ Proxy server running on http://localhost:${PORT}`);
});
