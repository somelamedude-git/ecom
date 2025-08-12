import React, { useMemo } from 'react';
import { Heart, Star, Users, Sparkles, ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify'; //here
import '../styles/AboutPage.css';
import clique_experience from '../assets/clique_experience.jpg';
import clique_team from '../assets/clique_team.png';
import bouqtique from '../assets/bouqtique.png';

function AboutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const safenav = (path) => {
    if (typeof path === 'string') {
      try {
        navigate(path);
      } catch (err) {
        toast.error('Navigation error occurred. Please try again.'); //here
        console.error('Navigation error:', err);
      }
    } else {
      toast.error('Invalid navigation path.'); //here
    }
  };

  const currentPath = useMemo(() => {
    const p = location.pathname === '/' ? 'home' : location.pathname.slice(1);
    return p || 'home';
  }, [location.pathname]);

  const values = [
    { icon: Heart, title: 'Passion for Style', 
      description: 'Every piece we create comes from a deep love for fashion and an understanding of individual expression.' },
    { icon: Star, title: 'Premium Quality', 
      description: 'We source the finest materials and work with skilled artisans to ensure every garment meets our exacting standards.' },
    { icon: Users, title: 'Community First', 
      description: 'Our customers are at the heart of everything we do. Your style journey is our inspiration.' },
    { icon: Sparkles, title: 'Innovation', 
      description: 'We constantly push boundaries, blending timeless elegance with contemporary trends.' },
  ];

  const milestones = [
    { year:'2023', event: 'CLIQUE was founded with a vision to democratize high fashion' },
    { year: '2024', event: 'Introduced sustainable fashion initiatives and launched our first collection, gaining recognition in fashion circles' },
    { year: '2025', event: 'Expanded globally, reaching customers in over 25 countries' },
  ];

  return (
    <div className="about-container">


      <div className="main-content">
        <button className="backb" onClick={() => safenav('/')}>
          <ArrowLeft size={20} />
          Back to Home
        </button>
      </div>

      <section className="herosec">
        <div className="heroin">
          <div className="badge">Our Story</div>
          <h1 className="herotitle">
            Fashion is our <span className="herotitleacc">Language</span>
          </h1>
          <p className="herosubtit">
            CLIQUE was born from a simple belief: everyone deserves to express their unique style with confidence. 
            We're not just a fashion brand – we're a movement that celebrates individuality and empowers self-expression.
          </p>
        </div>
      </section>

      <section className="sec">
        <div className="secin">
          <div className="secgrid">
            <div>
              <h2 className="sectitle">Where Dreams Meet Design</h2>
              <p className="sectext">It all started in a small studio in 2023, where our founders shared a vision of making high-quality, trend-setting fashion accessible to everyone.</p>
              <p className="sectext">
                From those humble beginnings, CLIQUE has grown into a global fashion destination, but our core values remain unchanged: quality, creativity, and inclusivity.
              </p>
              <button className="primb" onClick={() => safenav('/products')}>Explore Our Collections</button>
            </div>
            {clique_experience ? (
                <img src={clique_experience} alt="Design process at CLIQUE" className="image" />
              ) : (
                <p className="sectext">Image not available</p>
              )}
          </div>
        </div>
      </section>

      <section className="valssec">
        <div className="secin">
          <h2 className="sectitle">What Drives Us</h2>
          <div className="valsgrid">
            {values && values.length > 0 ? (
              values.map((v, i) => (
                <div key={i} className="valcard">
                  <div className="valicon"><v.icon size={24} /></div>
                  <h3 className="valtitle">{v.title}</h3>
                  <p className="valdesc">{v.description}</p>
                </div>
              ))):<p className="sectext">No values to display.</p>}
          </div>
        </div>
      </section>

      <section className="tlsec">
        <div className="tlcontainer">
          <h2 className="sectitle">Our Journey</h2>
          {milestones && milestones.length > 0 ? (
            milestones.map((m, i) => (
              <div key={i} className="tlitem">
                <div className="tlicon">{m.year.slice(-2)}</div>
                <div className="tlcontent">
                  <h3 className="tlyr">{m.year}</h3>
                  <p className="tlevent">{m.event}</p>
                </div>
              </div>
          ))):<p className="sectext">Timeline data unavailable.</p>}
        </div>
      </section>

      <section className="valsec">
        <div className="secin">
          <div className="secgrid">
            <div>
              {clique_team ? (
                <img src={clique_team} alt="CLIQUE team" className="image" />
              ) : (
                <p className="sectext">Image not available</p>
              )}
            </div>
            <div>
              <h2 className="sectitle">Meet the Visionaries</h2>
              <p className="sectext">Our team brings together decades of experience in fashion design, retail, and technology.</p>
              <p className="sectext">From our creative directors to our customer service team, each member plays a vital role.</p>
              <button onClick={() => safenav('/work-with-us')} className="secb">Join Our Team</button>
            </div>
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="secin">
          <div className="secgrid">
            <div>
              <h2 className="sectitle">The CLIQUE Experience</h2>
              <p className="sectext">Shopping with CLIQUE is more than just... </p>
              <button className="primb" onClick={() => safenav('/products')}>Start Shopping</button>
            </div>
            <div>
              {bouqtique ? (
                <img src={bouqtique} alt="CLIQUE boutique interior" className="image" />
              ) : (
                <p className="sectext">Image not available</p>
              )}
            </div>
          </div>
        </div>
      </section>


      <section className="ctasec">
        <h2 className="ctatitle">Ready to Make it <span className="herotitleacc">Worth the While?</span></h2>
        <div className="ctasubtit">Join thousands of fashion enthusiasts...</div>
        <div className="ctabuttons">
          <button className="primb" onClick={() => safenav('/products')}>Shop New Collection</button>
          <button className="secb" onClick={() => safenav('/work-with-us')}>Work With Us</button>
        </div>
      </section>


      <section className="contactsec">
        <div className="contactcontainer">
          <h2 className="contacttitle">Get in Touch</h2>
          <p className="contactsubtit">We’d love to hear from you</p>
          <div className="contactgrid">
            <div className="contactinfo">
              <div className="contactinfotit">Customer Support</div>
              <div className="contactitem">
                <div className="contacticon">📞</div>
                <div className="contactdetails"><span className="contactlab">Phone:</span><span className="contactval">+91 4778349067</span></div>
              </div>
//
            </div>
          </div>
        </div>
      </section>

      
    </div>
  );
}

export default AboutPage;
