import LoginPage from '../components/login';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


export default function Login() {
  const navigate = useNavigate();
  const onLogin = async(formData)=>{
  try{
    const res = await axios.post('http://localhost:3000/user/login', formData);
    console.log(res.data);

    if(res.data.success){
      navigate('/');
    }
  }
  catch(err){
    console.log(err);
  }
}

  return (
    <div className="App">
     <LoginPage onLogin={onLogin} tosignup={()=>navigate('/signup')} tolanding={()=>navigate('/')}/>
    </div>
  );
}
