import { useAuth } from "@/utils/auth-context";
import { Grid, Typography } from "@mui/material";

const HomePage: React.FC = () => {
    const auth = useAuth();

    return (<>
        <Grid container rowSpacing={2}>
            <Grid item>
                <Typography variant="h6" sx={{fontWeight: 'regular'}}>
                    Welcome back, {auth.user?.fullName.split(' ')[0]}
                </Typography>
            </Grid>
        </Grid>
    </>);
}

export default HomePage;