import Joi from 'joi';

export const createPageSchema = Joi.object({
  title: Joi.string().min(1).max(100).trim().required().messages({
    'any.required': 'Title is required',
    'string.empty': 'Title cannot be empty',
    'string.max': 'Title must be at most 100 characters'
  }),
  slug: Joi.string().min(1).max(100).trim().required().messages({
    'any.required': 'Slug is required',
    'string.empty': 'Slug cannot be empty',
    'string.max': 'Slug must be at most 100 characters'
  }),
  category: Joi.string().valid('WORKSPACE', 'TEAM CHANNELS', 'PROJECTS', 'ADMINISTRATION').required().messages({
    'any.required': 'Category is required',
    'any.only': 'Invalid category'
  }),
  developerPayload: Joi.object({
    activeSprintVelocity: Joi.number().optional(),
    openBlockersCount: Joi.number().optional(),
    codeTelemetryLogs: Joi.string().optional(),
    assignedBranches: Joi.array().items(Joi.string()).optional()
  }).optional(),
  pmPayload: Joi.object({
    okrAlignmentTags: Joi.array().items(Joi.string()).optional(),
    userImpactScore: Joi.number().optional(),
    cohortRolloutPercentage: Joi.number().optional(),
    dependencyMapping: Joi.object().pattern(Joi.string(), Joi.any()).optional()
  }).optional(),
  directorPayload: Joi.object({
    headcountAllocated: Joi.number().optional(),
    capExBudgetBurn: Joi.number().optional(),
    riskLevelAssessment: Joi.string().optional(),
    complianceFlags: Joi.object().pattern(Joi.string(), Joi.any()).optional()
  }).optional()
});

export const createNavNodeSchema = Joi.object({
  title: Joi.string().min(1).trim().required().messages({
    'any.required': 'Title is required',
    'string.empty': 'Title cannot be empty'
  }),
  slug: Joi.string().min(1).trim().required().messages({
    'any.required': 'Slug is required',
    'string.empty': 'Slug cannot be empty'
  }),
  category: Joi.string().valid('WORKSPACE', 'TEAM CHANNELS', 'PROJECTS', 'ADMINISTRATION').required().messages({
    'any.required': 'Category is required',
    'any.only': 'Invalid category'
  }),
  displayOrder: Joi.number().integer().required().messages({
    'any.required': 'Display order is required',
    'number.integer': 'Display order must be an integer'
  }),
  isLocked: Joi.boolean().optional()
});
