const Joi = require('joi');
const { callAiAssistant } = require('../services/aiService');

const chatSchema = Joi.object({
  message: Joi.string().trim().min(2).max(500).required(),
  region: Joi.string().trim().max(100).optional(),
});

async function chatWithAssistant(req, res, next) {
  try {
    const { message, region } = await chatSchema.validateAsync(req.body);
    const regionText = region ? `\nUser region: ${region}` : '';
    const reply = await callAiAssistant(`${message}${regionText}`);
    res.json({ reply });
  } catch (error) {
    next(error);
  }
}

module.exports = { chatWithAssistant };
