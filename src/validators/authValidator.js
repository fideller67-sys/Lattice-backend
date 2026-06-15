import Joi from 'joi';

export const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).trim().required().messages({
    'any.required': 'Name is required',
    'string.min': 'Name must be at least 2 characters',
    'string.max': 'Name must be at most 50 characters'
  }),
  email: Joi.string().email().trim().lowercase().required().messages({
    'any.required': 'Email is required',
    'string.email': 'Please provide a valid email address'
  }),
  password: Joi.string().min(6).required().messages({
    'any.required': 'Password is required',
    'string.min': 'Password must be at least 6 characters'
  })
});

export const loginSchema = Joi.object({
  email: Joi.string().email().trim().lowercase().required().messages({
    'any.required': 'Email is required',
    'string.email': 'Please provide a valid email address'
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required',
    'string.empty': 'Password is required'
  })
});

export const onboardingSchema = Joi.object({
  role: Joi.string().valid('developer', 'pm', 'director', 'admin').required().messages({
    'any.required': 'Role is required',
    'any.only': 'Role must be one of: developer, pm, director, admin'
  }),
  workspaceName: Joi.string().min(2).max(60).trim().required().messages({
    'any.required': 'Workspace name is required',
    'string.min': 'Workspace name must be at least 2 characters',
    'string.max': 'Workspace name must be at most 60 characters'
  })
});
