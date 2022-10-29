import React from "react";

import Head from "next/head";
import { GetStaticPropsContext, InferGetStaticPropsType } from "next/types";
import { Layout, Container, Loader } from "~/components";
import type { NextPageWithLayout } from "~/types/common.types";

import dbConnect from "~/libraries/mongoose.library";

import { getPlaylists } from "~/libraries/api.library";
import useList from "~/hooks/useList.hook";
import Main from "~/views/Main/Main.view";

export const getStaticProps = async (ctx: GetStaticPropsContext) => {
  await dbConnect();
  const limit = 4;
  const data = await getPlaylists(limit);

  if (!data) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      limit,
      fallbackData: {
        data,
      },
    },
    revalidate: 60 * 5,
  };
};

type Props = InferGetStaticPropsType<typeof getStaticProps>;

const Index: NextPageWithLayout<Props> = ({ fallbackData, limit }) => {
  const { data, mutate, isLoading } = useList({
    limit: 0,
    fallbackData,
    revalidateOnMount: false,
    revalidateOnFocus: false,
  });

  const playlists = isLoading ? null : data;

  React.useEffect(() => {
    mutate();
  }, [mutate]);

  return (
    <>
      <Head>
        <title>DaftAcademy - WebApp 2022</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container>
        {isLoading ? <Loader /> : <Main items={playlists} />}
      </Container>
    </>
  );
};

export default Index;

Index.getLayout = (page) => {
  return <Layout>{page}</Layout>;
};
