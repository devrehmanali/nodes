const admin = require('../../../../controllers/admin/admins');

exports.apiRoute = async (req, res, name) => {
  try {
    const resp = await admin[name](req);
    res.status(resp.code).json(resp);
  } catch (err) {
    res.status(err.code || 500).json(err);
  }
};
