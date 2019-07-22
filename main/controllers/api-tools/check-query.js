// Check the key
module.exports.checkQuery = (result, res) => {
  if (result === null || result === undefined) {
    res.send('invalid query');
    return true;
  }
  return false;
};
