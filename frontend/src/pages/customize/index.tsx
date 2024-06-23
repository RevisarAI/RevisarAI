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
      <Grid container rowSpacing={2} justifyContent="center">
        <Grid item md={12}>
          <Typography variant="h6" sx={{ fontWeight: 'regular' }}>
            Customize your recommendations and settings
          </Typography>
        </Grid>
        <Grid md={8} justifyContent="center">
          <Box sx={{backgroundColor: 'white', borderRadius: '1vh'}}>
            <Grid md={7} justifyContent="center" item>
                <customizeForm.Field
                name='businessName'
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
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default CustomizePage;
