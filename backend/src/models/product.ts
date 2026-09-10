import mongoose from 'mongoose';
import fs from 'fs/promises';
import path from 'path';

interface IImage {
  fileName: string;
  originalName: string;
}

interface IProduct {
  title: string;
  image: IImage;
  category: string;
  description: string;
  price?: number | null;
}

const imageSchema = new mongoose.Schema<IImage>({
  fileName: {
    type: String,
    required: true,
  },
  originalName: {
    type: String,
    required: true,
  },
});

const productSchema = new mongoose.Schema<IProduct>({
  title: {
    type: String,
    required: true,
    unique: true,
    minlength: 2,
    maxlength: 30,
  },
  image: imageSchema,
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    default: null,
  },
});

productSchema.post('findOneAndDelete', async (product) => {
  if (!product?.image?.fileName) {
    return;
  }

  const fileName = path.basename(product.image.fileName);

  const imagePath = path.join(__dirname, '../public', 'images', fileName);

  try {
    await fs.unlink(imagePath);
  } catch (error) {
    const fileError = error as { code?: string };

    if (fileError.code !== 'ENOENT') {
      throw error;
    }
  }
});

export default mongoose.model<IProduct>('product', productSchema);
