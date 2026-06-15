import Joi from 'joi';

export const createTaskSchema = Joi.object({
  title: Joi.string().min(1).max(150).trim().required().messages({
    'any.required': 'Title is required',
    'string.empty': 'Title cannot be empty',
    'string.max': 'Title must be at most 150 characters'
  }),
  description: Joi.string().max(2000).optional().allow(''),
  status: Joi.string().valid('todo', 'in-progress', 'review', 'done').optional(),
  assignedTo: Joi.string().optional().allow(null, ''),
  physics: Joi.object({
    weight: Joi.number().min(0).optional(),
    velocity: Joi.number().optional(),
    coordinates: Joi.object({
      x: Joi.number().optional(),
      y: Joi.number().optional()
    }).optional()
  }).optional()
});

export const updateTaskSchema = Joi.object({
  title: Joi.string().min(1).max(150).trim().optional(),
  description: Joi.string().max(2000).optional().allow(''),
  status: Joi.string().valid('todo', 'in-progress', 'review', 'done').optional(),
  assignedTo: Joi.string().optional().allow(null, ''),
  physics: Joi.object({
    weight: Joi.number().min(0).optional(),
    velocity: Joi.number().optional(),
    momentum: Joi.number().optional(),
    coordinates: Joi.object({
      x: Joi.number().optional(),
      y: Joi.number().optional()
    }).optional()
  }).optional()
});
