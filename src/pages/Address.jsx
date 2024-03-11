import React, { useState } from "react";
import styles from "./Address.module.css";
import UpdateUserModal from "./UpdateUserModal";

const Address = (props) => {
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const deleteUser = async () => {
    console.log(`props.id=${props.id}`);
    const res = await fetch(import.meta.env.VITE_SERVER + "/hw/users/", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: props.id,
      }),
    });

    if (res.ok) {
      props.getUserData();
    }
  };

  return (
    <>
      {showUpdateModal && (
        <UpdateUserModal
          id={props.id}
          name={props.name}
          age={props.age}
          country={props.country}
          getUserData={props.getUserData}
          setShowUpdateModal={setShowUpdateModal}
        />
      )}
      <div className={`row ${styles.user}`}>
        <div className="col-sm-1">{props.id}</div>
        <div className="col-sm-3">{props.name}</div>
        <div className="col-sm-2">{props.age}</div>
        <div className="col-sm-2">{props.country}</div>
        <button className="col-sm-2" onClick={deleteUser}>
          delete
        </button>
        <button className="col-sm-2" onClick={() => setShowUpdateModal(true)}>
          update
        </button>
      </div>
    </>
  );
};

export default Address;
