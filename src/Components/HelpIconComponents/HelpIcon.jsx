import React from 'react';
import styles from "./HelpIcon.module.css";

function HelpIcon() {
  return (
    <div className={styles["helpIcon"]}>
      <button type={styles["button"]}>?</button>
    </div>
  );
}

export default HelpIcon;
