// import bcrypt from "bcryptjs";
// import prisma from "@/lib/prisma";
// //import { UserRole } from "@prisma/client";

// export const hashPassword = async (password: string) => {
//   return await bcrypt.hash(password, 10);
// };

// export const comparePassword = async (
//   password: string,
//   hashedPassword: string
// ) => {
//   return await bcrypt.compare(password, hashedPassword);
// };

// export const getUserByEmail = async (email: string) => {
//   try {
//     return await prisma.user.findUnique({
//       where: { email },
//       include: { accounts: true },
//     });
//   } catch {
//     return null;
//   }
// };

// export const createUser = async (data: {
//   email: string;
//   password: string;
//   name: string;
//   role?: UserRole;
// }) => {
//   try {
//     const hashedPassword = await hashPassword(data.password);

//     return await prisma.user.create({
//       data: {
//         ...data,
//         password: hashedPassword,
//         role: data.role ?? UserRole.USER,
//       },
//     });
//   } catch {
//     throw new Error("Ошибка при создании пользователя");
//   }
// };

// export const updateUser = async (id: string, data: {
//   email?: string;
//   name?: string;
//   password?: string;
//   role?: UserRole;
// }) => {
//   try {
//     const updateData: typeof data & { password?: string } = { ...data };

//     if (data.password) {
//       updateData.password = await hashPassword(data.password);
//     }

//     return await prisma.user.update({
//       where: { id },
//       data: updateData,
//     });
//   } catch {
//     throw new Error("Ошибка при обновлении пользователя");
//   }
// };
