import { checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'
import dbs from '~/services/database.service'
import { typefood } from '~/utils/foodtype'
import { validate } from '~/utils/runcheckschema'
import expressErrorhandlers from 'express-errorhandlers'
export const addFoodValidator = validate(
  checkSchema({
    food_name: {
      notEmpty: true,
      isString: {
        errorMessage: 'Name food must be string'
      },
      isLength: {
        options: {
          min: 2,
          max: 20
        }
      },
      trim: true
    },
    price: {
      isNumeric: true,
      notEmpty: {
        errorMessage: 'price must be not empty'
      },
      trim: true
    },
    food_description: {
      isString: true,
      isLength: {
        options: {
          min: 10,
          max: 200
        }
      }
    },
    detail_food: {
      isString: true,
      isLength: {
        options: {
          min: 10,
          max: 400
        }
      }
    },
    quantity: {
      isNumeric: true,
      notEmpty: {
        errorMessage: 'quantity is required'
      }
    },
    label: {
      optional: true,
      isString: true,
      custom: {
        options: (value) => {
          const isStringInObject = Object.values(typefood).includes(value)
          if (!isStringInObject) {
            throw new Error('label must be food type')
          }
          return true
        }
      }
    },
    food_list: {
      isArray: true,
      custom: {
        options: (value) => {
          if (value.length > 0) {
            const containFoodList = value.some((item: any) => Object.values(typefood).includes(item))
            if (!containFoodList) {
              throw new Error('food_list must be food type')
            }
            return true
          }
        }
      }
    }
  })
)
export const UpdateFoodValidator = validate(
  checkSchema({
    food_name: {
      optional: true,
      isString: {
        errorMessage: 'Name food must be string'
      },
      isLength: {
        options: {
          min: 2,
          max: 20
        }
      },
      trim: true
    },
    price: {
      optional: true,
      isNumeric: true,
      trim: true
    },
    food_description: {
      optional: true,
      isString: true,
      isLength: {
        options: {
          min: 10,
          max: 200
        }
      }
    },
    detail_food: {
      optional: true,
      isString: true,
      isLength: {
        options: {
          min: 10,
          max: 400
        }
      }
    },
    quantity: {
      optional: true,
      isNumeric: true
    },
    food_list: {
      optional: true,
      isArray: true,
      custom: {
        options: (value) => {
          console.log(value)
          if (value.length > 0) {
            const containFoodList = value.some((item: any) => Object.values(typefood).includes(item))
            if (!containFoodList) {
              throw new Error('food_list must be food type')
            }
            return true
          }
        }
      }
    },
    label: {
      optional: true,
      isString: true,
      custom: {
        options: (value) => {
          const isStringInObject = Object.values(typefood).includes(value)
          if (!isStringInObject) {
            throw new Error('label must be food type')
          }
          return true
        }
      }
    }
  })
)
export const food_idvalidator = validate(
  checkSchema({
    food_id: {
      isString: true,
      notEmpty: true,
      custom: {
        options: async (value, { req }) => {
          const result = await dbs.Food.findOne({ _id: new ObjectId(value) })
          if (result === null) {
            throw new Error('food_id not found')
          }
          return true
        }
      }
    }
  })
)
export const quantityValidator = validate(
  checkSchema({
    quantity: {
      isNumeric: true,
      notEmpty: true
    }
  })
)
