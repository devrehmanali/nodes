const auth = require("../../../controllers/auth");

exports.apiRoute = async (req, res, name) => {
  try {
    const resp = await auth[name](req);
    res.status(resp.code).json(resp);
  } catch (err) {
    res.status(err.code || 500).json(err);
  }
};
