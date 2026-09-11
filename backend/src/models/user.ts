import mongoose from 'mongoose';

interface IToken {
  token: string;
}

export interface IUser {
  name?: string;
  email: string;
  password: string;
  tokens: IToken[];
}

const tokenSchema = new mongoose.Schema<IToken>(
  {
    token: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  },
);

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Ё-мое',
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false,
  },

  tokens: {
    type: [tokenSchema],
    select: false,
  },
});

export default mongoose.model<IUser>('user', userSchema);
