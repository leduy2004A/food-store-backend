import { Request, Response, NextFunction } from 'express'
import path from 'path'
import { fileImagesLocation } from '~/constants/fileLocation'
export const serveStaticImage = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  const imageLocation = path.resolve(fileImagesLocation, id)
  return res.sendFile(imageLocation)
}
