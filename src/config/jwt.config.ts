import 'dotenv/config';
export const jwtconfig = {
  secret: process.env.JWT_SECRET,
  signOptions: {
    expiresIn: 43200,
  },
};
