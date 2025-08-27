import type { Metadata } from "next";
import { SignupForm } from "@/features/auth/components/signup-form";

export const metadata: Metadata = {
  title: "Sign Up",
};

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">
                P
              </span>
            </div>
            <span className="text-xl font-bold text-foreground">
              PT Pertamina
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Lockout Tagout Safety System
          </p>
        </div>
        <SignupForm />
        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} PT Pertamina (Persero). Sistem
            keselamatan kerja.
          </p>
        </div>
      </div>
    </div>
  );
}
