const errorHandler = (err, req, res, next) => {
  if (err instanceof Error) {
    // Error thrown within the program
    // The message provided by the library if it can't solve an array is changed
    err.message =
      err.message === "Puzzle could not be solved."
        ? "Puzzle cannot be solved"
        : err.message;
    return res.json({ error: err.message });
  }
  return res.status(500).json({ error: err }); // Some other error
};
module.exports = errorHandler;
