import { Card, Grid, Typography } from "@mui/material";

const CustomizePage: React.FC = () => {

    return (<>
        <Grid container rowSpacing={2}>
            <Grid item md={12}>
                <Typography variant="h6" sx={{fontWeight: 'regular'}}>
                    Customize your recommendations and settings
                </Typography>
            </Grid>
            <Grid spacing={3} md={5} item>
                <Card>
                    asds
                </Card>
            </Grid>
        </Grid>
    </>);
}

export default CustomizePage;