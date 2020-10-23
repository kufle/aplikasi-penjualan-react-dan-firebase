import React, { useState } from 'react';
import {Link, Redirect} from 'react-router-dom';

//import komponen material-ui
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Textfield from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

//import styles
import useStyles from './styles';

import isEmail from 'validator/lib/isEmail';

//import firebase hooks
import {useFirebase} from '../../components/FirebaseProvider';

//import loading
import AppLoading from '../../components/AppLoading';

function Login(props) {
    const { location } = props;
    const classes = useStyles();

    const [form, setForm] = useState({
        email: '',
        password: ''
    })

    const [error,setError] = useState({
        email: '',
        password: ''
    })

    const [isSubmitting,setSubmitting] = useState(false);

    const { auth, user, loading } = useFirebase();

    const handleChange = e => {
        setForm({
            ...form,
            [e.target.name]:e.target.value
        })
        setError({
            ...error,
            [e.target.name]:''
        })
    }

    const validate = () => {
        const newError = {...error};

        if(!form.email){
            newError.email = 'Email wajib diisi';
        }else if(!isEmail(form.email)){
            newError.email = 'Email tidak valid';
        }

        if(!form.password) {
            newError.password = 'Password wajib diisi';
        }

        return newError;
    }

    const handleSubmit = async e => {
        e.preventDefault();
        const findErrors = validate();

        if(Object.values(findErrors).some(err=>err!=='')){
            setError(findErrors);
        }else{
            try{
                setSubmitting(true);
                await auth.signInWithEmailAndPassword(form.email,form.password)
            }catch(e){
                 const newError = {};
                 switch(e.code){
                    case 'auth/user-not-found':
                        newError.email = 'Email belum terdaftar';
                        break;
                    case 'auth/invalid-email':
                        newError.email = 'Email tidak valid';
                        break;
                    case 'auth/wrong-password':
                        newError.password = 'Email atau Password Salah';
                        break;
                    case 'auth/user-disabled':
                        newError.email = "Pengguna Diblokir";
                        break;
                    default:
                        newError.email = 'Terjadi kesalahan silahkan coba lagi';
                        console.log(e);
                        break;
                 }

                 setError(newError);
                 setSubmitting(false);
            }
        }
    }

    if(loading){
        return <AppLoading />
    }

    if(user){
        const redirecTo = location.state && location.state.from && location.state.from.pathname ? location.state.from.pathname : '/';
        return <Redirect to={redirecTo} />
    }
    console.log(props)
    return <Container maxWidth="xs">
        <Paper className={classes.paper}>
            <Typography variant="h5" component="h1" className={classes.title}>Login</Typography>
            <form onSubmit={handleSubmit} noValidate>
                <Textfield
                    id="email"
                    type="email"
                    name="email"
                    margin="normal"
                    label="Alamat Email"
                    required
                    fullWidth
                    value={form.email}
                    onChange={handleChange}
                    helperText={error.email}
                    error = {error.email ? true : false}
                    disabled={isSubmitting}
                />
                <Textfield
                    id="password"
                    type="password"
                    name="password"
                    margin="normal"
                    label="Password"
                    required
                    fullWidth
                    value={form.password}
                    onChange={handleChange}
                    helperText={error.password}
                    error = {error.password ? true : false}
                    disabled={isSubmitting}
                />
                <Grid container className={classes.buttons}>
                    <Grid item xs>
                        <Button type="submit"
                        disabled={isSubmitting}
                        color="primary"
                        variant="contained"
                        size="large"
                        >Login</Button>
                    </Grid>
                    <Grid item>
                        <Button 
                        disabled={isSubmitting}
                        component={Link}
                        variant="contained"
                        size="large"
                        to="/registrasi"
                        >Daftar</Button>
                    </Grid>
                </Grid>

                <div className={classes.forgotPassword}>
                    <Typography component={Link} to="/lupa-password">
                        Forgot Password?
                    </Typography>
                </div>
            </form>
            
        </Paper>
    </Container> 
}

export default Login;