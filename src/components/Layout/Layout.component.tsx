import type React from "react";
import Progress from "nextjs-progressbar";
import styles from "./Layout.module.css";
import { Sidebar, Player } from "~/components";

interface Props {
  children: React.ReactNode;
}

export const Layout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <Progress
        color="hsl(14, 98%, 66%)"
        startPosition={0.3}
        stopDelayMs={200}
        height={3}
        showOnShallow={true}
      />
      <header className={styles.header}>
        <Sidebar />
      </header>
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>
        <Player />
      </footer>
    </>
  );
};

export default Layout;
