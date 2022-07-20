const Joi = require('joi');

const schemaContact = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  favorite: Joi.boolean(),
});

const createContactSchema = (req, res, next) => {
  const validationResult = schemaContact.validate(req.body);

  if (validationResult.error) {
    return res.status(400).json({ message: 'missing required name field' });
  }
  next();
};

const changeContactSchema = (req, res, next) => {
  const validationResult = schemaContact.validate(req.body);

  if (validationResult.error) {
    return res.status(400).json({ message: 'missing fields' });
  }
  next();
};

const patchContactSchema = (req, res, next) => {
  const patchSchemaContact = Joi.object({
    favorite: Joi.boolean().required(),
  });
  const validationResult = patchSchemaContact.validate(req.body);

  if (validationResult.error) {
    return res.status(400).json({ message: 'missing field favorite' });
  }
  next();
};

const newUserSchema = (req, res, next) => {
  const schemaUser = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    subscription: Joi.string(),
  });

  const validationResult = schemaUser.validate(req.body);
  if (validationResult.error) {
    return res.status(400).json({
      message: validationResult.error.details[0].message,
    });
  }
  next();
};

module.exports = {
  createContactSchema,
  changeContactSchema,
  patchContactSchema,
  newUserSchema,
};
