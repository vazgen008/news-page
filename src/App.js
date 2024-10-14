import './App.css';
import { useState, createContext } from 'react';
import Axios from 'axios';
import { FData } from './components/RegisterPage/Register';
import { Navbar } from './components/Navbar/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {HomePage} from './components/HomePage/HomePage'
import Addpost from './components/Addpost/addpost'
export const AppContext = createContext();

function App() {
  const [Data, setData] = useState([]);
const [User,setUser] = useState('') 

const [LoginOrRegister,setLoginOrRegister] = useState(true)

  const TwoFactorCheck = (fetchedData) => {
    const UserLocal = JSON.parse(localStorage.getItem('islogged'));
    if (UserLocal) {
      const userFound = fetchedData.find((user) => user.id === UserLocal.id);
      if (userFound) {
        if (userFound.password === UserLocal.password) {
          // alert()
          localStorage.setItem('islogged', JSON.stringify(userFound));
          setUser(JSON.parse(localStorage.getItem('islogged')))
          setUser(userFound)
          setLoginOrRegister(true)

        } else {
          localStorage.removeItem('islogged');
          setLoginOrRegister(true)
          setUser(false)
        }
      } else {
        localStorage.removeItem('islogged');
        setLoginOrRegister(true)

        setUser(false) 
      }
    }else{
      setUser(false) 

    }
  };

  const fetchData = async () => {
    try {
      const resp = await Axios.get(`https://news-1a134-default-rtdb.firebaseio.com/.json`);
      const fetchedData = Object.values(resp.data);
      setData(fetchedData);
      TwoFactorCheck(fetchedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  return (
    <div className='App'>
      <AppContext.Provider value={{ fetchData, TwoFactorCheck, Data, setData ,User,setUser,LoginOrRegister,setLoginOrRegister}}>
        <Router>
          <Navbar />
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/User' element={<FData />} />
            {User.Verified=='Verified' && <Route path='/Addpost' element={<Addpost />} />}
            <Route path='*' element={<p>Page doesn't exist</p>} />
          </Routes>
        </Router>
      </AppContext.Provider>
    </div>
  );
}

export default App;
