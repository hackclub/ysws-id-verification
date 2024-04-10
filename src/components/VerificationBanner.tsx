import { useRouter } from "next/router";

const VerificationBanner = () => {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/dashboard/verify")}
      className="bg-gray-200 p-4 rounded-md w-full text-center h-32 flex flex-col items-center justify-center"
    >
      <h4 className="text-xl font-semibold tracking-tight">You have not yet verified your ID</h4>
      <p>Please start the verification process by clicking here</p>
    </button>
  );
};

export default VerificationBanner;
