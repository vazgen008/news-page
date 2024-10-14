import Axios from 'axios';
import { useEffect, useState, useContext } from 'react';
import { AppContext } from "../../App";
import './Reg.css';
import { useTranslation } from 'react-i18next';
export const FData = function() {
    const { t } = useTranslation();
    const { fetchData, User, setUser, LoginOrRegister, setLoginOrRegister } = useContext(AppContext);
    const [Name, setName] = useState('');
    const [Surname, setSurname] = useState('');
    const [Username, setUsername] = useState('');
    const [Password, setPassword] = useState('');
    const [PhoneNumber, setPhoneNumber] = useState('');
    const [isAgreed, setisAgreed] = useState(false);
    const [LogUsername, setLogUsername] = useState('');
    const [LogPassword, setLogPassword] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    let RegUser = {
        name: Name,
        surname: Surname,
        username: Username,
        posts: [],
        Verified: 'Pending',
        phoneNumber: PhoneNumber,
        password: Password,
    };

    const Add = async () => {
        try {
            const rsp = await Axios.get(`${process.env.REACT_APP_DATABASE_URL}.json`);
            const foundData = Object.values(rsp.data);

            const newUser = { ...RegUser }; // Remove the id from here

            if (Object.values(newUser).every(value => Boolean(value))) {
                const usernameExists = foundData.some(user => user.username === newUser.username);
                const phoneNumberExists = foundData.some(user => user.phoneNumber === newUser.phoneNumber);
            
                if (usernameExists) {
                    alert('Username already exists');
                } else if (phoneNumberExists) {
                    alert('Phone number already exists');
                } else if (newUser.phoneNumber.length !== 11) {
                    alert(`Phone number doesn't match requirements`);
                } else {
                    // Send the user object to Firebase
                    const response = await Axios.post(`${process.env.REACT_APP_DATABASE_URL}.json`, newUser);
                    const uniqueKey = response.data.name; // Firebase generates a unique key
            
                    // Update the user object with the unique key
                    await Axios.patch(`${process.env.REACT_APP_DATABASE_URL}/${uniqueKey}.json`, { id: uniqueKey });
            
                    await fetchData();
                    window.location.reload();
                }
            }
             else {
                alert('Please fill in all fields.');
            }
        } catch (error) {
            console.error('Error adding user:', error);
            alert('An error occurred while adding the user. Please try again.');
        }
    };

    useEffect(() => {
        const fetchDataAndCheck = async () => {
            await deleteDuplicateUsers();
            await fetchData();
        };
        fetchDataAndCheck();
    }, []);

    const deleteDuplicateUsers = async () => {
        try {
            const response = await Axios.get(`${process.env.REACT_APP_DATABASE_URL}.json`);
            const users = response.data;

            const uniqueUsers = {};
            const keysToDelete = [];

            Object.entries(users).forEach(([key, user]) => {
                if (!uniqueUsers[user.username]) {
                    uniqueUsers[user.username] = key;
                } else {
                    keysToDelete.push(key);
                }
            });

            for (const key of keysToDelete) {
                await Axios.delete(`${process.env.REACT_APP_DATABASE_URL}/${key}.json`);
            }

            console.log('Duplicates deleted, only unique users remain.');
        } catch (error) {
            console.error('Error fetching or deleting users:', error);
        }
    };

    const logIn = async (event) => {
        event.preventDefault();
        try {
            const rsp = await Axios.get(`${process.env.REACT_APP_DATABASE_URL}.json`);
            const foundData = Object.values(rsp.data);
            const LogData = foundData.find(user => user.username === LogUsername);
            if (LogData) {
                if (LogData.password === LogPassword) {
                    localStorage.setItem('islogged', JSON.stringify(LogData));
                    setUser(LogData);
                } else {
                    alert('Password is wrong');
                }
            } else {
                alert('User not found');
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000); // 2 seconds delay

        return () => clearTimeout(timer);
    }, []);
    
    if (isLoading) {
        return <div>Loading...</div>; // Loading indicator
    }

    return (
        <div className='User__info'>
            {User && (
                <div>
                    <h1>User Account Information</h1>
                    <h2>Username: {User.username}</h2>
                    <p>{User.name}</p>
                    <p>Acc Status: <span style={{color:User.Verified == 'Pending'?'orange':User.Verified=='Verified'?'Green':'red'}}>{User.Verified}</span></p>
                    <button onClick={() => { localStorage.removeItem('islogged'); setUser('') }} style={{ color: 'white', background: 'gray' }}>{t('LogOut')}</button>

                    <div className='infoAboutStatus'>
                        <p>{t('TypeOfUsers')}</p>
                        <div className='User__types'>
                            {['Pending', 'Verified', 'Rejected'].map((val) => (
                                <li key={val} style={{border:val==User.Verified?'2px solid green':'none'}}>{val}</li>
                            ))}
                        </div>
                        <p>
                           {t('UsersStatus')}
                        </p>
                        <p className="notice">
                        {t('statusWarning')}
                        </p>
                    </div>
                </div>
            )}
            {!User && (
                <div>
                    {!LoginOrRegister && (
                        <div className='Reg__form'>
                            <div>
                                <p>{t('RegNote')}</p>
                            </div>
                            Register
                            <input placeholder={t('Name')} onChange={(e) => { setName(e.target.value) }} maxLength={12} />
                            <input placeholder={t('Surname')} onChange={(e) => setSurname(e.target.value)} maxLength={12} />
                            <input placeholder={t('Username')} onChange={(e) => setUsername(e.target.value)} maxLength={15} />
                            <input placeholder='37477******' type='number' onChange={(e) => setPhoneNumber(e.target.value)} />
                            <input placeholder={t('Password')} type='password' onChange={(e) => setPassword(e.target.value)} maxLength={12} />
                            <span className='warning__password'>{t('PasswordWarning')}</span>
                            <div className='terms__conditions'>
                                <input type='checkbox' onChange={(e) => setisAgreed(!isAgreed)} />
                                <span>{t('AcceptTerms')}</span>
                            </div>
                            <button onClick={Add} disabled={!isAgreed} style={{ background: isAgreed ? '#4ba24b' : 'lightgreen' }} className='Regbtn'>{t('Register')}</button>
                            <p>Already have an account? </p>
                            <button onClick={() => setLoginOrRegister(true)} className='logbtn'>{t('LogIn')}</button>
                        </div>
                    )}
                    {LoginOrRegister && (
                        <div className='log-in'>
                            Login
                            <form>
                                <input placeholder='Username' onChange={(e) => setLogUsername(e.target.value)} maxLength={15} />
                                <input placeholder='Password' type='password' onChange={(e) => setLogPassword(e.target.value)} maxLength={15} />
                                <button className='logbtn' onClick={logIn}>{t('LogIn')}</button>
                            </form>
                            <button onClick={() => setLoginOrRegister(false)} className='Regbtn'>{t('Register')}</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
