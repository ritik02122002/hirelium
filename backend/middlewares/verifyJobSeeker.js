const verifyJobSeeker = (req, res, next) => {
  try {
    const { role } = req.user;
    if (!role) throw new Error("access denied");
    if (role != "JobSeeker") throw new Error("access denied");
    next();
  } catch (err) {
    res.status(401).json({
      status: "failure",
      message: err.message,
    });
  }
};

export default verifyJobSeeker;
