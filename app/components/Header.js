import Link from "next/link";

const Header = () => {
  return (
    <Link href="/">
      <header className="flex flex-row justify-center items-center bg-slate-700 text-gray-200 p-2 text-xl font-bold shadow-md rounded-2xl mb-8 text-center">
        <img
          src="/icon-192.png"
          alt="Logo"
          width="192"
          height="192"
          loading="eager"
          className="mx-auto w-16 h-16 object-cover rounded-full shadow-md"
        />{" "}
        <h1 className="pl-4 pr-4">CharacTalk</h1>
      </header>{" "}
    </Link>
  );
};

export default Header;
