"use client";

import { useApp } from "../providers";
import Header from "./Header";
import { authClient } from "@/lib/auth-client";

export default function AuthAwareHeader() {
  const { isLoading, isAuthenticated, name, image } = useApp();
  const { data: session } = authClient.useSession();
  const getCoffeeHref = session?.user?.id ? `/getCoffee/${session.user.id}` : "/getCoffee";

  return (
    <Header
      navLinks={[
        { label: "My account", href: "/account" },
        { label: "Get your coffee", href: getCoffeeHref },
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
      showUserDropdown={true}
    />
  );
}
