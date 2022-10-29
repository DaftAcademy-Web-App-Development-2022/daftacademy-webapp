import React, { useState } from "react";
import type {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from "next/types";
import Head from "next/head";
import type { NextPageWithLayout } from "~/types/common.types";
import { Container, Layout, Loader } from "~/components";
import dbConnect from "~/libraries/mongoose.library";
import { getAllIds, getPlaylistById } from "~/libraries/api.library";
import usePlaylist from "~/hooks/usePlaylist.hook";
import { useSpotifyPlaylist } from "~/hooks/useSpotifyPlaylist.hook";
import PlaylistView from "~/views/Playlist/Playlist.view";

export const getStaticProps = async (ctx: GetStaticPropsContext) => {
  const id = ctx.params?.id?.toString();
  await dbConnect();
  const data = await getPlaylistById(id);

  if (!data) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      id: data.id,
      fallbackData: {
        data,
      },
    },
    revalidate: 60 * 5,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  await dbConnect();
  const ids = await getAllIds();

  const paths = ids.map((id) => {
    return {
      params: {
        id,
      },
    };
  });

  return {
    paths,
    fallback: true,
  };
};

type Props = InferGetStaticPropsType<typeof getStaticProps>;

const Playlist: NextPageWithLayout<Props> = ({ id, fallbackData }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const { data, isLoading } = usePlaylist({
    id,
    fallbackData,
    revalidateOnMount: false,
  });

  const {
    mutate,
    data: spotifyData,
    isLoading: isLoadingSpotify,
  } = useSpotifyPlaylist({
    id: data?.spotifyId,
    revalidateOnMount: false,
    revalidateOnFocus: false,
  });

  React.useEffect(() => {
    setLoading(isLoading || isLoadingSpotify);
  }, [isLoading, isLoadingSpotify]);

  React.useEffect(() => {
    if (data?.spotifyId) {
      mutate();
    }
  }, [data?.spotifyId, mutate]);

  return (
    <>
      <Head>
        <title>DaftAcademy - Lista</title>
      </Head>

      <Container>
        {loading || !spotifyData ? (
          <Loader />
        ) : (
          <PlaylistView
            playlist={{
              name: data?.name || "",
              owner: data?.owner || "",
              slug: data?.slug || "",
              spotifyId: data?.spotifyId || "",
              upvote: data?.upvote || 0,
              color: data?.color || "",
              url: spotifyData?.body.external_urls.spotify,
              image: spotifyData?.body.images?.[0]?.url,
            }}
            tracks={spotifyData?.body.tracks.items}
          />
        )}
      </Container>
    </>
  );
};

export default Playlist;

Playlist.getLayout = (page) => {
  return <Layout>{page}</Layout>;
};
