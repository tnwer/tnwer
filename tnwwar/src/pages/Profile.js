// Profile.js
import React from 'react';
import Aside from '../components/a-sideBar/Aside';
import useTabNavigation from '../hooks/useTabNavigation';
import Header from '../components/header/header';


function Profile() {
  const { activeTab, handleTabChange } = useTabNavigation();

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-sm-2">
          <Aside activeTab={activeTab} handleTabChange={handleTabChange} />
        </div>
        <div className="col-sm-10">
          <Header />
          <div className="content">
            Hello From Profile
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
