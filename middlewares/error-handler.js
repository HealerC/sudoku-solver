const errorHandler = (err, req, res, next) => {
  if (err instanceof Error) {
    err.message =
      err.message === "Puzzle could not be solved."
        ? "Puzzle cannot be solved"
        : err.message;
    return res.status(400).json({ error: err.message });
  }
  return res.status(500).json({ error: err });
};
module.exports = errorHandler;
