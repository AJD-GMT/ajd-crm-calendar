import { LoginForm } from '@/features/auth/components/login-form';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold">로그인</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            AJD CRM Calendar에 로그인하세요
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
