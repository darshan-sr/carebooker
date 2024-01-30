"use client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const page = () => {
  const router = useRouter();
  const [user, setUser] = React.useState<any>(null);

  useEffect(() => {
    const getUser = () => {
      const user = localStorage.getItem("user");
      console.log(user);
      if (!user) {
        return router;
      }
      setUser(JSON.parse(user));
      return user;
    };

    getUser();
  }, []);

  return <div className="text-xl">{user?.email}</div>;
};

export default page;
