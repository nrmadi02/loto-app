import { ORPCError } from "@orpc/client";
import type { SignupFormData } from "@/features/auth/types/auth-request.type";
import { auth } from "@/lib/auth";
import type { Context } from "../lib/context";

export class AuthService {
  ctx: Context;

  constructor(ctx: Context) {
    this.ctx = ctx;
  }

  async signUpEmail(input: SignupFormData) {
    try {
      const { name, email, password, employeeId, department } = input;

      const data = await auth.api.signUpEmail({
        body: {
          name,
          email,
          password,
        },
      });

      if (!data.user) {
        throw new ORPCError("INTERNAL_SERVER_ERROR", {
          message: "User not created",
        });
      }

      const employee = await this.ctx.prisma.employee.create({
        data: { userId: data.user.id, employeeId, department },
      });

      return { user: data.user, employee };
    } catch (error) {
      console.error(error);
      throw new ORPCError("INTERNAL_SERVER_ERROR", {
        message: "User not created",
      });
    }
  }
}
