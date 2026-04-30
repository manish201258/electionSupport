const express = require('express');
const compression = require('compression');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const timelineRoutes = require('./routes/timelineRoutes');
const faqRoutes = require('./routes/faqRoutes');
const stepsRoutes = require('./routes/stepsRoutes');
const chatRoutes = require('./routes/chatRoutes');
const announcementsRoutes = require('./routes/announcementsRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');

const app = express();

app.disable('x-powered-by');
app.use(compression());
app.use(helmet());

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

function cacheFor(seconds) {
  return (req, res, next) => {
    if (req.method === 'GET') {
      res.set('Cache-Control', `public, max-age=${seconds}`);
    }
    next();
  };
}

app.use('/api/timeline', cacheFor(300), timelineRoutes);
app.use('/api/announcements', cacheFor(300), announcementsRoutes);
app.use('/api/faq', cacheFor(600), faqRoutes);
app.use('/api/steps', cacheFor(600), stepsRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/feedback', feedbackRoutes);

app.use((err, req, res, next) => {
  if (err && err.isJoi) {
    return res.status(400).json({ error: err.details[0].message });
  }

  const status = err.status || 500;
  return res.status(status).json({ error: err.message || 'Internal server error' });
});

module.exports = app;
