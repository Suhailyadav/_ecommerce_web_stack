import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })
    return { accessToken, refreshToken }
  } catch (error) {
    throw new ApiError(500, 'Something went wrong while generating tokens')
  }
}

const registerUser = asyncHandler( async (req, res) => {
  const {fullName, email, username, password, role } = req.body

  // const requiredFields = ['fullName', 'email', 'username', 'password' ];

  // const emptyField = requiredFields.find(field => !req.body[field] || req.body[field].trim() === '');

  // if (emptyField) {
  //   throw new ApiError(400, `${requiredFields[requiredFields.indexOf(emptyField)]} is required`);
  // }

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
) {
    throw new ApiError(400, "All fields are required")
}

  // const existingUser = await User.findOne({
  //   $or: [{ username }, { email }]
  //  })

  //  if (existingUser) {
  //   if (existingUser.username === username) {
  //     throw new ApiError(409, 'Username is already taken');
  //   } else {
  //     throw new ApiError(409, 'Email is already registered');
  //   }
  // }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }]
})

if (existedUser) {
    throw new ApiError(409, "User with email or username already exists")
}

if (role === 'admin') {
  const adminCount = await User.countDocuments({ role: 'admin' });
  if (adminCount > 0) {
    throw new ApiError(403, 'An admin already exists. Cannot create another admin.');
  }
}


  const user = await User.create({
    fullName,
    email, 
    password,
    username,
    role: role || 'user'
})

const createdUser = await User.findById(user._id).select(
  "-password -refreshToken"
)


if (!createdUser) {
  throw new ApiError(500, "Something went wrong while registering the user")
}

return res.status(201).json(
  new ApiResponse(200, createdUser, "User registered Successfully")
)

})

const loginUser = asyncHandler( async (req, res) => {
  const {username, password, email} = req.body

  // if (!username) {
  //   throw new ApiError(400, 'Username is required');
  // }
  
  // if (!email) {
  //   throw new ApiError(400, 'Email is required');
  // }
  if (!username && !email) {
    throw new ApiError(400, 'username or email is required');
  }

  const user = await User.findOne({
    $or: [{ username }, { email }]
  })
  if (!user) {
    throw new ApiError(404, 'User does not exist')
  }

  const isPasswordValid = await user.isPasswordCorrect(password)
  if(!isPasswordValid) {
    throw new ApiError(401, 'Invalid User Credentials')
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

  const loggedInUser = await User.findById(user._id).select('-password -refreshToken')

  const options = {
    httpOnly: true,
    secure: true
  }

  console.log('USer logged i successful');
 
  return res.status(200)
  .cookie('accessToken', accessToken, options)
  .cookie('refreshToken', refreshToken, options)
  .json(
    new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken}, 'User logged on Successfully')
  )
  


})

const logoutUser = asyncHandler( async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1
      }
    },
    {
      new:true
    }
  )

  const options = {
    httpOnly: true,
    secure: true
  }

  return res.status(200)
  .clearCookie('accessToken', options)
  .clearCookie('refreshToken', options)
  .json(new ApiResponse(200, {}, 'User logged out Successfully'))
})

const refreshAccessToken = asyncHandler( async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

  if (!incomingRefreshToken) {
    throw new ApiError(401, 'Unauthorized request')
  }

  try {
    const decodedToken =  jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    )
  
    const user = await User.findById(decodedToken?._id)
  
    if (!user) {
      throw new ApiError(401, 'Invalid refresh Token')
    }
  
    if (incomingRefreshToken != user?.refreshToken) {
      throw new ApiError(401, 'Refresh token expired or used')
    }
  
    const options = {
      httpOnly: true,
      secure: true
    }
  
    const { accessToken, newRefreshToken } = await generateAccessAndRefreshToken(user._id)
  
    return res.status(200)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', newRefreshToken, options)
    .json(
      new ApiResponse(200, {accessToken, refreshToken: newRefreshToken}, 'Access Token refreshed')
    )
  } catch (error) {
    throw new ApiError(401, error?.message || 'Invalid refresh token')
  }
  
})

export { registerUser, loginUser, logoutUser, refreshAccessToken }