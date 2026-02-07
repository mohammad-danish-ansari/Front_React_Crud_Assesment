import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { toast, ToastContainer } from "react-toastify";
import { validateFields } from "../utils/formValidator";

interface UserForm {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  description: string;
}
export const API_BASE = "http://localhost:5000/api";
const UserForm: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id: string | null = searchParams.get("id");

  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);

  const [formData, setFormData] = useState<UserForm>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    description: "",
  });
  interface ApiResponse {
    message: string;
    data: any;
  }
  const submit = async (): Promise<void> => {
    try {
      const requiredFields = [
        { name: "firstName", label: "First Name" },
        { name: "lastName", label: "Last Name" },
        { name: "phone", label: "Phone No" },
        { name: "email", label: "Email" },
      ];
      const validation = validateFields(requiredFields, formData);
      if (!validation.isValid) {
        toast.warning(validation.message);
        return;
      }
      if (id) {
        setLoading(true);

        const res = await axios.put<ApiResponse>(
          `https://server-react-crud-assesment.onrender.com/v1/website/user/updateById/${id}`,
          formData,
          {
            headers: {
              "content-type": "application/json",
            },
          },
        );
  setTimeout(() => {
        navigate("/userList");
      }, 1000);
        toast.success(res.data.message);
      } else {
        setLoading(true);
        const res = await axios.post<ApiResponse>(
          "https://server-react-crud-assesment.onrender.com/v1/website/user/create",
          formData,
          {
            headers: {
              "content-type": "application/json",
            },
          },
        );
  setTimeout(() => {
        navigate("/userList");
      }, 1000);
        toast.success(res?.data?.message);
      }

    
    } catch (error: any) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const getById = async (): Promise<void> => {
    if (!id) return;

    try {
      setLoading(true);

      const res = await axios.get<{ data: UserForm }>(
        `https://server-react-crud-assesment.onrender.com/v1/website/user/getById/${id}`,
        {
          headers: {
            "content-type": "application/json",
          },
        },
      );

      setFormData(res.data.data);
    } catch (error) {
      toast.error("Failed to fetch user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      getById();
    }
  }, [id]);

  return (
    <>
      {loading ? (
        <div className="spinner vh-100 d-flex justify-content-center align-items-center">
          <ClipLoader color="#123abc" loading={loading} size={50} />
        </div>
      ) : (
        <div className="container ">
          <div className="row  vh-100 d-flex justify-content-center align-items-center">
            <div className="card card-primary shadow p-0">
              <div className="contact d-flex justify-content-between p-2">
                <h2>{id ? "Update" : "Add"} User</h2>
                <button
                  className="btn btn-primary border-white"
                  onClick={() => navigate("/usersList")}
                >
                  BACK
                </button>
              </div>

              <div className="card-body">
                <div className="form-group">
                  <label>
                    First Name <span>*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.firstName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>
                    Last Name <span>*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.lastName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>
                    Phone <span>*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.phone}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>
                    Email <span>*</span>
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    value={formData.email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>

                <div className="text-center mt-3">
                  <button className="btn btn-primary w-50" onClick={submit}>
                    {id ? "Update" : "Save"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </>
  );
};

export default UserForm;
