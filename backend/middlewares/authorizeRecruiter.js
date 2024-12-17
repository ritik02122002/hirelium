const authorizeRecruiter = (req, res, next) => {
  try {
    const { role } = req.user;
    if (!role) throw new Error("access denied");
    if (role != "Recruiter") throw new Error("access denied");
    next();
  } catch (err) {
    res.status(401).json({
      status: "failure",
      message: err.message,
    });
  }
};

export default authorizeRecruiter;
