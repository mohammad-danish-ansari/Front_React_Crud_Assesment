import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { toast, ToastContainer } from "react-toastify";
import ExitModel from "./ExitModel/ExitModel";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}
interface ApiResponse {
  message: string;
  data: any;
}

const UserList: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [deleteUser, setDeleteUser] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const getAllUserData = async (): Promise<void> => {
    try {
      setLoading(true);
      const res = await axios.get<{ data: User[] }>(
        `https://server-react-crud-assesment.onrender.com/v1/website/user/getAll`,
        {
          headers: {
            "content-type": "application/json",
          },
        },
      );

      setUser(res.data.data);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const deleteData = async (id: string): Promise<void> => {
    try {
      const res = await axios.delete<ApiResponse>(
        `https://server-react-crud-assesment.onrender.com/v1/website/user/deleteById/${id}`,
        {
          headers: {
            "content-type": "application/json",
          },
        },
      );

      toast.success(res.data.message);
      getAllUserData();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const logout = (): void => {};

  useEffect(() => {
    getAllUserData();
  }, []);

  return (
    <>
      <ExitModel
        isOpen={deleteUser}
        onClose={() => setDeleteUser(false)}
        onConfirm={() => {
          if (selectedUserId) {
            deleteData(selectedUserId);
          }
          setDeleteUser(false);
        }}
        title="Delete User"
        message="Are you sure you want to delete this User?"
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />
      {loading ? (
        <div className="spinner vh-100 d-flex justify-content-center align-items-center">
          <ClipLoader color="#123abc" loading={loading} size={50} />
        </div>
      ) : (
        <div className="card m-4 y-auto">
          <div className="contact d-flex justify-content-between p-2">
            <h2 className="text-">User List</h2>
            <button
              className="btn btn-primary border-white text-right"
              onClick={logout}
            >
              LOG OUT
            </button>
          </div>

          <div className="p-4">
            <div className="card p-4">
              <div className="contact d-flex justify-content-between">
                <h2>User List</h2>
                <button
                  className="btn btn-primary border-white"
                  onClick={() => navigate("/usersForm")}
                >
                  Add User
                </button>
              </div>
              <div className="table-responsive">
                <table className="user-table">
                  <thead>
                    <tr className="text-center text-500">
                      <th>Sr No</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {user.map((x, index) => (
                      <tr className="text-center" key={x._id}>
                        <td>{index + 1}</td>
                        <td>
                          {x.firstName} {x.lastName}
                        </td>
                        <td>{x.email}</td>
                        <td>{x.phone}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-warning mx-2"
                            onClick={() => navigate(`/usersForm?id=${x._id}`)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => {
                              setSelectedUserId(x._id);
                              setDeleteUser(true);
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
      <style>{`
  .table-responsive {
    width: 100%;
    overflow-x: auto;
  }

  .user-table {
    width: 100%;
    border-collapse: collapse;
    min-width: 600px;
  }

  .user-table th,
  .user-table td {
    padding: 8px;
    white-space: nowrap;
  }

  @media (max-width: 669px) {
    .card {
      margin: 10px !important;
    }

    .user-table {
      font-size: 12px;
    }

    .btn-sm {
      padding: 4px 6px;
      font-size: 11px;
    }
  }
`}</style>
    </>
  );
};

export default React.memo(UserList);
