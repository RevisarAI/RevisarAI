import React, { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { isEmail, isEmpty } from 'validator';
import { authenticationService } from '@/services/auth-service';
import { writeTokens } from '@/utils/local-storage';
import { flushSync } from 'react-dom';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { GoogleLogin } from '@react-oauth/google';
import { IUserDetails, ILoginFormData } from 'shared-types';
import { useNavigate } from '@tanstack/react-router';
import {
  TextField,
  Grid,
  Divider,
  Button,
  Typography,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useAuth } from '@/utils/auth-context';

const validateEmail = (email: string) => !isEmpty(email) && isEmail(email);

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const auth = useAuth();

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
          auth.setUser(payload);
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

  const handleGoogleSuccess = async (credential: string) => {
    try {
      setErrorOccurred(false);
      setIsLoading(true);
      const tokens = await authenticationService.googleSignIn(credential);
      writeTokens(tokens, loginForm.getFieldValue('remember'));

      flushSync(() => {
        const payload = jwtDecode<JwtPayload & IUserDetails>(tokens.accessToken, {});
        auth.setUser(payload);
      });

      navigate({ to: '/' });
    } catch {
      setErrorOccurred(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    console.error('google login failed');
    setErrorOccurred(true);
  };

  const openRegisterPage = () => {
    navigate({ to: '/register' });
  };

  return (
    <Grid container direction="column" justifyContent="center" spacing={3}>
      <Grid item>
        <svg width="63" height="60" viewBox="0 0 63 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M31.4536 10.1127L38.1927 23.7409L53.2336 25.9255L42.3409 36.5509L44.9182 51.5427L31.4536 44.46L17.9864 51.5427L20.5664 36.5455L9.65182 25.9309L24.7173 23.7409L31.4536 10.1127ZM31.4536 0C30.5836 0 29.9427 0.834545 29.6018 1.55182L21.0982 18.7527L2.11636 21.5127C1.17273 21.6627 0 22.1182 0 23.25C0 23.9318 0.488182 24.5727 0.943636 25.0664L14.7055 38.4491L11.4545 57.3518C11.4218 57.6191 11.3836 57.8482 11.3836 58.1127C11.3809 59.0918 11.8691 60 12.9682 60C13.4973 60 13.9882 59.8145 14.4791 59.5473L31.4536 50.6236L48.4309 59.5473C48.8836 59.8145 49.41 60 49.9391 60C51.0327 60 51.4882 59.0918 51.4882 58.1155C51.4882 57.8482 51.4882 57.6191 51.4527 57.3545L48.2018 38.4518L61.9255 25.0691C62.4191 24.5755 62.9045 23.9345 62.9045 23.2527C62.9045 22.1182 61.6909 21.6627 60.7909 21.5155L41.8118 18.7555L33.3027 1.55182C32.9645 0.834545 32.3236 0 31.4536 0Z"
            fill="#294274"
          />
        </svg>
      </Grid>
      <Grid item>
        <Typography variant="h4" textAlign="left">
          Log in
          <Typography variant="body1" style={{ opacity: '0.5' }} textAlign="left">
            Start growing your business
          </Typography>
        </Typography>
      </Grid>
      <Grid item container direction="row" justifyContent="center">
        <Grid item md={6}>
          <GoogleLogin
            onSuccess={({ credential }) => handleGoogleSuccess(credential!)}
            onError={handleGoogleError}
            shape="circle"
            useOneTap={true}
          />
        </Grid>
      </Grid>
      <Grid item>
        <Divider>
          <Typography variant="body2" style={{ opacity: '0.5' }}>
            or Sign in with Email
          </Typography>
        </Divider>
      </Grid>
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
                    defaultChecked={field.state.value}
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
      </Grid>
      <Grid item>
        <Button fullWidth variant="contained" disabled={isLoading} color="primary" style={{ borderRadius: '5vh' }}>
          {isLoading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            <Typography variant="button" style={{ textTransform: 'none' }}>
              Log in
            </Typography>
          )}
        </Button>
      </Grid>
      <Grid item>
        <Typography display="block" variant="body1">
          Not registered yet?{' '}
          <a
            href=""
            onClick={(e) => {
              e.preventDefault();
              openRegisterPage();
            }}
          >
            Create an account
          </a>
        </Typography>
      </Grid>
      {errorOccurred && (
        <Grid item>
          <Alert severity="error">Wrong email or password</Alert>
        </Grid>
      )}
    </Grid>
  );
};

export default LoginPage;
