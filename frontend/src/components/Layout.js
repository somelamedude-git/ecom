import Header from "./Header";
import SideMenu from "./SideMenu";
import { useState, useEffect } from 'react';
import FooterSection from "./footer";

export default function Layout({children}){
    const [showMenu, setShowMenu] = useState(false);
    return(
        <>
          <Header menumove={() => setShowMenu(true)} />
      <SideMenu isopen={showMenu} onclose={() => setShowMenu(false)} />
      <main>{children}</main>
      <FooterSection/>
        </>
    )
}