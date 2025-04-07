import Link from "next/link";

const Loader = () => {
  return (
    <div className="min-h-screen flex justify-center items-center bg-slate-900">
      <img
        src="/icon-256.png"
        alt="Logo"
        width="256"
        height="256"
        className="mx-auto object-cover rounded-full shadow-md animate-pulse w-32 h-32"
        loading="eager"
      />
    </div>
  );
};

export default Loader;
