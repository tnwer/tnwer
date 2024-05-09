import React, { useState, useEffect } from 'react';
import Aside from '../components/a-sideBar/Aside';
import useTabNavigation from '../hooks/useTabNavigation';
import Header from "../components/header/header"
import ProductCarousel from '../components/Home/ProductCarousel';
import Offertab from '../components/Home/Offertab';
import RightAside from '../components/Right-aside/RightAside';



function HomeScreen() {
  const { activeTab, handleTabChange } = useTabNavigation();
  const [products, setProducts] = useState([]);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-sm-2">
          <Aside activeTab={activeTab} handleTabChange={handleTabChange} />
        </div>
        <div className="col-sm-8">
          <Header />
          <h3 style={{ color: "#009393" }}>Explore Popular Categories</h3>
          <ProductCarousel products={products} />
          <h3 style={{ color: "#009393" }}>Hot Offer</h3>
          <Offertab />
        </div>
        <div className="col-sm-2">
          <RightAside />
        </div>
      </div>
    </div>
  );
}

export default HomeScreen;
