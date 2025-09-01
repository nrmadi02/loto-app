import { signupSchema } from "@/features/auth/types/auth-request.type";
import { publicProcedure } from "../lib/orpc";
import { AuthService } from "../services/auth.service";

export const authRouter = {
  signUp: publicProcedure
    .input(signupSchema)
    .handler(async ({ input, context }) => {
      const service = new AuthService(context);

      const { user, employee } = await service.signUpEmail(input);

      return {
        status: "success",
        message: "User registered successfully",
        data: {
          user,
          employee,
        },
      };
    }),
};
