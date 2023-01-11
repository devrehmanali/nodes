const express = require('express');
const routes = require('./routes');
const {
  createAdminValidator,
  updateAdminValidator,
  enabledAdminValidator,
  assignManagerRole
} = require('./validator');
const { checkValidation } = require('../../../middlewares/validator');
const serviceRouter = express.Router();

serviceRouter.get('/', (req, res) => routes['apiRoute'](req, res, 'getUsers'));

serviceRouter.post('/', [createAdminValidator, checkValidation], (req, res) =>
  routes['apiRoute'](req, res, 'createAdmin')
);

serviceRouter.get('/:id/resentInvitation', (req, res) =>
  routes['apiRoute'](req, res, 'resentInvitation')
);

serviceRouter.put('/:id', [updateAdminValidator, checkValidation], (req, res) =>
  routes['apiRoute'](req, res, 'updateAdmin')
);

serviceRouter.post(
  '/enabled',
  [enabledAdminValidator, checkValidation],
  (req, res) => routes['apiRoute'](req, res, 'enabledAdmin')
);

serviceRouter.put(
  '/assignRole/:id',
  [assignManagerRole, checkValidation],
  (req, res) => routes['apiRoute'](req, res, 'assignAsManagerRole')
);

module.exports = serviceRouter;
