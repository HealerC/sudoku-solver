const errorHandler = (err, req, res, next) => {
  if (err.name === 'TypeError') {
    return res.status(400).json({error: err.message});
  }
  return res.status(500).json({error: err});
}
module.exports = errorHandler;