import React, { useEffect, useState } from "react";

import Axios from "axios";
import { useUserState } from "../UserContext";
import ReaderCard from "./readerCard";
// import AddAdmin from "./addAdmin";
import {
  displayError,
  displaySuccess,
  useErrorDispatch,
} from "../ErrorContext"; 

function ManageReaders() {
  const [readers, setReaders] = useState([]);
  const { isAuthenticated, user } = useUserState();
  const errorDispatch = useErrorDispatch();
  const handleReader = (reader) => {
    console.log(reader, readers);
    setReaders([...readers, reader]);
  };
  const deleteReader = (id) => {
    console.log(id);
    const delObj = {
      id,
    };
    Axios.post("/deleteUser.php", delObj).then((response) => {
      console.log(response);
      let filterReaders = readers.filter((a) => a.id !== id);
      if(response.status === 200) {
        displaySuccess(errorDispatch,response.data.msg)
      }
      else {
        displayError(errorDispatch,response.data.msg)
      }
      setReaders(filterReaders);
    });
  };
  useEffect(() => {
    Axios.get("/allReaders.php").then((response) => {
      console.log(response);
      setReaders(response.data.readers);
    });
  }, []);

  if (isAuthenticated && user.role === "ADMIN") {
    return (
      <div>
        {readers.map((reader) => (
          <ReaderCard
            key={reader.id}
            email={reader.email}
            id={reader.id}
            deleteReader={deleteReader}
          />
        ))}
      </div>
    );
  } else {
    return <p>Please Log In as Admin</p>;
  }
}

export default ManageReaders;
