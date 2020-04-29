module.exports = {
  Errors: {
    WrongAccount: "wrong-acount",
  },
  set: (req, error_type) => (req.appSession.flashError = error_type),
  clear: (req) => {
    if (!req.appSession.flashError) return;
    const error_type = req.appSession.flashError;
    delete req.appSession.flashError;
    return error_type;
  },
};
