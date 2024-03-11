import React, { useState, useRef } from "react";
import styles from "./Language.module.css";

const UsersLanguages = (props) => {
  const usersLanguagesLanguageRef = useRef();

  const deleteUsersLanguages = async () => {
    console.log(`props.id=${props.id}`);
    console.log(`props.language=${props.language}`);
    const res = await fetch(
      import.meta.env.VITE_SERVER + "/hw/users/languages/",
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: props.id,
          language: props.language,
        }),
      }
    );

    if (res.ok) {
      props.getUsersLanguagesData();
    }
  };

  const addLanguageToUser = async () => {
    const id = props.id;
    const language = usersLanguagesLanguageRef.current.value;

    if (id > 0) {
      const res = await fetch(
        import.meta.env.VITE_SERVER + "/hw/users/languages",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: id,
            language: language,
          }),
        }
      );
      if (res.ok) {
        props.getUsersLanguagesData();
        usersLanguagesLanguageRef.current.value = "";
      } else {
        console.log("an error has occurred");
      }
    } else {
      console.log("wrong entry, check again");
    }
  };

  return (
    <>
      <div className={`row ${styles.language}`}>
        <div className="col-sm-2">{props.language}</div>
        <button className="col-sm-2" onClick={deleteUsersLanguages}>
          delete
        </button>
        <br />
      </div>
    </>
  );
};

export default UsersLanguages;
