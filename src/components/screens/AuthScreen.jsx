import AuthForm from "../auth/AuthForm";

export default function AuthScreen() {

  return (
    <div className="h-screen w-screen bg-amber-400">
      <div className="h-full w-full flex justify-center items-center">
        <AuthForm />
      </div>
    </div>
  );
}