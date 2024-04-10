import { useRouter } from "next/router";

const VerificationBanner = () => {
  const router = useRouter();

  return (
    <button className="bg-gray-200 p-4 rounded-md w-full text-center h-32 flex flex-col items-center justify-center">
      <h4 className="text-xl font-semibold tracking-tight">You have not yet verified your ID</h4>
      <p>Please start the verification process by filling out the form below</p>
    </button>
  );
};

export default VerificationBanner;
