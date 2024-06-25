import { Grid, Typography, TextField, Paper, Stack } from '@mui/material';
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
      <Grid container justifyContent={'center'} spacing={4}>
        <Grid item md={12}>
          <Typography variant="h6" sx={{ fontWeight: 'regular' }}>
            Customize your recommendations and settings
          </Typography>
        </Grid>
        <Grid item md={9}>
          <Paper
            elevation={1}
            sx={{
              backgroundColor: 'white',
              borderRadius: '1vh',
              height: '60vh',
            }}
          >
            <Stack direction={'column'} padding={8} spacing={2}>
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
                    multiline
                    rows={7}
                    helperText="Up to 200 characters"
                  />
                )}
              ></customizeForm.Field>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default CustomizePage;
