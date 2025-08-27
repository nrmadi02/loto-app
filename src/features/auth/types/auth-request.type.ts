import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Format email tidak valid").min(1, "Email wajib diisi"),
  password: z.string().min(8, "Password minimal 8 karakter"),
});

export const signupSchema = z
  .object({
    name: z
      .string()
      .min(1, "Nama lengkap wajib diisi")
      .min(2, "Nama minimal 2 karakter"),
    email: z.email("Format email tidak valid").min(1, "Email wajib diisi"),
    employeeId: z
      .string()
      .min(1, "ID Karyawan wajib diisi")
      .regex(/^[A-Z0-9]+$/, "ID Karyawan hanya boleh huruf kapital dan angka"),
    department: z.string().min(1, "Departemen wajib dipilih"),
    password: z.string().min(8, "Password minimal 8 karakter"),
    confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak cocok",
    path: ["confirmPassword"],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
