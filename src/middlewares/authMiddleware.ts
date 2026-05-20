import {
  Request,
  Response,
  NextFunction,
} from "express";

import { admin } from "../config/firebase";

/**
 * =========================================
 * AUTHENTICATED REQUEST
 * =========================================
 */

export interface AuthenticatedRequest
  extends Request {
  user?: {
    uid: string;
    email?: string;
  };
}

/**
 * =========================================
 * FIREBASE JWT MIDDLEWARE
 * =========================================
 */

export async function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    /**
     * Authorization Header
     *
     * Format:
     * Bearer TOKEN
     */

    const authorization =
      req.headers.authorization;

    if (
      !authorization ||
      !authorization.startsWith(
        "Bearer "
      )
    ) {
      res.status(401).json({
        message: "Unauthorized",
      });

      return;
    }

    /**
     * Extract Token
     */

    const token =
      authorization.split("Bearer ")[1];

    /**
     * Verify Firebase Token
     */

    const decodedToken =
      await admin
        .auth()
        .verifyIdToken(token);

    /**
     * Inject authenticated user
     */

    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
    };

    next();
  } catch (error) {
    console.error(error);

    res.status(401).json({
      message: "Invalid token",
    });
  }
}