const loginMiddleware = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Missing email or password" });
  }
  next();
};

export default loginMiddleware;
