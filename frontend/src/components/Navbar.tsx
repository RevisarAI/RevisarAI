import { Avatar, List, ListItem, ListItemText, ListItemButton, ListItemIcon } from '@mui/material';
import React from 'react';
import HomeIcon from '@mui/icons-material/Home';
import MenuIcon from '@mui/icons-material/Menu';
import SettingsIcon from '@mui/icons-material/Settings';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useAuth } from '@/utils/auth-context';
import { useNavigate } from '@tanstack/react-router';
import { clearTokens } from '@/utils/local-storage';
import { authenticationService } from '@/services/auth-service';
import LogoSVG from '@/assets/Logo.svg';

interface IMenuItem {
    text: string,
    icon: React.ReactNode,
    link: string,
}

const navbarItems: Array<IMenuItem> = [{text: 'Home', icon: <HomeIcon/>, link: '/home'},
                                       {text: 'Reviews', icon: <MenuIcon/>, link: '/reviews'},
                                       {text: 'Settings', icon: <SettingsIcon/>, link: '/settings'}];

const Navbar: React.FC = () => {
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const auth = useAuth(); 
    const navigate = useNavigate();

    const handleRedirect = (
        e: React.MouseEvent<HTMLDivElement, MouseEvent>,
        index: number) => {
            setSelectedIndex(index);
            navigate({ to: navbarItems[index].link || '/' });
      };
    
      const hanleLogout = async () => {
        await authenticationService.logout(sessionStorage.getItem('refreshToken')!);
        clearTokens();
        auth.setUser(null);
        navigate({ to: "/login", search: { redirect: '/' } });
      };

    return (<>
    <List sx={{ backgroundColor: '#F4F3FA', height: '100%', width: '100%'}}>
        <ListItem>
            <ListItemIcon>
                <img src={LogoSVG}/>
            </ListItemIcon>
            <ListItemText primary="RevisarAI" primaryTypographyProps={{ fontWeight: '450'}}/>
        </ListItem>
        {navbarItems.map((item, i) => (
            <ListItem key={item.text}>
                <ListItemButton
                    selected={selectedIndex === i}
                    onClick={(e) => handleRedirect(e, i)}
                    sx={{borderRadius: '10vh',
                        "&.Mui-selected": {
                        backgroundColor: "#DCE2F9"
                    }}}>
                <ListItemIcon>
                    {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
                </ListItemButton>
            </ListItem>
        ))}
        <List sx={{ bottom: "0", position: "absolute", marginBottom: "2vh", width: '100%' }}>
            <ListItem >
                <ListItemButton
                sx={{ borderRadius: '10vh',
                    "&.Mui-selected": {
                    backgroundColor: "#DCE2F9"
                }}}
                onClick={hanleLogout}
                >
                    <ListItemIcon>
                        <ExitToAppIcon/>
                    </ListItemIcon>
                    <ListItemText primary="Log Out"/>
                </ListItemButton>
            </ListItem>
            <ListItem>
            <ListItemIcon>
                <Avatar
                alt="ProfilePic"
                src=""
                >
                    {auth.user?.fullName.split(" ").map((n)=>n[0]).join("")}
                </Avatar>
            </ListItemIcon>
            <ListItemText primary={auth.user?.fullName} secondary={auth.user?.email}/>
        </ListItem>
        </List>
        </List>
    </>
    );
};

export default Navbar;
