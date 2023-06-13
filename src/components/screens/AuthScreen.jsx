import AuthForm from "../auth/AuthForm";

export default function AuthScreen() {

  return (
    <div className="h-screen w-screen bg-secondary">
      <div className="h-full w-full flex justify-center items-center">
        <AuthForm />
      </div>
    </div>
  );
}