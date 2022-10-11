import { useEffect, useRef, useState } from "react";

import type React from "react";
import type { NextPage } from "next";

import { trpc } from "../utils/trpc";
import { PokemonOutput } from "./api/trpc/[trpc]";
import { getOptionsForVote } from "../utils/getRandomPokemon";

import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import { HashLoader } from "react-spinners";

type Ids = number[];

const Home: NextPage = () => {
  const [ids, updateIds] = useState<Ids>([]);

  useEffect(() => {
    const ids = getOptionsForVote();
    updateIds(ids);
  }, []);

  const [first, second] = ids;

  const firstPokemon = trpc.getPokemonById.useQuery({ id: first });
  const secondPokemon = trpc.getPokemonById.useQuery({ id: second });

  const voteMutation = trpc.castVote.useMutation();

  const voteForCutest = (selected: number) => {
    if (selected === first) {
      voteMutation.mutate({ votedForId: first, votedAgainstId: second });
    } else {
      voteMutation.mutate({ votedForId: second, votedAgainstId: first });
    }

    updateIds(getOptionsForVote());
  };

  if (firstPokemon.isLoading || secondPokemon.isLoading) {
    return (
      <section className="w-screen h-screen flex items-center justify-center">
        <HashLoader
          color="orange"
          loading={firstPokemon.isLoading || secondPokemon.isLoading}
          size={50}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </section>
    );
  }

  console.log(firstPokemon.data);
  console.log(secondPokemon.data);

  return (
    <main className="h-screen w-screen flex flex-col items-center justify-between p-10">
      <header>
        <h1 className="text-[1.5rem] md:text-[2rem]">
          Which one is the cutest pokemon?
        </h1>
      </header>
      <section className="flex items-center justify-between w-full max-w-xl">
        <div className="flex flex-col items-center gap-2">
          {!firstPokemon.isLoading &&
            !secondPokemon.isLoading &&
            firstPokemon.data && (
              <PokemonListing
                pokemon={firstPokemon.data}
                vote={() => voteForCutest(first)}
              />
            )}
        </div>
        <div className="flex flex-col items-center gap-2">
          {!firstPokemon.isLoading &&
            !secondPokemon.isLoading &&
            secondPokemon.data && (
              <PokemonListing
                pokemon={secondPokemon.data}
                vote={() => voteForCutest(second)}
              />
            )}
        </div>
      </section>
      <footer className="text-xl md:text-2xl flex gap-5">
        <a
          href="https://twitter.com/dsaglam94"
          target="_blank"
          rel="noreferrer"
        >
          Twitter
        </a>
        <div className="h-8 w-[1px] bg-white" />

        <Link href="/results">
          <a>Results</a>
        </Link>
        <div className="h-8 w-[1px] bg-white" />
        <a href="https://github.com/dsaglam94" target="_blank" rel="noreferrer">
          GitHub
        </a>
      </footer>
    </main>
  );
};

export default Home;

const PokemonListing: React.FC<{
  pokemon: PokemonOutput;
  vote: () => void;
}> = ({ pokemon, vote }) => {
  return (
    <>
      <h2 className="capitalize text-2xl">{pokemon.name}</h2>
      {pokemon.spriteURL && (
        <Image
          src={pokemon.spriteURL}
          alt={pokemon.name}
          width="200px"
          height="200px"
          objectFit="cover"
        />
      )}

      <button
        onClick={() => vote()}
        className="bg-white text-black px-10 py-2 rounded font-bold hover:opacity-90"
      >
        Cuter
      </button>
    </>
  );
};
