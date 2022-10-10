import * as trpc from "@trpc/server";
import { z } from "zod";

import { PokemonClient } from "pokenode-ts";

export const appRouter = trpc.router();
