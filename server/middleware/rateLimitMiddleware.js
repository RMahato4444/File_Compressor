import rateLimit from "express-rate-limit";

const compressionRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,

  max: 10,

  standardHeaders: true,

  legacyHeaders: false,

  message: {
    success: false,
    message:
      "Too many compression requests. Please try again later.",
  },
});

export default compressionRateLimit;
