import Joi from "joi";

export const userSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  address: Joi.string(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const albumSchema = Joi.object({
  title: Joi.string().required(),
  release_year: Joi.number().required(),
  genre: Joi.string().required(),
  artists: Joi.array().optional(),
});

export const artistSchema = Joi.object({
  name: Joi.string().required(),
  country: Joi.string().required(),
  albums: Joi.array().optional(),
});

export const songSchema = Joi.object({
  title: Joi.string().required(),
  duration: Joi.string().required(),
  album: Joi.number().required(),
});