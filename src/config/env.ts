import dotenv from "dotenv";
dotenv.config();

const config = {
  NODE_ENV: process.env.NODE_ENV!,
  PORT: process.env.PORT!,
  JWT_SECRET: process.env.JWT_SECRET!,
  verify: function () {
    try {
      if (!this.NODE_ENV || typeof this.NODE_ENV !== "string") {
        throw new Error("Invalid NODE_ENV");
      }
      if (!this.PORT || isNaN(+this.PORT)) {
        throw new Error("Invalid PORT");
      }
      if (!this.JWT_SECRET || typeof this.JWT_SECRET !== "string") {
        throw new Error("Invalid JWT_SECRET");
      }
    } catch (err) {
      console.log(err);
      process.exit(1);
    }
  },
};

config.verify();

export default config;
