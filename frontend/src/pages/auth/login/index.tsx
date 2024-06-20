import React, { useState } from 'react';
import { useForm, FieldInfo } from '@tanstack/react-form';
import { isEmail, isEmpty } from 'validator';
import { authenticationService } from '@/services/auth-service';
import { writeTokens } from '@/utils/local-storage';
import { flushSync } from 'react-dom';
import { JwtPayload } from 'jwt-decode';
import { IUserDetails, ILoginFormData } from 'shared-types';
import { useNavigate } from '@tanstack/react-router';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const validateEmail = (email: string) => !isEmpty(email) && isEmail(email);

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const [errorOccurred, setErrorOccurred] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const loginForm = useForm<ILoginFormData>({
    defaultValues: {
      email: '',
      password: '',
      remember: true,
    },
    onSubmit: async ({ value }) => {
      try {
        setErrorOccurred(false);
        setIsLoading(true);
        const { email, password, remember } = value;
        const tokens = await authenticationService.login(email, password);

        writeTokens(tokens, remember);

        flushSync(() => {
          const payload = jwtDecode<JwtPayload & IUserDetails>(tokens.accessToken, {});
          // TODO: set user in global auth context
          // auth.setUser(payload);
        });

        navigate({ to: '/' });
      } catch {
        setErrorOccurred(true);
      } finally {
        setIsLoading(false);
      }
    },
    validators: {
      onSubmit({ value }) {
        const requiredFields = ['email', 'password'] as Array<keyof typeof value>;
        if (!validateEmail(value.email) || requiredFields.some((field) => isEmpty(value[field].toString())))
          return 'Missing or invalid values';
      },
    },
  });

  const openRegisterPage = () => {
    // navigate({ to: '/register' });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void loginForm.handleSubmit();
      }}
    >
      <Grid container direction="column" justifyContent="center" alignItems="stretch" spacing={3}>
        <Grid item>
          <loginForm.Field
            name="email"
            children={(field) => (
              <TextField
                fullWidth
                id="email-input"
                label="Email"
                type="email"
                variant="outlined"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            )}
          />
        </Grid>
        <Grid item>
          <loginForm.Field
            name="password"
            children={(field) => (
              <TextField
                fullWidth
                id="password-input"
                label="Password"
                type="password"
                variant="outlined"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            )}
          />
        </Grid>
        <Grid item container direction="row" marginTop="-2vh" justifyContent="space-between" alignItems="center">
          <Grid item xs>
            <loginForm.Field
              name="remember"
              children={(field) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.checked)}
                    />
                  }
                  label="Remember me"
                />
              )}
            />
          </Grid>
          <Grid item xs textAlign="end">
            <Typography display="block" color="primary">
              <a href="">Forgot Password?</a>
            </Typography>
          </Grid>
        </Grid>
        <Grid item>
          <Button fullWidth variant="contained" color="primary" style={{ borderRadius: '5vh' }}>
            Log in
          </Button>
        </Grid>
        <Grid item>
          <Typography display="block" variant="body1">
            Not registered yet?{' '}
            <a href="" onClick={openRegisterPage}>
              Create an account
            </a>
          </Typography>
        </Grid>
      </Grid>
    </form>
  );
};

export default LoginPage;
