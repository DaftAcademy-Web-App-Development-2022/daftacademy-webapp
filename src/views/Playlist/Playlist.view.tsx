import React from "react";
import Image from "next/image";
import { Track } from "~/views/Playlist/components";
import styles from "./Playlist.module.css";
import { Model } from "~/models/Playlist.model";

interface Playlist extends Model {
  image: string;
  url: string;
}

interface Props {
  playlist: Playlist;
  tracks: SpotifyApi.PlaylistTrackObject[] | null;
}

const Playlist = ({ playlist, tracks }: Props) => (
  <div className={styles.root}>
    <div className={styles.header}>
      <div className={styles.mainImageContainer}>
        <div
          className={styles.playlistColor}
          style={{ background: playlist.color }}
        />
        {playlist.image ? (
          <Image
            src={playlist.image}
            className={styles.mainImage}
            width={100}
            height={100}
            alt="playlist image"
          />
        ) : (
          <span className={`${styles.mainImage} ${styles.placeholder}`} />
        )}
      </div>

      <div className={styles.headerInfo}>
        <a
          href={playlist.url}
          className={styles.name}
          target="_blank"
          rel="noopener noreferrer"
        >
          {playlist.name}
        </a>
        <span className={styles.owner}>{playlist.owner}</span>
      </div>
    </div>

    <ul>
      <li className={styles.listHeader}>
        <span className={styles.headerIndex}>#</span>
        <span />
        <span>Tytuł</span>
        <span className={styles.headerDuration}>Czas trwania</span>
        <span />
      </li>
      {tracks &&
        tracks.map(
          (item: SpotifyApi.PlaylistTrackObject, index) =>
            item.track && (
              <Track track={item.track} index={index + 1} key={item.track.id} />
            )
        )}
    </ul>
  </div>
);

export default Playlist;
