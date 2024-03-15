import React, { useState } from "react";
import styles from "./Address.module.css";
import UpdateUserModal from "./UpdateUserModal";

const Address = (props) => {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  // const [showDeleteButton, setShowDeleteButton]= useState(false);
  // const [showUpdateButton, setShowUpdateButton]= useState(false);

  // console.log(props.isShowDeleteButton);
  // setShowDeleteButton(props.isShowDeleteButton);

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
      props.getData();
    }
  };

  return (
    <>
      {showUpdateModal && (
        <UpdateUserModal
          id={props.id}
          name={props.name}
          address={props.address}
          getData={props.getData}
          setShowUpdateModal={setShowUpdateModal}
        />
      )}
      <div className={`row ${styles.address}`}>
        <div className="col-sm-1">{props.id}</div>
        <div className="col-sm-2">{props.name}</div>
        <div className="col-sm-6">{props.address}</div>
        {/* <button className="col-sm-1" onClick={deleteUser}>delete</button>
        <button className="col-sm-1" onClick={() => setShowUpdateModal(true)}>update</button> */}
      </div>
    </>
  );
};

export default Address;
