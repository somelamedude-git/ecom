import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import '../styles/ContactPage.css'; // Fixed: removed dot before styles

function ContactPage({ loggedin, menumove, cartcount = 0, wishlistcount = 0 }) {
  const navigate = useNavigate();
  const [forminfo, setforminfo] = useState({
    firstname: '', 
    lastname: '', 
    email: '', 
    msg: ''
  });

  const changesinput = (e) => {
    setforminfo({
      ...forminfo, 
      [e.target.name]: e.target.value
    });
  };

  const submission = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/connect/mail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(forminfo)
      });
      
      if (!response.ok) throw new Error('Failed to submit form');
      
      alert('Thank you for your message! We\'ll get back to you as soon as possible within working hours.');
      setforminfo({ firstname: '', lastname: '', email: '', msg: '' });
    } catch (error) {
      console.error(error);
      alert('An error occurred while submitting.');
    }
  };

  return (
    <div className="contact-container">

      <div className="contact-main">
        <button 
          onClick={() => navigate('/')}
          className="backb"
        >
          <ArrowLeft size={20} />
          <span>Back to Home</span>
        </button>

        <div className="contacthero">
          <h1 className="contacttitle">
            Get in <span className="titleacc">Touch</span>
          </h1>
          <p className="contactsubtit">
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="contactcontent">
          <div className="contactgrid">
            <div className="contactinfo">
              <h3 className="infotitle">Contact Information</h3>
              <div className="infolist">
                <div className="infoitem">
                  <div className="infoicon">📧</div>
                  <div>
                    <p className="infolabel">Email</p>
                    <p className="infoval">blahblah@clique.com</p>
                  </div>
                </div>
                <div className="infoitem">
                  <div className="infoicon">📞</div>
                  <div>
                    <p className="infolabel">Phone</p>
                    <p className="infoval">+91 4778349067</p>
                  </div>
                </div>
              </div>
            </div>

            <form className="contactform" onSubmit={submission}>
              <div className="formrow">
                <div className="formgrp">
                  <label htmlFor="firstname">First Name *</label>
                  <input
                    type="text"
                    id="firstname"
                    name="firstname"
                    value={forminfo.firstname}
                    onChange={changesinput}
                    required
                    placeholder="First name"
                  />
                </div>
                <div className="formgrp">
                  <label htmlFor="lastname">Last Name *</label>
                  <input
                    type="text"
                    id="lastname"
                    name="lastname"
                    value={forminfo.lastname}
                    onChange={changesinput}
                    required
                    placeholder="Last name"
                  />
                </div>
              </div>

              <div className="formgrp">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={forminfo.email}
                  onChange={changesinput}
                  required
                  placeholder="email@example.com"
                />
              </div>

              <div className="formgrp">
                <label htmlFor="msg">Message *</label>
                <textarea
                  id="msg"
                  name="msg" 
                  value={forminfo.msg} 
                  onChange={changesinput}
                  required
                  rows="5"
                  placeholder="Tell us how we can help you..."
                ></textarea>
              </div>

              <button type="submit" className="submitb">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;