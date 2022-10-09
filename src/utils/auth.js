import React, { useState, useContext, createContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const api = process.env.REACT_APP_API_URL;

const authContext = createContext();

export function AuthProvider({ children }) {
  const auth = useAuthProvider();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const useAuth = () => {
  return useContext(authContext);
};

function useAuthProvider() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      checkAuth().then((res) => setLoading(false));
    }
  }, [user]);

  const checkAuth = async () => {
    // console.log("token: ", localStorage.getItem("token"), user);
    // no token provided or user already checked prevents to make unwanted requests
    if (!localStorage.getItem("token") || user !== null) {
      return;
    }

    await axios
      .get(api + "/user", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        setUser(res.data.user);
        return res;
      })
      .catch((err) => {
        return err;
      });
  };

  // login
  const login = async (username, password) => {
    return await axios
      .post(`${api}/login`, { username: username, password: password })
      .then((res) => {
        if (res.data.message) return res.data.message;
        localStorage.setItem("token", res.data.token);
        setUser(res.data.user);
        navigate("/initialpredictions");
      })
      .catch((err) => {
        return err;
      });
  };

  const register = async (code, username, email, password, salt) => {
    return await axios
      .post(`${api}/register`, {
        code,
        username,
        email,
        password,
        salt,
      })
      .then((res) => {
        console.log("Register Result: ", res);
        if (res.data.message) {
          console.log(res.data.message);
          return res.data.message;
        }
        console.log("Registration successful");
        navigate("/");
      })
      .catch((err) => {
        console.log("Registration Error: ", err);
        return err;
      });
  };

  const logout = () => {
    if (user) {
      localStorage.removeItem("token");
      setUser(null);
      navigate("/");
    }
    return;
  };

  return {
    user,
    loading,
    login,
    register,
    logout,
  };
}
