import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="h-screen w-screen flex flex-wrap flex-col justify-center content-center bg-indigo-600">
      <SignUp />
    </div>
  );
}
