import React, { useEffect, useState } from "react";
import AdminCard from "./adminCard";
import Axios from "axios";
import { useUserState } from "../UserContext";
import AddAdmin from "./addAdmin";

function ManageAdmins() {
  const [admins, setAdmins] = useState([]);
  const { isAuthenticated, user } = useUserState();
  const handleAddAdmin = (admin) => {
    console.log(admin, admins);
    setAdmins([...admins, admin]);
  };
  const deleteAdmin = (id) => {
    console.log(id);
    const delObj = {
      id,
    };
    Axios.post(
      "http://localhost:8080/eLibrary/server/deleteUser.php",
      delObj
    ).then((response) => {
      console.log(response);
      let filteredAdmins = admins.filter((a) => a.id !== id);

      setAdmins(filteredAdmins);
    });
  };
  useEffect(() => {
    Axios.get("http://localhost:8080/eLibrary/server/allAdmins.php").then(
      (response) => {
        console.log(response);
        setAdmins(response.data.admins);
      }
    );
  }, []);

  if (isAuthenticated && user.role === "ADMIN") {
    return (
      <div>
        <AddAdmin handleAddAdmin={handleAddAdmin} />
        {admins.map((admin) => (
          <AdminCard
            key={admin.id}
            email={admin.email}
            id={admin.id}
            deleteAdmin={deleteAdmin}
          />
        ))}
      </div>
    );
  } else {
    return <p>Please Log In as Admin</p>;
  }
}

export default ManageAdmins;
