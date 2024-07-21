import mongoose, {Schema} from "mongoose";


const cartItemSchema = new Schema(
  {
    product: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Product' 
    },
    quantity: { 
      type: Number, 
      required: true, 
      min: 1 
    }
  }
)

const cartSchema = new Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      unique: true,
    },
    items:{
    type: [cartItemSchema],
    default: []
    }
  }
)

export const Cart= mongoose.model("Cart", cartSchema)