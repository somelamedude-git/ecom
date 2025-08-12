import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Edit, Package, Heart, Star, CreditCard, Wallet, MapPin, Plus } from 'lucide-react';
import { toast } from 'react-toastify';
import Header from './Header';
import axios from 'axios';
import '../styles/ProfilePage.css';

function ProfilePage({ loggedin, onToggleMenu, cartcount, wishlistcount }) {
  const navigate = useNavigate();
  const [user, setuser] = useState(null);
  const [cards, setcards] = useState([]);
  const [upiIds, setupiIds] = useState([]); // This as well
  const [creditpoints, setcreditpoints] = useState(0); // Will set this up later
  const [addresses, setaddresses] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [editingEnabled, setEditingEnabled] = useState(false);
  const [formData, setFormData ] = useState({
    name: '',
    email : '',
    age: '',
    style:'',
    phone_number: ''
  });

 const handleSave = async () => {
  try {
    await axios.patch('http://localhost:3000/user/editProfile', formData, {
      withCredentials: true
    });
    toast.success("Profile updated successfully!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      style: {
        background: '#111827',
        border: '1px solid #374151',
        color: '#fff',
        fontWeight: '600',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(251, 219, 36, 0.1)',
        fontSize: '16px',
      },
      progressStyle: {
        background: 'linear-gradient(135deg, #fbdb24, #ee5a24)',
      },
      icon: '✨',
    });
    setuser(prev => ({ ...prev, ...formData }));
    setEditingEnabled(false);
  } catch (err) {
    toast.error("Failed to update profile.");
    console.error(err);
  }
};

  const makeEditable = () => {
    setEditingEnabled(true);
    
    toast.success("You can edit your info now, scroll to bottom to save changes", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      style: {
        background: '#111827',
        border: '1px solid #374151',
        color: '#fff',
        fontWeight: '600',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(251, 219, 36, 0.1)',
        fontSize: '16px',
      },
      progressStyle: {
        background: 'linear-gradient(135deg, #fbdb24, #ee5a24)',
      },
      icon: '✨',
    });
  };

    const handleInputChange = (e) => {
      
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    console.log(e.target.value);
  };

useEffect(() => {
  const fetchProfile = async () => {
    try {
      const [profileRes, cwlRes] = await Promise.all([
        axios.get('http://localhost:3000/user/profile', {
          withCredentials: true,
        }),
        axios.get('http://localhost:3000/user/getCWL', {
          withCredentials: true,
        }),
      ]);

      setuser(profileRes.data.user);
      setaddresses(profileRes.data.addresses);
      
      setWishlistCount(cwlRes.data.wish_length);
      setOrdersCount(cwlRes.data.orderHistory_length);
    } catch (error) {
      console.error(error);
    }
  };

  fetchProfile();
}, []);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const mockUser = {
  //         name: 'Ada Lovelace',
  //         joinYear: '2022',
  //         ordersCount: 8,
  //         wishlistcount: 5,
  //         email: 'ada.lovelace@example.com',
  //         phone: '+91 7814345388',
  //         stylePref: 'Cyberpunk',
  //         username: 'lovelace42',
  //         age: 29,
  //       };

  //       setuser(mockUser);
  //       setcreditpoints(420);
  //       setcards([
  //         { number: '**** **** **** 1234', expiry: '12/26' },
  //         { number: '**** **** **** 5678', expiry: '11/25' },
  //       ]);
  //       setupiIds([
  //         { id: 'ada@ybl' },
  //         { id: 'lovelace@upi' },
  //       ]);
  //       setaddresses([
  //         { label: 'Home', address: '42 Binary Street' },
  //         { label: 'Work', address: '101 Code City' },
  //       ]);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  //   fetchData();
  // }, []);

  const adding = (setter, item) =>
    setter(prev => [...prev, item]);

  const nav = (path) => typeof path === 'string' && navigate(path);

  if (!user) return <div className="loading">Loading profile…</div>;

  return (
    <div className="profile-container">
      <div className="profile-main">
        <button className="backb" onClick={() => nav('/')}>
          <ArrowLeft size={20} /> Back to Home
        </button>

        <div className="profileheader">
          <div className="profileinfo">
            <div className="avatar"><User size={48} /></div>
            <div>
              <h1 className="profilename"><input type='text' defaultValue={user.name} className='editableBox' readOnly={!editingEnabled}
              name='name' onChange={handleInputChange}
              /></h1>
              <p className="username">@{user.username}</p> {/*shouldn't be able to be edited*/}
              <p className="membersince">Member since {user.joinYear}</p>
              <button className="editb" onClick={makeEditable}>
                <Edit size={16} /> Edit Profile
              </button>
            </div>
          </div>
        </div>

        <div className="profilestats">
          <div className="statcard" onClick={() => nav('/orders')}>
            <Package size={32} />
            <h3>{ordersCount} Orders</h3>
          </div>
          <div className="statcard" onClick={() => nav('/wishlist')}>
            <Heart size={32} />
            <h3>{wishlistCount} Wishlist Items</h3>
          </div>
          <div className="statcard">
            <Star size={32} />
            <h3>{creditpoints} Points</h3>
          </div>
        </div>

        <div className="profilesec">
          <h2>Personal Information</h2>
          <div className="infogrid">
            <div className="infoitem">
              <label>Email</label>
              <p><input type='email' className='editableBox' defaultValue={user.email} readOnly={!editingEnabled} name='email'
              onChange={handleInputChange} // validation logic to be added
              /></p>
            </div>
            <div className="infoitem">
              <label>Phone</label>
              <p><input type='tel' defaultValue={user.phone_number} className='editableBox' readOnly={!editingEnabled} name='phone_number'
              onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
              /></p>
            </div>
            <div className="infoitem">
              <label>Preferred Style</label>
              <p><input defaultValue={user.style} className='editableBox' readOnly={!editingEnabled} name='style'
              onChange={handleInputChange}
              /></p>
            </div>
            <div className="infoitem">
              <label>Age</label>
              <p>
                <input type='number' defaultValue={user.age} className='editableBox' readOnly={!editingEnabled} name='age'
                onChange={handleInputChange}
                />
              </p>
            </div>
          </div>
        </div>

        {[
          { title: 'Saved Cards', icon: CreditCard, data: cards, setter: setcards, key: 'number' },
          { title: 'Saved UPI IDs', icon: Wallet, data: upiIds, setter: setupiIds, key: 'id' },
          { title: 'Saved Addresses', icon: MapPin, data: addresses, setter: setaddresses, key: 'address' }
        ].map((section, idx) => (
          <div key={idx} className="profilesec">
            <div className="secheader">
              <h2><section.icon size={24} /> {section.title}</h2>
              <button className="addb" onClick={() => adding(section.setter, section.title === 'Saved Addresses' ? { label: 'New', address: '...' } : { [section.key]: '...' })}>
                <Plus size={16} /> Add
              </button>
            </div>
            <div className="list">
              {section.data.map((item, index) => (
                <div key={index} className="listitem">
                  <span>{item[section.key]}</span>
                  {item.expiry && <span>{item.expiry}</span>}
                </div>
              ))}
            </div>
          </div>
        ))}

        {editingEnabled && (
          <div className="save-section">
            <button className="saveb" onClick={handleSave}>
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;