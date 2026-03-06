"use client";

import { useApp } from "../providers";
import Header from "./Header";

export default function AuthAwareHeader() {
  const { isLoading, isAuthenticated, name, image } = useApp();

  return (
    <Header
      navLinks={[
        { label: "My account", href: "/account" },
        { label: "Get Your coffee", href: "/getCoffee" },
      ]}
      userName={name}
      userImage={image}
      authLinks={
        isAuthenticated
          ? [{ label: "Log Out", href: "/logOut" }]
          : [
              { label: "Log in", href: "/login" },
              { label: "Sign up", href: "/signup" },
            ]
      }
      showUserDropdown={!isLoading}
    />
  );
}
