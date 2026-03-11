const mongoose= require("mongoose");

const USchema= new mongoose.Schema(
{
    email:{
        type:String,
        required:true,
        unique: true,
        lowercase: true,
       trim: true
    },
    name:{
        type:String,
        required:true,
        lowercase: true,
        trim: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["admin", "customer"],
      default: "customer"
    }
  }

);

module.exports=mongoose.model("User",USchema);