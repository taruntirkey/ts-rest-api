import { rateLimit } from "express-rate-limit";

// Maximum 100 requests per 15-min from same IP.
const rateLimitByIp = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skipFailedRequests: true,
  message: "You have exceeded the request limit.",
});

// Maximum 10 failed login requests per 3 hours by same user.
const rateLimitByUser = rateLimit({
  windowMs: 3 * 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  keyGenerator: (req, res) => {
    return req.body.username;
  },
  message: "Your account is blocked for 3 hours due to suspicious activity.",
});

export { rateLimitByIp, rateLimitByUser };
