import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGODB_URI);
    console.log('Mongodb connected sucessfully');
  } catch (error) {
    console.log('Mongodb connection erro',error);
    process.exit(1)
  }
};


export default connectDB;