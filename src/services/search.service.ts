import { food } from '~/schema/food.schema'
import dbs from './database.service'

class searchService {
  async searchNameFood(name_food: string, limit: number, page: number) {
    const result = await dbs.Food.aggregate<food>([
      {
        $match: {
          $text: {
            $search: name_food
          }
        }
      },
      {
        $skip: limit * (page - 1)
      },
      {
        $limit: limit
      }
    ]).toArray()

    const total = await dbs.Food.aggregate([
      {
        $match: {
          $text: {
            $search: name_food
          }
        }
      },
      { $group: { _id: null, totalPage: { $sum: 1 } } }
    ]).toArray()

    let totalPage = 0
    if (total.length !== 0) {
      totalPage = Math.ceil(Number(total[0].totalPage as string) / limit)
    }
    return {
      result,
      totalPage
    }
  }
}
const searchservice = new searchService()
export default searchservice
