import Link from "next/link";

const Header = () => {
  return (
    <header className="flex flex-row justify-center items-center text-xl font-bold rounded-2xl text-center">
      <Link href="/">
        <img
          src="/icon-192.png"
          alt="Logo"
          width="192"
          height="192"
          loading="eager"
          className="mx-auto w-24 h-24 mt-6 object-cover rounded-full shadow-md bg-slate-700 text-gray-200"
        />{" "}
        <h1 className="pl-4 pr-4">CharacTalk</h1>
      </Link>
    </header>
  );
};

export default Header;
