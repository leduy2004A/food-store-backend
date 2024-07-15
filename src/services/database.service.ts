import { Collection, Db, MongoClient, ServerApiVersion } from 'mongodb'
import { config } from 'dotenv'
import users from '~/schema/users.schema'
import { token } from '~/schema/token.schema'
import { food } from '~/schema/food.schema'
import { love_Cart } from '~/schema/addlove_addcart.schema'
import order from '~/schema/order.schema'
import { food_image } from '~/schema/food_image.schema'
config()
class database {
  private uri: string
  private client: MongoClient
  private db: Db
  constructor() {
    this.uri = `mongodb+srv://${process.env.USERNAME_MONGODB}:${process.env.PASSWORD_MONGODB}@foodvegetarianstore.8aqf3jv.mongodb.net/?retryWrites=true&w=majority`
    this.client = new MongoClient(this.uri)
    this.db = this.client.db(process.env.NAME_DATABASE)
  }
  async run() {
    try {
      // Connect the client to the server	(optional starting in v4.7)
      await this.client.connect()
      // Send a ping to confirm a successful connection
      await this.db.command({ ping: 1 })
      console.log('Pinged your deployment. You successfully connected to MongoDB!')
    } catch (err) {
      console.log(err)
    }
  }
  get Users(): Collection<users> {
    return this.db.collection(process.env.NAME_COLLECTION_USER as string)
  }
  get Token(): Collection<token> {
    return this.db.collection(process.env.NAME_COLLECTION_TOKEN as string)
  }
  get Food(): Collection<food> {
    return this.db.collection(process.env.NAME_COLLECTION_FOOD as string)
  }
  get LoveAndCart(): Collection<love_Cart> {
    return this.db.collection(process.env.NAME_COLLECTION_LOVE_CART as string)
  }
  get Order(): Collection<order> {
    return this.db.collection(process.env.NAME_COLLECTION_ORDER as string)
  }
  get FoodImage():Collection<food_image>{
    return this.db.collection(process.env.NAME_COLLECTION_FoodImage as string)
  }
}
const dbs = new database()
export default dbs
