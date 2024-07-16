import React, { useState } from "react";
import ProfileInfo from "../Cards/ProfileInfo";
import { useNavigate } from "react-router-dom";
import SearchBar from "../SearchBar/SearchBar";

const Navbar = ({userInfo, onSearchNote, handleClearSearch}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const onLogOut = () => {
    localStorage.clear();
    console.log("loggedout");
    navigate("/login");
  };

  const handleSearch = () => {
    if (searchQuery) {
      onSearchNote(searchQuery)
    }

  }
  const onClearSearch = () => {
    setSearchQuery("")
    handleClearSearch()
  }


  return (
    <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow">
      <h2 className="text-3xl font-medium text-black py-2">Notes</h2>
      {userInfo ? (<SearchBar
        value={searchQuery}
        onChange={({target}) => {setSearchQuery(target.value), handleSearch()}}
        handleSearch={handleSearch}
        onClearSearch={onClearSearch}
      />) : (<div></div>)}

      {userInfo ? (<ProfileInfo userInfo={userInfo} onLogOut={onLogOut} />) : (<div></div>)}
    </div>
  );
};

export default Navbar;
