import { addFoodRequest, updateFoodRequest } from '~/utils/Request/food.request'
import dbs from './database.service'
import { food } from '~/schema/food.schema'
import { ObjectId } from 'mongodb'
import { Request } from 'express'
import { file } from '~/utils/file'
import sharp from 'sharp'
import { fileImagesLocation } from '~/constants/fileLocation'
import fs from 'fs'
import { getfilename } from '~/constants/getFileName'
import path from 'path'
import { config } from 'dotenv'
import { isProduct } from '~/constants/checkEnviroment'
import { cloudinaryUploadeImage } from '~/utils/cloudinary'
import fsPromise from 'fs/promises'
config()
class foodService {
  async addfoodSerive(admin_id: string, payload: addFoodRequest) {
    const adminObjectId = new ObjectId(admin_id)
    const dataAddFood = {
      ...payload,
      admin_id: adminObjectId
    }
    const result = await dbs.Food.insertOne(new food(dataAddFood))
    if (result.insertedId) {
      return {
        message: 'add food success'
      }
    }
  }
  async uploadImageFood(req: Request) {
    const { nanoid } = await import('nanoid')
    let link = ''
    const { food_id } = req.params
    try {
      const imageFile = await file(req)
      const filepath = imageFile.filepath
      const namefile = nanoid()
      await sharp(filepath)
        .jpeg({ quality: 50 })
        .toFile(path.resolve(fileImagesLocation, namefile) + '.jpg')

      try {
        const cloudinaryResult: any = await cloudinaryUploadeImage({
          filepath: path.resolve(fileImagesLocation, namefile) + '.jpg',
          filename: namefile
        })
        link = cloudinaryResult.url
      } catch (error) {
        console.log('error')
      }

      await Promise.all([
        fsPromise.unlink(filepath),
        fsPromise.unlink(path.resolve(fileImagesLocation, namefile) + '.jpg')
      ])
      await dbs.Food.updateOne(
        { _id: new ObjectId(food_id) },
        {
          $set: {
            image: link
          }
        }
      )
      return link
      // fs.unlinkSync(filepath)
      // fs.unlinkSync(path.resolve(fileImagesLocation, namefile) + '.jpg')
      // console.log(filepath + '    ' + namefile)

      // const resultEv = await isProduct()
      // if (resultEv) {
      //   return `http://localhost:${process.env.PORT}/image/food/${namefile}.jpg`
      // } else {
      //   return `${process.env.HOST}/image/food/${namefile}.jpg`
      // }
    } catch (err) {
      return {
        err
      }
    }
  }
  async deleteFoodService(food_id: string) {
    const result = await dbs.Food.deleteOne({ _id: new ObjectId(food_id) })
    if (result.deletedCount === 0) {
      return false
    }
    return true
  }
  async updateFoodService(food_id: string, dataUpdate: updateFoodRequest) {
    const result = await dbs.Food.findOneAndUpdate(
      { _id: new ObjectId(food_id) },
      {
        $set: {
          ...dataUpdate
        },
        $currentDate: {
          updated_at: true
        }
      },
      {
        returnDocument: 'after',
        projection: {
          admin_id: 0,
          created_at: 0,
          updated_at: 0
        }
      }
    )
    if (result !== null) {
      return result
    }
  }
  async getDetailFoodService(food_id: string) {
    const result = await dbs.Food.findOne(
      { _id: new ObjectId(food_id) },
      {
        projection: {
          admin_id: 0,
          created_at: 0,
          updated_at: 0
        }
      }
    )
    if (result !== null) {
      return result
    }
  }
  async getAllFoodService(limit: number, page: number) {
    const result = await dbs.Food.aggregate([
      {
        $skip: limit * (page - 1)
      },
      {
        $limit: limit
      },
      {
        $project: {
          admin_id: 0,
          created_at: 0,
          updated_at: 0
        }
      }
    ]).toArray()
    const total = await dbs.Food.countDocuments()
    const totalPage = Math.ceil(total / limit)
    const dataFood = {
      result,
      totalPage
    }
    return dataFood
  }

}
const foodservice = new foodService()
export default foodservice
