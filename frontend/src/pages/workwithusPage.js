import React, { useState } from 'react';
import '../styles/workwithusPage.css';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

function WorkWithUsPage() {
  const navigate = useNavigate();
  const [forminfo, setforminfo] = useState({
    name: '',
    email: '',
    role: '',
    motivation: ''
  });

  const [submitted, setsubmitted] = useState(false);
  const [error, seterror] = useState(null);

  const handlechange = (e) => {
    const { name, value } = e.target;
    setforminfo((prev) => ({ ...prev, [name]: value }));
  };

  const handlesubmit = (e) => {
    e.preventDefault();
    if (Object.values(forminfo).some((field) => field.trim() === '')) {
      seterror('Please fill all fields.');
      return;
    }
    seterror(null);
    setsubmitted(true);
  };

  return (
    React.createElement("div", { className: "work-container" },
      React.createElement("div", { className: "workcontent" },
        React.createElement("button", { className: "backb", onClick: () => navigate(-1) },
          React.createElement(ArrowLeft, { size: 20 }), " ", React.createElement("span", null, "Back")
        ),
        React.createElement("h1", { className: "pagetitle" }, "Work With Us"),
        submitted
          ? React.createElement("div", { className: "successmsg" }, "Thanks for applying! We'll get back to you soon.")
          : React.createElement("form", { className: "workform", onSubmit: handlesubmit },
            React.createElement("label", null,
              "Name:",
              React.createElement("input", {
                type: "text",
                name: "name",
                value: forminfo.name,
                onChange: handlechange
              })
            ),
            React.createElement("label", null,
              "Email:",
              React.createElement("input", {
                type: "email",
                name: "email",
                value: forminfo.email,
                onChange: handlechange
              })
            ),
            React.createElement("label", null,
              "Role Interested In:",
              React.createElement("input", {
                type: "text",
                name: "role",
                value: forminfo.role,
                onChange: handlechange
              })
            ),
            React.createElement("label", null,
              "Why do you want to work with us?",
              React.createElement("textarea", {
                name: "motivation",
                rows: "4",
                value: forminfo.motivation,
                onChange: handlechange
              })
            ),
            error && React.createElement("div", { className: "formerror" }, error),
            React.createElement("button", { type: "submit", className: "submitb" }, "Submit")
          )
      )
    )
  );
}

export default WorkWithUsPage;