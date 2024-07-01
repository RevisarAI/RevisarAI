import { Schema, ZodError } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

interface RequestSchema {
  body?: Schema;
  query?: Schema;
  params?: Schema;
}

export const schemaValidationMiddleware =
  ({ body, query, params }: RequestSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    const schema = z.object({
      body: body ?? z.object({}).optional(),
      query: query ?? z.object({}).optional(),
      params: params ?? z.object({}).optional(),
    });

    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (!result.success) {
      const error = new ZodError(result.error.errors);
      return res.status(400).json({ error: error.errors });
    }

    return next();
  };
