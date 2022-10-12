import React from "react";

const about = () => {
  return (
    <main className="h-screen w-screen flex flex-col items-center justify-start p-10 gap-5 text-center opacity-90">
      <header className="text-xl md:text-2xl">
        <h1>Why this project?</h1>
      </header>
      <p className="text-lg md:text-xl w-full md:max-w-xl">
        Because what teaches you better than making your hands dirty and
        building a pokemon app?
      </p>

      <p>
        - Here is the public repo:{" "}
        <a
          className="underline"
          href="https://github.com/dsaglam94/cutest-mon.git"
          target="_blank"
          rel="noreferrer"
        >
          cutest-mon
        </a>
      </p>

      <p className="mt-auto">
        I am inspired this project from{" "}
        <a
          className="underline"
          href="https://twitter.com/t3dotgg"
          target="_blank"
          rel="noreferrer"
        >
          Theo - ping.gg
        </a>
      </p>
    </main>
  );
};

export default about;
