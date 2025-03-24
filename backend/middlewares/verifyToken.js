import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) =>{

  const token = req.cookies.token;
  try {
    //verify token
    if (!token) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }
    //extract userid from the decoded token
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: error.message });
  }
};
