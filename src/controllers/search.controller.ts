import { Request, Response, NextFunction } from 'express'
import searchservice from '~/services/search.service'
export const searchNameFoodController = async (req: Request, res: Response, next: NextFunction) => {
  const { name_food } = req.params
  const limit = Number(req.query.limit as string)
  const page = Number(req.query.page as string)
  const data = await searchservice.searchNameFood(name_food, limit, page)
  return res.json(data)
}
