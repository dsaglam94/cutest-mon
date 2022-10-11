import { prisma } from "../server/utils/prisma";

import { PokemonClient } from "pokenode-ts";

const doBackFill = async () => {
  const pokeApi = new PokemonClient();

  const allPokemons = await pokeApi.listPokemons(0, 493);

  const formattedPokemon = allPokemons.results.map((p, idx) => ({
    id: idx + 1,
    name: (p as { name: string }).name,
    spriteURL: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
      idx + 1
    }.png`,
  }));

  const creation = await prisma.pokemon.createMany({
    data: formattedPokemon,
  });

  console.log("creation:", creation);
};

doBackFill();
