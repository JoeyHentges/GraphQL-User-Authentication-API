// Check the values being looked up. Some are blocked based on the key
module.exports.checkValues = async (req, res, next) => {
  if (req.body.key !== 'key') {
    res.send('invalid query');
    return false;
  }
  next();
};
