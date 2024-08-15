import React from "react";

const Navbar = () => {
  return (
    <>
      <div className="">
        <div className=" flex bg-orange-200 w-full justify-end list-none p-3 gap-10 pt-5">
          <li className=" hover:underline hover:text-blue-400">Login</li>
          <li>Sign up</li>
          <li>Homepage</li>
        </div>
      </div>
    </>
  );
};

export default Navbar;
