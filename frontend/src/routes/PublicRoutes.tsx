import React, { lazy } from "react";
import { Route } from "react-router-dom";

const LandingPage = lazy(() => import("@features/landing-page"));
const About = lazy(() => import("@features/about"));
const Contact = lazy(() => import("@features/contact"));
const Login = lazy(() => import("@features/login"));
const Register = lazy(() => import("@features/register"));
const ForgetPassword = lazy(() => import("@features/forgot-password"));
const NotFound = lazy(() => import("@features/not-found"));

export const PublicRoutes = [
  <Route key="home" path="/" element={<LandingPage />} />,
  <Route key="about" path="/about" element={<About />} />,
  <Route key="contact" path="/contact" element={<Contact />} />,
  <Route key="login" path="/login" element={<Login />} />,
  <Route key="register" path="/register" element={<Register />} />,
  <Route key="forgot-password" path="/forgot-password" element={<ForgetPassword />} />,
  <Route key="notfound" path="*" element={<NotFound />} />,
];
