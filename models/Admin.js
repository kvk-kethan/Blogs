const {Schema,model}=require("mongoose")
const validator=require("validator")
const bcrypt=require("bcryptjs")

const adminSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "name field cant be empty"],
      trim: true,
      default:"admin"
    },
    email: {
      type: String,
      required: [true, "email field cant be empty"],
      lowercase: true,
      unique: true,
      validate: [validator.isEmail, "enter proper email"],
    },
    role: {
      type: String,
      enum: {
        values: ["admin"],
        message:`{VALUE} role is not defined`
      },
      default: "admin",
    },
    password: {
      type: String,
      required: [true, "password field cant be empty"],
      minlength: [8, "password should contain above 8 characters"],
    },
    confirmPassword: {
      type: String,
      required: [true, "Confirm password field cant be empty"],
      //custom validation
      validate: {
        validator: function (value) {
          return this.password === value;
        },
        message: "password doesn't match",
      },
    },
  },
  {
    timestamps: true,
  }
);

adminSchema.pre("save",async function(next){
    this.password=await bcrypt.hash(this.password,10)
    next()
})

adminSchema.methods.comparePassword=async function(pwd,pwdDB){
    return await bcrypt.compare(pwd,pwdDB)
}

module.exports=model("admin",adminSchema);