import { ORPCError } from "@orpc/client";
import {
  loginSchema,
  signupSchema,
} from "@/features/auth/types/auth-request.type";
import { auth } from "@/lib/auth";
import { publicProcedure } from "../lib/orpc";

export const authRouter = {
  signUp: publicProcedure
    .input(signupSchema)
    .handler(async ({ input, context }) => {
      const db = context.prisma;
      const data = await auth.api.signUpEmail({
        body: {
          name: input.name,
          email: input.email,
          password: input.password,
        },
      });

      if (!data.user) {
        throw new ORPCError("INTERNAL_SERVER_ERROR", {
          message: "User not created",
        });
      }

      const createEmployee = await db.employee.create({
        data: {
          userId: data.user.id,
          employeeId: input.employeeId,
          department: input.department,
        },
      });

      return {
        status: "success",
        message: "User registered successfully",
        data: {
          user: data.user,
          employee: createEmployee,
        },
      };
    }),
};
