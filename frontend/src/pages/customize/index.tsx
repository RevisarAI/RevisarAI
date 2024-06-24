import { Grid, Typography, TextField, Box } from '@mui/material';
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
        <Grid md={8} spacing={5} sx={{ paddingTop: '3vh', height: '60vh' }} direction="column">
          <Box sx={{ backgroundColor: 'white', borderRadius: '1vh', height: '60vh', borderStyle: 'ridge', borderColor: '#c4c4c4' }}>
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
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default CustomizePage;
