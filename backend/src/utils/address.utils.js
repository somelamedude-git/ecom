const checkSimilarity = (
  predefined_address,
  address_line_one,
  address_line_two,
  landmark,
  city,
  state,
  country,
  pincode
) => {
  return (
    predefined_address.pincode === pincode &&
    predefined_address.landmark === landmark &&
    predefined_address.country === country &&
    predefined_address.address_line_one === address_line_one &&
    predefined_address.address_line_two === address_line_two &&
    predefined_address.state === state &&
    predefined_address.city === city
  );
};