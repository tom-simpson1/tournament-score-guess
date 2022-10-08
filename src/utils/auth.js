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
        localStorage.setItem("token", res.data.token);
        setUser(res.data.user);
        navigate("/initialpredictions");
      })
      .catch((err) => {
        console.log(err);
        return err;
      });
  };

  const register = async (code, username, email, password) => {
    return await axios
      .post(api + "/register", {
        code,
        username,
        email,
        password,
      })
      .then((res) => {
        console.log(res);
        window.location("/login");

        // localStorage.setItem("token", res.access_token);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const logout = () => {
    if (user) {
      localStorage.removeItem("token");
      setUser(null);
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
