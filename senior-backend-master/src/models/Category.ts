import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
<<<<<<< HEAD
  isDefault: { type: Boolean, default: false },
=======
>>>>>>> f89b985b58da9bdb50c90e231e4ddb7a2d3380be
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Category", categorySchema);
