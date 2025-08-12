import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import { Instagram, Twitter, Smartphone, Play } from 'lucide-react';
import '../styles/FooterSection.css'
import axios from 'axios';

function FooterSection() {
  const navigate= useNavigate();
  const [loggedin, setLoggedin] = useState(false);
  const safenav= (path)=>{
    if (typeof path=== 'string') {
      try {
        navigate(path);
      } catch (e) {
        console.error('Footer navigation error:', e);
      }
    } else {
      console.warn('Invalid navigation path:', path);
    }
  };

    useEffect(()=>{
      const fetchData = async()=>{
        try{
          const res_login_status = await axios.get('http://localhost:3000/user/verifyLogin',{
            withCredentials: true
          });
          setLoggedin(res_login_status.data.isLoggedIn);
          if(loggedin) console.log('logged in');
          if(!loggedin) console.log('not logged in')
        }catch(error){
          console.log(error);
          setLoggedin(false);
        }
      };
  
      fetchData();
    }, [])
//mc compile
  const footerData= [
    {
      title: 'WHO ARE WE',
      links: [
        { label: 'About Us', path: '/about' },
        { label: 'Careers', path: '/careers' },
        { label: 'Press', path: '/press' },
      ],
    },
    {
      title: 'HELP',
      links: [
        { label: 'Shipping & Return Policy', path: '/shipping' },
        { label: 'Get in Touch', path: '/contact' },
        { label: 'Terms & Conditions', path: '/terms' },
        { label: 'Privacy Policy', path: '/privacy' },
      ],
    },
    {
      title: 'QUICKLINKS',
      links: [
        { label: 'Offers', path: '/offers' },
        { label: 'Sitemap', path: '/sitemap' },
        { label: 'Style Files', path: '/style-files' },
      ],
    },
  ];

  return (
    <footer className="footer">
      <div className="topSection">
        <div className="topContent">
          <div className="downloadSection">
            <h3 className="downloadTitle">DOWNLOAD THE APP</h3>
            <div className="appButtons">
              <button
                onClick={() => window.open('https://play.google.com/store', '_blank', 'noopener noreferrer')}
                className="appButton google-play"
                aria-label="Download from Google Play"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 20px',
                  background: 'linear-gradient(135deg, #4285f4, #34a853)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 4px 12px rgba(66, 133, 244, 0.3)',
                  fontFamily: 'inherit',
                  minWidth: '180px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 20px rgba(66, 133, 244, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 12px rgba(66, 133, 244, 0.3)';
                }}
              >
                <div style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  padding: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Play size={20} fill="#ffffff" />
                </div>
                <div className="appButtonText" style={{
                  display: 'flex',
                  flexDirection: 'column',
                  textAlign: 'left'
                }}>
                  <span style={{
                    fontSize: '11px',
                    opacity: '0.9',
                    fontWeight: '400',
                    letterSpacing: '0.5px'
                  }}>GET IT ON</span>
                  <span style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    lineHeight: '1.2'
                  }}>Google Play</span>
                </div>
              </button>
              
              <button
                onClick={() => window.open('https://apps.apple.com', '_blank', 'noopener noreferrer')}
                className="appButton app-store"
                aria-label="Download from App Store"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 20px',
                  background: 'linear-gradient(135deg, #000000, #333333)',
                  color: '#ffffff',
                  border: '1px solid #444444',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
                  fontFamily: 'inherit',
                  minWidth: '180px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.5)';
                  e.target.style.background = 'linear-gradient(135deg, #1a1a1a, #404040)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.4)';
                  e.target.style.background = 'linear-gradient(135deg, #000000, #333333)';
                }}
              >
                <div style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  padding: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Smartphone size={20} />
                </div>
                <div className="appButtonText" style={{
                  display: 'flex',
                  flexDirection: 'column',
                  textAlign: 'left'
                }}>
                  <span style={{
                    fontSize: '11px',
                    opacity: '0.9',
                    fontWeight: '400',
                    letterSpacing: '0.5px'
                  }}>Download on the</span>
                  <span style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    lineHeight: '1.2'
                  }}>App Store</span>
                </div>
              </button>
            </div>
          </div>

          <div className="helpSection">
            <h3 className="helpTitle">FOR ANY HELP, CALL US AT</h3>
            <div className="helpPhone">+91 4778349067</div>
            <div className="helpHours">
              (Mon to Sat: 10am to 10pm, Sun: 10am to 7pm)
            </div>
          </div>
        </div>
      </div>

      <div className="mainFooter">
        <div className="footerGrid">
          {footerData.map((col)=>(
            <div key={col.title} className="footerColumn">
              <h4 className="columnTitle">{col.title}</h4>
              <div className="columnLinks">
                {col.links.map((lnk)=>(
                  <button
                    key={lnk.path}
                    className={`footerLink ${
                      lnk.label=== 'Get in Touch' ? 'contactHighlight' : ''
                    }`}
                    onClick={()=>safenav(lnk.path)}
                  >
                    {lnk.label}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="footerColumn">
            <h4 className="columnTitle">FOLLOW US</h4>
            <div className="socialLinks">
              <button
                onClick={()=>
                  window.open('https://instagram.com', '_blank', 'noopener noreferrer')
                }
                className="socialIcon"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </button>
              <button
                onClick={()=>
                  window.open('https://twitter.com', '_blank', 'noopener noreferrer')
                }
                className="socialIcon"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="bottomSection">
          <div className="footerNote">
            © 2025 CLIQUE Fashion. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}

export default FooterSection;