// import React from "react";
// import Image from "next/image";
// import { GetStaticProps, GetServerSideProps } from "next";
// import type {
//   InferGetStaticPropsType,
//   InferGetServerSidePropsType,
// } from "next";
// import { inferAsyncReturnType } from "@trpc/server";
// import { prisma } from "../server/utils/prisma";

// // const getPokemonInOrder = async () => {
// //   return await prisma.pokemon.findMany({
// //     orderBy: {
// //       voteFor: { _count: "desc" },
// //     },
// //     select: {
// //       id: true,
// //       name: true,
// //       spriteURL: true,
// //       _count: {
// //         select: {
// //           voteFor: true,
// //           voteAgainst: true,
// //         },
// //       },
// //     },
// //   });
// // };

// type PokemonQueryResult = {
//   _count: {
//     voteFor: number;
//     voteAgainst: number;
//   };
//   id: number;
//   name: string;
//   spriteURL: string;
// };

// // type PokemonQueryResult = inferAsyncReturnType<typeof getPokemonInOrder>;

// const generateCountPercent = (pokemon: PokemonQueryResult) => {
//   const { voteFor, voteAgainst } = pokemon._count;
//   if (voteFor + voteAgainst === 0) {
//     return 0;
//   }
//   return (voteFor / (voteFor + voteAgainst)) * 100;
// };

// const results = ({
//   pokemon,
// }: InferGetStaticPropsType<typeof getStaticProps>) => {
//   return (
//     <main className="w-screen h-screen flex flex-col items-center justify-between p-10 gap-10">
//       <header className="text-2xl mb-auto">
//         <h1>Behold! Results are here!</h1>
//       </header>
//       <section className="w-full md:max-w-xl">
//         <div className="w-full flex flex-col items-center border">
//           {pokemon &&
//             pokemon.map((p: PokemonQueryResult, idx: number) => {
//               return <PokemonListing key={idx} pokemon={p} idx={idx} />;
//             })}
//         </div>
//       </section>
//     </main>
//   );
// };

// const PokemonListing: React.FC<{
//   pokemon: PokemonQueryResult;
//   idx: number;
// }> = ({ pokemon, idx }) => {
//   console.log(pokemon);
//   return (
//     <div
//       key={idx}
//       className="w-full h-full relative flex items-center justify-between border-b pl-12 pr-5"
//     >
//       <div className="absolute px-4 py-2 text-xs left-0 top-0 flex items-center justify-center bg-gray-700 rounded-br-md">
//         {idx + 1}
//       </div>
//       <div className="flex items-center gap-2">
//         <Image
//           src={pokemon.spriteURL}
//           alt={pokemon.name}
//           objectFit="cover"
//           width={76}
//           height={76}
//         />

//         <h2 className="capitalize">{pokemon.name}</h2>
//       </div>

//       <span>{generateCountPercent(pokemon) + "%"}</span>
//     </div>
//   );
// };

// export default results;

// export const getStaticProps: GetStaticProps = async () => {
//   // const pokemonOrdered = await getPokemonInOrder();

//   return {
//     props: {
//       pokemon: await prisma.pokemon.findMany({
//         orderBy: {
//           voteFor: { _count: "desc" },
//         },
//         select: {
//           id: true,
//           name: true,
//           spriteURL: true,
//           _count: {
//             select: {
//               voteFor: true,
//               voteAgainst: true,
//             },
//           },
//         },
//       }),
//     },
//     revalidate: 60,
//   };
// };

import type { GetServerSideProps } from "next";
import { prisma } from "@/server/utils/prisma";

import Image from "next/image";
import Head from "next/head";

type AsyncReturnType<T extends (...args: any) => Promise<any>> = T extends (
  ...args: any
) => Promise<infer R>
  ? R
  : any;

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

type PokemonQueryResult = AsyncReturnType<typeof getPokemonInOrder>;

const generateCountPercent = (pokemon: PokemonQueryResult[number]) => {
  const { voteFor, voteAgainst } = pokemon._count;
  if (voteFor + voteAgainst === 0) {
    return 0;
  }
  return (voteFor / (voteFor + voteAgainst)) * 100;
};

const PokemonListing: React.FC<{
  pokemon: PokemonQueryResult[number];
  rank: number;
}> = ({ pokemon, rank }) => {
  return (
    <div className="relative flex border-b p-2 items-center justify-between">
      <div className="flex items-center">
        <div className="flex items-center pl-4">
          <Image
            src={pokemon.spriteURL}
            width={64}
            height={64}
            layout="fixed"
            alt={pokemon.name}
          />
          <div className="pl-2 capitalize">{pokemon.name}</div>
        </div>
      </div>
      <div className="pr-4">
        {generateCountPercent(pokemon).toFixed(2) + "%"}
      </div>
      <div className="absolute top-0 left-0 z-20 flex items-center justify-center px-2 font-semibold text-white bg-gray-600 border border-gray-500 shadow-lg rounded-br-md">
        {rank}
      </div>
    </div>
  );
};

const ResultsPage: React.FC<{
  pokemon: PokemonQueryResult;
}> = (props) => {
  return (
    <div className="flex flex-col items-center">
      <Head>
        <title>Roundest Pokemon Results</title>
      </Head>
      <h2 className="text-2xl p-4">Results</h2>
      <div className="flex flex-col w-full max-w-2xl border">
        {props.pokemon &&
          props.pokemon
            .sort((a, b) => {
              const difference =
                generateCountPercent(b) - generateCountPercent(a);

              if (difference === 0) {
                return b._count.voteFor - a._count.voteFor;
              }

              return difference;
            })
            .map((currentPokemon, index) => {
              return (
                <PokemonListing
                  pokemon={currentPokemon}
                  key={index}
                  rank={index + 1}
                />
              );
            })}
      </div>
    </div>
  );
};

export default ResultsPage;

export const getStaticProps: GetServerSideProps = async () => {
  const pokemonOrdered = await getPokemonInOrder();
  const DAY_IN_SECONDS = 60 * 60 * 24;
  return { props: { pokemon: pokemonOrdered }, revalidate: DAY_IN_SECONDS };
};
