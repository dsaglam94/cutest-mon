import { trpc } from "../utils/trpc";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";

const Home: NextPage = () => {
  const { data, isLoading } = trpc.hello.useQuery({ text: "Dogan" });
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <p>{data?.greeting}</p>
    </div>
  );
};

export default Home;
