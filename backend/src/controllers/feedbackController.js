const Joi = require('joi');

// Allowed page types for feedback
const ALLOWED_PAGES = ['home', 'chat', 'timeline', 'guide'];

const feedbackSchema = Joi.object({
  page: Joi.string().trim().min(1).max(50).valid(...ALLOWED_PAGES).required(),
  region: Joi.string().trim().min(1).max(50).required(),
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().trim().min(1).max(250).required(),
});

const feedbackStore = [];

function createFeedback(req, res, next) {
  try {
    const payload = feedbackSchema.validate(req.body, { abortEarly: false });
    if (payload.error) {
      throw payload.error;
    }

    const entry = {
      id: `fb-${Date.now()}-${feedbackStore.length + 1}`,
      ...payload.value,
      createdAt: new Date().toISOString(),
    };

    feedbackStore.push(entry);
    res.status(201).json({ ok: true, item: entry });
  } catch (error) {
    next(error);
  }
}

function getFeedback(req, res) {
  res.json({ items: [...feedbackStore] });
}

module.exports = { createFeedback, getFeedback };