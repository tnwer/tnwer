import React, { useState, useEffect } from 'react';
import Aside from '../components/a-sideBar/Aside';
import useTabNavigation from '../hooks/useTabNavigation';
import Header from "../components/header/header"
import RightAside from '../components/Right-aside/RightAside';
import CartItems from '../components/Cart/CartItems';



function HomeScreen() {
  const { activeTab, handleTabChange } = useTabNavigation();

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-sm-2">
          <Aside activeTab={activeTab} handleTabChange={handleTabChange} />
        </div>
        <div className="col-sm-8">
          <Header />
          <h3 style={{ color: "#009393" }}>Your Cart</h3>
         <CartItems />
        </div>
        <div className="col-sm-2">
          <RightAside />
        </div>
      </div>
    </div>
  );
}

export default HomeScreen;
