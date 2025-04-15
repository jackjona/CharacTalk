import Link from "next/link";
import React from "react";

const Footer = () => {
  const currentYear = new Date(Date.now()).getFullYear();
  return (
    <footer>
      <div className="mx-auto max-w-5xl border-t border-gray-400">
        <p className="mx-auto mt-6 max-w-md text-center leading-relaxed text-gray-400 dark:text-gray-400">
          An AI-powered roleplay chat platform where you can interact with
          dynamic characters and explore endless narratives powered by advanced
          AI language models.
        </p>
        <ul className="p-4 flex flex-wrap justify-center gap-6 md:gap-8 lg:gap-12 text-gray-100">
          {/* <a> tag instead of <Link> used because of the external link*/}
          <a
            href="https://github.com/jackjona/CharacTalk"
            rel="noopener noreferrer"
          >
            <span className="transition hover:text-white/75">GitHub</span>
          </a>
          {/* 
          <Link href="/">
            <span className="transition hover:text-white/75" >
              Careers
            </span>
          </Link>

          <Link href="/">
            <span className="transition hover:text-white/75" >
              History
            </span>
          </Link>

          <Link href="/">
            <span className="transition hover:text-white/75" >
              Services
            </span>
          </Link>

          <Link href="/">
            <span className="transition hover:text-white/75" >
              Projects
            </span>
          </Link>

          <Link href="/">
            <span className="transition hover:text-white/75" >
              Blog
            </span>
          </Link>
          */}
        </ul>
        {/* 
        <div className="pt-8 pb-4 dark:border-gray-800">
          <p className="text-center text-xs/relaxed text-gray-500 dark:text-gray-400">
          <br />
            © Jack Jona {currentYear}.
       
            Created by
            <a
              
              className="text-gray-700 underline transition hover:text-gray-700/75 dark:text-white dark:hover:text-white/75"
            >
              Jack Jona
            </a> 
          </p>
        </div>*/}
      </div>
    </footer>
  );
};

export default Footer;
