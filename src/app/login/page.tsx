"use client";
import { axiosInstance } from "@/lib/axios";
import { Button, TextField } from "@mui/material";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import * as yup from "yup";

const validationSchema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

const initialValues = {
  email: "",
  password: "",
};

const LoginPage = () => {
  const router = useRouter();
  const loginFunc = async (data: { email: string; password: string }) => {
    try {
      const auth = await axiosInstance.post("/login", {
        ...data,
      });
      if (auth.status == 200) {
        if (typeof window != undefined) {
          localStorage.setItem("token", auth.data.token);
        }
        router.push("/dashboard");
      }
    } catch (e) {
      console.log(e);
    }
  };
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (data) => {
      console.log("Form submitted with data:", data);
      loginFunc(data);
    },
  });

  const getProfile = (token: string) => {
    if (!!token) {
      axiosInstance
        .get("/systemsetting/sales-return-setting", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(() => {
          router.push("/dashboard");
        })
        .catch((err) => {
          console.log(err);
          localStorage.removeItem("token");
        });
    }
  };
  useEffect(() => {
    if (typeof window !== "undefined") {
      var token = localStorage.getItem("token");
      if (!!token) {
        getProfile(token);
      }
    }
  }, []);
  return (
    <div className="flex flex-col items-center justify-center h-screen pb-60">
      <h1 className="text-2xl font-semibold mb-4 text-center">Welcome to SaefulAskar</h1>
      <form className="flex flex-col w-full items-center" onSubmit={formik.handleSubmit}>
        <div className="flex flex-col mt-2 w-full mb-4 px-10 items-center">
          <TextField
            required
            id="email"
            name="email"
            type="text"
            label="Email"
            fullWidth
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            className="mt-1 sm:w-[400px]"
          />
          <TextField
            required
            id="password"
            name="password"
            type="password"
            label="Password"
            fullWidth
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
            className="mt-3 w-full sm:w-[400px] mb-3"
          />
        </div>
        <div>
          <Button type="submit" variant="outlined" color="primary">
            Login
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
