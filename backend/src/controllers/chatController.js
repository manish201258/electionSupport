const Joi = require('joi');
const { callAiAssistant } = require('../services/aiService');
const { normalizeRegion, supportedRegions } = require('../data/regions');

const chatSchema = Joi.object({
  message: Joi.string().trim().min(2).max(500).required(),
  region: Joi.string()
    .trim()
    .lowercase()
    .valid(...supportedRegions)
    .optional(),
});

async function chatWithAssistant(req, res, next) {
  try {
    const { message, region } = await chatSchema.validateAsync(req.body);
    const reply = await callAiAssistant(message, normalizeRegion(region));
    res.json({ reply });
  } catch (error) {
    next(error);
  }
}

module.exports = { chatWithAssistant };
