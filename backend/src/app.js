const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const timelineRoutes = require('./routes/timelineRoutes');
const faqRoutes = require('./routes/faqRoutes');
const stepsRoutes = require('./routes/stepsRoutes');
const chatRoutes = require('./routes/chatRoutes');

const app = express();

app.disable('x-powered-by');
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((item) => item.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(Object.assign(new Error('CORS origin not allowed'), { status: 403 }));
    },
  })
);
app.use(express.json({ limit: '256kb' }));

app.use(
  '/api',
  rateLimit({
    windowMs: 60 * 1000,
    max: 60,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.use(
  '/api/chat',
  rateLimit({
    windowMs: 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many chat requests. Please retry in a minute.' },
  })
);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'election-edu-backend' });
});

app.use('/api/timeline', timelineRoutes);
app.use('/api/faq', faqRoutes);
app.use('/api/steps', stepsRoutes);
app.use('/api/chat', chatRoutes);

app.use((err, req, res, next) => {
  if (err && err.isJoi) {
    return res.status(400).json({ error: err.details[0].message });
  }

  const status = err.status || 500;
  return res.status(status).json({ error: err.message || 'Internal server error' });
});

module.exports = app;
