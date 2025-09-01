import { call } from "@orpc/server";
import {
  afterAll,
  beforeEach,
  describe,
  expect,
  it,
  type Mock,
  vi,
} from "vitest";
import { authRouter } from "@/app/api/[[...route]]/routers/auth.router";
import type { SignupFormData } from "@/features/auth/types/auth-request.type";
import { auth } from "@/lib/auth";
import prismaTest from "../../lib/prisma-test";

vi.mock("@/lib/auth", () => ({
  auth: { api: { signUpEmail: vi.fn() } },
}));

const input: SignupFormData = {
  name: "Test User",
  email: "test@example.com",
  password: "password123",
  confirmPassword: "password123",
  employeeId: "EMP001",
  department: "Engineering",
};

const user = (userId: string) => ({
  id: userId,
  email: input.email,
  name: input.name,
  image: null,
  emailVerified: false,
  createdAt: new Date(),
  updatedAt: new Date(),
});

describe("authRouter.signUp via fake handler (forward to real)", () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    await prismaTest.employee.deleteMany({});
    await prismaTest.user.deleteMany({});
  });

  afterAll(async () => {
    await prismaTest.$disconnect();
  });

  it("creates employee when external signup succeeds", async () => {
    const userId = "1";
    const mockSignUp = auth.api.signUpEmail as unknown as Mock;
    mockSignUp.mockResolvedValue({
      user: user(userId),
    });

    await prismaTest.user.create({
      data: user(userId),
    });

    const res = await call(authRouter.signUp, input, {
      context: { prisma: prismaTest, session: null, headers: new Headers() },
    });

    expect(res.status).toBe("success");
    expect(mockSignUp).toHaveBeenCalledWith({
      body: { name: input.name, email: input.email, password: input.password },
    });

    const employee = await prismaTest.employee.findFirst();
    expect(employee?.employeeId).toBe("EMP001");
    expect(employee?.department).toBe("Engineering");
  });

  it("throws and does not create employee when external fails", async () => {
    const mockSignUp = auth.api.signUpEmail as unknown as Mock;
    mockSignUp.mockResolvedValue({ user: null });

    await expect(
      call(authRouter.signUp, input, {
        context: { prisma: prismaTest, session: null, headers: new Headers() },
      })
    ).rejects.toThrow("User not created");

    expect(await prismaTest.employee.count()).toBe(0);
  });
});
