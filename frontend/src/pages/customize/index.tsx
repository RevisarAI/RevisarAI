import { Grid, Typography, TextField, Box, Paper } from '@mui/material';
import { useForm } from '@tanstack/react-form';
import { IBusinessDetails } from 'shared-types';

const CustomizePage: React.FC = () => {
  const customizeForm = useForm<IBusinessDetails>({
    defaultValues: {
      businessName: '',
      businessDescription: '',
    },
    onSubmit: async ({ value }) => {
      console.log(value);
    },
  });

  return (
    <>
      <Grid container justifyContent="center">
        <Grid item md={12}>
          <Typography variant="h6" sx={{ fontWeight: 'regular' }}>
            Customize your recommendations and settings
          </Typography>
        </Grid>
          <Paper
          elevation={1}
            sx={{
              backgroundColor: 'white',
              borderRadius: '1vh',
              height: '60vh',
            }}
          >
            <Grid container sx={{ height: '60vh' }} direction="column" justifyContent='center'>
              <Grid md={7} item>
                <customizeForm.Field
                  name="businessName"
                  children={(field) => (
                    <TextField
                      fullWidth
                      id="businessName-input"
                      label="Business Name"
                      type="string"
                      variant="outlined"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  )}
                ></customizeForm.Field>
              </Grid>
              <Grid md={7} item>
                <customizeForm.Field
                  name="businessDescription"
                  children={(field) => (
                    <TextField
                      fullWidth
                      id="businessDescription-input"
                      label="Business Description"
                      type="string"
                      variant="outlined"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  )}
                ></customizeForm.Field>
              </Grid>
            </Grid>
          </Paper>
      </Grid>
    </>
  );
};

export default CustomizePage;
