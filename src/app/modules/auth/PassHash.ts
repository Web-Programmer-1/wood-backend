import bcrypt from "bcrypt";

// Password hashing
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10; // industry standard
  const hashed = await bcrypt.hash(password, saltRounds);
  return hashed;
};

// Password compare
export const comparePassword = async (
  plain: string,
  hashed: string
): Promise<boolean> => {
  const isMatch = await bcrypt.compare(plain, hashed);
  return isMatch;
};
