"use client";

import { useEffect, useState } from "react";

export default function UserProfile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      console.log(storedUser);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) {
    return <p>Not logged in</p>;
  }

  return (
    <div>
      <p>Welcome, {user.name}</p>
    </div>
  );
}