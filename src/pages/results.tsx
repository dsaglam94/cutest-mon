import React from "react";
import Image from "next/image";
import { GetStaticProps, GetServerSideProps } from "next";
import type {
  InferGetStaticPropsType,
  InferGetServerSidePropsType,
} from "next";
import { inferAsyncReturnType } from "@trpc/server";
import { prisma } from "../server/utils/prisma";

const getPokemonInOrder = async () => {
  return await prisma.pokemon.findMany({
    orderBy: {
      voteFor: { _count: "desc" },
    },
    select: {
      id: true,
      name: true,
      spriteURL: true,
      _count: {
        select: {
          voteFor: true,
          voteAgainst: true,
        },
      },
    },
  });
};

const generateCountPercent = (pokemon: PokemonQueryResult[number]) => {
  const { voteFor, voteAgainst } = pokemon._count;
  if (voteFor + voteAgainst === 0) {
    return 0;
  }
  return (voteFor / (voteFor + voteAgainst)) * 100;
};

type PokemonQueryResult = inferAsyncReturnType<typeof getPokemonInOrder>;

const results = ({
  pokemon,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <main className="w-screen h-screen flex flex-col items-center justify-between p-10 gap-10">
      <header className="text-2xl mb-auto">
        <h1>Behold! Results are here!</h1>
      </header>
      <section className="w-full md:max-w-xl">
        <div className="w-full flex flex-col items-center border">
          {pokemon &&
            pokemon.map((p: PokemonQueryResult[number], idx: number) => {
              return <PokemonListing key={idx} pokemon={p} idx={idx} />;
            })}
        </div>
      </section>
    </main>
  );
};

const PokemonListing: React.FC<{
  pokemon: PokemonQueryResult[number];
  idx: number;
}> = ({ pokemon, idx }) => {
  console.log(pokemon);
  return (
    <div
      key={idx}
      className="w-full h-full relative flex items-center justify-between border-b pl-12 pr-5"
    >
      <div className="absolute px-4 py-2 text-xs left-0 top-0 flex items-center justify-center bg-gray-700 rounded-br-md">
        {idx + 1}
      </div>
      <div className="flex items-center gap-2">
        <Image
          src={pokemon.spriteURL}
          alt={pokemon.name}
          objectFit="cover"
          width={76}
          height={76}
        />

        <h2 className="capitalize">{pokemon.name}</h2>
      </div>

      <span>{generateCountPercent(pokemon) + "%"}</span>
    </div>
  );
};

export default results;

export const getStaticProps: GetServerSideProps = async () => {
  const pokemonOrdered = await getPokemonInOrder();

  return {
    props: {
      pokemon: pokemonOrdered,
    },
    revalidate: 60,
  };
};
