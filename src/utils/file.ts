import { Request, Response, NextFunction } from 'express'
import { Files } from 'formidable'
import fs from 'fs'
import path from 'path'
import { fileImagesLocation } from '~/constants/fileLocation'
export const created_file = () => {
  if (fs.existsSync(fileImagesLocation)) {
    return
  } else {
    fs.mkdirSync(fileImagesLocation, { recursive: true })
  }
}
export const file = async (req: Request) => {
  const formidable = (await import('formidable')).default
  const form = formidable({
    maxFiles: 1,
    uploadDir: fileImagesLocation,
    keepExtensions: true,
    maxFileSize: 4 * 1024 * 1024,
    filter: function ({ name, originalFilename, mimetype }) {
      const valid = name == 'image' || Boolean(mimetype?.includes('image/ '))
      if (!valid) {
        form.emit('error' as any, new Error('file must be image') as any)
      }
      return valid
    }
  })
  return new Promise<any>((resolve, reject) => {
    form.parse(req, (err, fields, files: any) => {
      if (err) {
        return reject(err)
      }
      if (!files.image) {
        return reject(new Error('file must be image'))
      }
      resolve(files.image[0])
    })
  })
}
