import { Drawer, List, ListItem, ListItemText, ListItemButton, ListItemIcon } from '@mui/material';
import React from 'react';
import HomeIcon from '@mui/icons-material/Home';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import SettingsIcon from '@mui/icons-material/Settings';

interface IMenuItem {
    text: string,
    icon: React.ReactNode,
    link: string,
}

const navbarItems: Array<IMenuItem> = [{text: 'Home', icon: <HomeIcon/>, link: ''},
                                       {text: 'Reviews', icon: <MenuIcon/>, link: ''},
                                       {text: 'Alerts', icon: <NotificationsActiveIcon/>, link: ''},
                                       {text: 'Settings', icon: <SettingsIcon/>, link: ''}];

const Navbar: React.FC = () => {
    const [selectedIndex, setSelectedIndex] = React.useState(0);

    const handleListItemClick = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        index: number) => {
        setSelectedIndex(index);
      };

    return (<>
    <List sx={{ backgroundColor: '#F4F3FA', height: '100%', width: '100%'}}>
        <ListItem>
        <ListItemIcon>
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="24" cy="24" r="24" fill="#465D91"/>
                <path d="M24.0006 14.9945L27.0003 21.0515L33.6953 22.0224L28.8467 26.7448L29.9939 33.4079L24.0006 30.26L18.0061 33.4079L19.1545 26.7424L14.2962 22.0248L21.0021 21.0515L24.0006 14.9945ZM24.0006 10.5C23.6134 10.5 23.3281 10.8709 23.1763 11.1897L19.3912 18.8345L10.942 20.0612C10.522 20.1279 10 20.3303 10 20.8333C10 21.1364 10.2173 21.4212 10.42 21.6406L16.5457 27.5885L15.0986 35.9897C15.0841 36.1085 15.0671 36.2103 15.0671 36.3279C15.0659 36.763 15.2832 37.1667 15.7724 37.1667C16.0079 37.1667 16.2264 37.0842 16.4449 36.9655L24.0006 32.9994L31.5575 36.9655C31.759 37.0842 31.9933 37.1667 32.2288 37.1667C32.7156 37.1667 32.9184 36.763 32.9184 36.3291C32.9184 36.2103 32.9184 36.1085 32.9026 35.9909L31.4555 27.5897L37.5642 21.6418C37.7839 21.4224 38 21.1376 38 20.8345C38 20.3303 37.4598 20.1279 37.0592 20.0624L28.6112 18.8358L24.8237 11.1897C24.6731 10.8709 24.3879 10.5 24.0006 10.5Z" fill="white"/>
            </svg>
        </ListItemIcon>
        <ListItemText primary="RevisarAI" primaryTypographyProps={{ fontWeight: '450'}}/>
        </ListItem>
        {navbarItems.map((item, i) => (
            <ListItem key={item.text}>
                <ListItemButton
                    selected={selectedIndex === i}
                    onClick={(e) => handleListItemClick(e, i)}
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
        </List>
    </>
    );
};

export default Navbar;
