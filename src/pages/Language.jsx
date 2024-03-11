import React, { useState } from "react";
import styles from "./Language.module.css";

const Language = (props) => {
  const deleteLanguage = async () => {
    console.log(`props.id=${props.language}`);
    const res = await fetch(
      import.meta.env.VITE_SERVER + "/hw/languages/" + props.language,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (res.ok) {
      props.getLanguageData();
    }
  };

  return (
    <>
      <div className={`row ${styles.language}`}>
        <div className="col-sm-3">{props.language}</div>
        <button className="col-sm-3" onClick={deleteLanguage}>
          delete
        </button>
      </div>
    </>
  );
};

export default Language;
