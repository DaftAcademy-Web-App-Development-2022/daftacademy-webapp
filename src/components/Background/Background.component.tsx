import React from "react";

import styles from "./Background.module.css";

interface Props {}

const Background: React.FC<Props> = () => {
  return (
    <React.Fragment>
      <div className={styles.background} />
      <div className={styles.gradient} />
    </React.Fragment>
  );
};

export default Background;
