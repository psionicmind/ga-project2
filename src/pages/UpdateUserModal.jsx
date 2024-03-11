import React, { useRef } from "react";
import ReactDOM from "react-dom";
import styles from "./Modal.module.css";

const OverLayUser = (props) => {
  const nameRef = useRef();
  const ageRef = useRef();
  const countryRef = useRef();

  const updateUser = async () => {
    console.log(`props.id=${props.id}`);
    console.log(`nameRef.current.value=${nameRef.current.value}`);
    console.log(`ageRef.current.value=${ageRef.current.value}`);
    console.log(`countryRef.current.value=${countryRef.current.value}`);

    const res = await fetch(import.meta.env.VITE_SERVER + "/hw/users/", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: props.id,
        name: nameRef.current.value,
        age: ageRef.current.value,
        country: countryRef.current.value,
      }),
    });
    if (res.ok) {
      props.getUserData();
      props.setShowUpdateModal(false);
    }
  };

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <br />
        <br />
        <div className="row">
          <div className="col-md-3"></div>
          <div className="col-md-3">Name</div>
          <input
            ref={nameRef}
            type="text"
            className="col-md-3"
            defaultValue={props.name}
          />
          <div className="col-md-3"></div>
        </div>

        <div className="row">
          <div className="col-md-3"></div>
          <div className="col-md-3">Age</div>
          <input
            ref={ageRef}
            type="text"
            className="col-md-3"
            defaultValue={props.age}
          />
          <div className="col-md-3"></div>
        </div>

        <div className="row">
          <div className="col-md-3"></div>
          <div className="col-md-3">Country</div>
          <input
            ref={countryRef}
            type="text"
            className="col-md-3"
            defaultValue={props.country}
          />
          <div className="col-md-3"></div>
        </div>

        <div className="row">
          <div className="col-md-3"></div>
          <button onClick={() => updateUser(props.id)} className="col-md-3">
            update
          </button>
          <button
            onClick={() => props.setShowUpdateModal(false)}
            className="col-md-3"
          >
            cancel
          </button>
          <div className="col-md-3"></div>
        </div>
      </div>
    </div>
  );
};

const UpdateUserModal = (props) => {
  return (
    <>
      {ReactDOM.createPortal(
        <OverLayUser
          id={props.id}
          name={props.name}
          age={props.age}
          country={props.country}
          getUserData={props.getUserData}
          setShowUpdateModal={props.setShowUpdateModal}
        ></OverLayUser>,
        document.querySelector("#user-modal-root")
      )}
    </>
  );
};

export default UpdateUserModal;
