import { Request, NextFunction, Response } from 'express'
export const RedirectToErrorMessage = (func: any) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await func(req, res, next)
  } catch (err) {
    next(err)
  }
}
