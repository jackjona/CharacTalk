import Link from "next/link";

const Loader = () => {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-slate-900 z-50">
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
