import { Product } from "../models/product.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createProduct = asyncHandler( async (req, res) => {

  const { name, description, price} = req.body;
  console.log('name:', name)

  const localFilePath = req.files?.image[0]?.path;
  console.log(localFilePath)

  if (!localFilePath) {
    throw new ApiError(400, "File is required")
  }
  
    const image = await uploadOnCloudinary(localFilePath);

    if (!image) {
      throw new ApiError(400, "image file is required")
    }

    const product = await Product.create({
      name,
      image: image.url,
      description, 
      price
    })

    const createdProduct = await Product.findById(product._id)

    if (!createdProduct) {
      throw new ApiError(500, 'Something went wrong while creating the product')
    }

    return res.status(201).json(
      new ApiResponse(200, createdProduct, 'Product created successfully')
    )

})

const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find();
  if (!products) {
    throw new ApiError(404, 'No products found');
  }
  return res.status(200).json(
    new ApiResponse(200, products, 'Products fetched successfully')
  );
});



export {createProduct, getProducts}

