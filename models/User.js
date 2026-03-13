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
      minlength:6,
      required: true
    },
    role: {
      type: String,
      enum: ["admin", "customer"],
      default: "customer"
    }
    
  }, { timestamps: true }
  
);

module.exports=mongoose.model("User",USchema);