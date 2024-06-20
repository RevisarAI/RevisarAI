const registrationMiddleware = (req, res, next) => {
  const { email, fullName, businessName, businessDescription, password } =
    req.body;
  if (
    !email ||
    !fullName ||
    !businessName ||
    !businessDescription ||
    !password
  ) {
    return res.status(400).json({ message: "Missing required information" });
  }
  next();
};

export default registrationMiddleware;