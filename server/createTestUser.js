import bcrypt from "bcryptjs";

const passwordHash = await bcrypt.hash("0268@5574", 10);

console.log(passwordHash);