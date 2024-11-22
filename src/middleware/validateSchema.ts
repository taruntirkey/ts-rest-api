import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";

const validate =
  (validationObject: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      validationObject.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });
      next();
    } catch (err: any) {
      if (err instanceof ZodError) {
        res.status(400).send(err.errors);
      }
    }
  };

export { validate };
