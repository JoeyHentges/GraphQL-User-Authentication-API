// Check the key
module.exports.checkKey = async (req, res, next) => {
  if (req.body.key !== process.env.API_KEY) {
    res.send('invalid key');
    return false;
  }
  next();
};
