import { verifyToken }
from "../utils/jwt.js";

const auth = (
  req,
  res,
  next
) => {

  try {

    /* ================= TOKEN HEADER ================= */

    const authHeader =
      req.headers.authorization;

    if (!authHeader) {

      return res.status(401).json({

        message:
          "Authorization header missing"

      });

    }

    /* ================= FORMAT CHECK ================= */

    if (
      !authHeader.startsWith("Bearer ")
    ) {

      return res.status(401).json({

        message:
          "Invalid token format"

      });

    }

    /* ================= EXTRACT TOKEN ================= */

    const token =
      authHeader.split(" ")[1];

    if (!token) {

      return res.status(401).json({

        message:
          "Token missing"

      });

    }

    /* ================= VERIFY ================= */

    const decoded =
      verifyToken(token);

    if (!decoded) {

      return res.status(401).json({

        message:
          "Invalid token"

      });

    }

    /* ================= SAVE ADMIN ================= */

    req.admin = decoded;

    next();

  } catch (err) {

    console.log(
      "❌ AUTH ERROR:",
      err.message
    );

    return res.status(401).json({

      message:
        "Authentication failed"

    });

  }

};

export default auth;