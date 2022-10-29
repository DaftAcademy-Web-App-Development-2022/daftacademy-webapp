import Head from "next/head";
import { Container, Background } from "~/components";
import type { NextPageWithLayout } from "~/types/common.types";
import Image from "next/future/image";

import { getProviders, signIn } from "next-auth/react";

import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { PlayCircleIcon } from "@heroicons/react/20/solid";

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const providers = await getProviders();
  return {
    props: {
      providers,
    },
  };
};

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

const Authenticate: NextPageWithLayout<Props> = ({ providers }) => {
  return (
    <>
      <Head>
        <title>DaftAcademy - WebApp 2022</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container>
        <div className="flex flex-auto items-center relative justify-center min-h-screen">
          <div className="z-10">
            {providers &&
              Object.values(providers).map((provider) => {
                return (
                  <div key={provider.name}>
                    <button
                      type="button"
                      onClick={() => signIn(provider.id, { callbackUrl: "/" })}
                      className="rounded-full bg-ui2 bg-opacity-40 hover:bg-opacity-50 transition-all duration-300 ease-in-out"
                    >
                      <PlayCircleIcon className="h-18 text-ui7 hover:text-ui6 opacity-90 transition-all duration-300 ease-in-out" />
                    </button>
                  </div>
                );
              })}
          </div>

          <Background />

          <div className="absolute bottom-0 flex items-center justify-center w-full h-16 px-14 py-10">
            <a
              href="https://www.daftacademy.pl/"
              className="hover:opacity-80 transition-opacity ease-linear"
            >
              <Image
                src="/daftacademy.svg"
                height={30}
                width={180}
                alt="daftacademy logo"
              />
            </a>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Authenticate;
