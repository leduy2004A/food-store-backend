import { checkSchema } from 'express-validator'
import { validate } from '~/utils/runcheckschema'

export const orderValidator = validate(
  checkSchema({
    Phone: {
      isMobilePhone: {
        options: ['vi-VN']
      },
      trim: true
    },
    RecipientsName: {
      isString: true,
      isLength: {
        options: {
          min: 2,
          max: 20
        }
      },
      trim: true
    },
    ReceiverAddress: {
      notEmpty: {
        errorMessage: 'ReceiverAddress is required'
      },
      isLength: {
        options: {
          min: 4,
          max: 100
        }
      }
    },
    District: {
      notEmpty: {
        errorMessage: 'District is required'
      },
      isLength: {
        options: {
          min: 4,
          max: 30
        }
      }
    },
    Ward: {
      notEmpty: {
        errorMessage: 'ReceiverAddress is required'
      },
      isLength: {
        options: {
          min: 4,
          max: 30
        }
      }
    },
    Email: {
      notEmpty: {
        errorMessage: 'Email is required'
      },
      isEmail: {
        errorMessage: 'Email is invalid'
      },
      trim: true
    },
    Province: {
      notEmpty: {
        errorMessage: 'Province is required'
      },
      isLength: {
        options: {
          min: 2,
          max: 30
        }
      },
      trim: true
    }
  })
)
