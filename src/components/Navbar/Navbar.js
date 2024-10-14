import {Link} from 'react-router-dom'
import { useTranslation } from 'react-i18next';

export const Navbar = function(){
    const { i18n } = useTranslation();

    const changeLanguage = (lng) => {
        console.log(i18n)
        i18n.changeLanguage(lng);
    };

    return(
        <nav>
            <div>
                <button className='changeleng' onClick={()=>changeLanguage(i18n.language=='en'?'am':'en')}>{i18n.language=='en'?'EN':'AM'} | {i18n.language=='en'?'AM':'EN'}</button>
            </div>
            <div>
                <Link to="/"><img src={`${process.env.PUBLIC_URL}/newslogo.png`} alt="User" className='Logo' /> </Link>
            </div>
            <div>
                <img src={`${process.env.PUBLIC_URL}/notifs.png`} className='Notifs'/>
                <Link to="/User"><img src={`${process.env.PUBLIC_URL}/user2.png`} className='UserIcon'/></Link>
            </div>
        </nav>
    )
}