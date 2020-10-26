import React, { useRef, useState } from 'react';

//import material-ui
import TextField from '@material-ui/core/TextField';
import Buttton from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

//import firebase
import {useFirebase} from '../../../components/FirebaseProvider';

//snakbar
import {useSnackbar} from 'notistack';

//validator
import isEmail from 'validator/lib/isEmail';

//style
import useStyles from './styles/pengguna';

function Pengguna(){
    const classes = useStyles();
    const {user} = useFirebase();
    const displayNameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const [error,setError] = useState({
        displayName: '',
        email: '',
        password: ''
    })
    const {enqueueSnackbar} = useSnackbar();
    const [isSubmitting, setSubmitting] = useState(false);
    const saveDisplayname = async (e) => {
        const displayName = displayNameRef.current.value;
        console.log(displayName);

        if(!displayName){
            setError({
                displayName: 'Nama wajib diisi'
            })
        }else if(displayName!==user.displayName){
            setSubmitting(true);
            setError({
                displayName: ''
            })
            await user.updateProfile({
                displayName
            })
            setSubmitting(false);
            enqueueSnackbar('Data pengguna berhasil diperbarui',{variant: 'success'})
        }
        
    }

    const updateEmail = async (e) => {
        const email = emailRef.current.value;
        if(!email){
            setError({
                email: 'Email wajib diisi'
            })
        }else if(!isEmail(email)){
            setError({
                email: 'Email tidak valid'
            })
        }else if(email !== user.email){
            setError({
                email: ''
            })

            setSubmitting(true);
            try{
                await user.updateEmail(email);
                enqueueSnackbar('Email berhasil diperbarui',{variant: 'success'})
            }catch (e){
                let emailError = '';
                switch(e.code){
                    case 'auth/email-already-in-use':
                        emailError = 'Email sudah digunakan oleh pengguna lain';
                        break;
                    case 'auth/invalid-email':
                        emailError = 'Email tidak valid';
                        break;
                    case 'auth/requires-recent-login':
                        emailError = 'Silahkan logout terlebih dahulu kemudian login kembali untuk memperbarui email';
                        break;
                    default:
                        emailError = 'Terjadi kesalahan silahkan coba lagi';
                        break;
                }
                setError({
                    email: emailError
                })
            }
            setSubmitting(false);
        }
    }

    const sendEmailVerification = async (e) => {
        const actionCodeSettings = {
            url: `${window.location.origin}/login`
        };

        setSubmitting(true);
        await user.sendEmailVerification(actionCodeSettings);
        enqueueSnackbar(`Email verfikasi telah dikirim ke ${emailRef.current.value} `,{variant: 'success'})
        setSubmitting(false);
    }

    const updatePassword = async (e) => {
        const password = passwordRef.current.value;

        if(!password){
            setError({
                password: 'Password Wajib di isi'
            })
        }else if(password){
            setError({
                password: '',
            })
            setSubmitting(true)
            try{
                await user.updatePassword(password);
                enqueueSnackbar(`Password berhasil diperbarui`,{variant: 'success'})
            }catch(e){

                let errorPassword = '';

                switch(e.code){
                    case 'auth/weak-password':
                        errorPassword = 'Password terlalu lemah';
                        break;
                    case 'auth/requires-recent-login':
                        errorPassword = 'Silahkan logout terlebih dahulu kemudian login kembali untuk memperbarui password';
                        break;
                    default: 
                        errorPassword = 'Terjadi kesalahan silahkan dicoba kembali'
                        break;
                }

                setError({
                    password: errorPassword
                })
            }
            setSubmitting(false);
        }
    }

    return <div className={classes.pengaturanPengguna}>
        <TextField
            id="displayName"
            name="displayName"
            label="Nama"
            defaultValue={user.displayName}
            inputProps={{
                ref: displayNameRef,
                onBlur:  saveDisplayname
            }}
            disabled={isSubmitting}
            helperText={error.displayName}
            error={error.displayName? true: false}
            margin="normal"
        />
        <TextField 
            id="email"
            name="email"
            label="Email"
            type="email"
            defaultValue={user.email}
            inputProps={{
                ref: emailRef,
                onBlur: updateEmail
            }}
            disabled={isSubmitting}
            helperText={error.email}
            error={error.email?true:false}
            margin="normal"
        />
        { user.emailVerified ?
            <Typography
            variant="subtitle1"
            color="primary"
            >Email Terverifikasi</Typography>
            :
            <Buttton
            variant="outlined"
            disabled={isSubmitting}
            onClick={sendEmailVerification}
            >
                Kirim Email Verifikasi
            </Buttton>
        }

        <TextField 
            name="password"
            id="password"
            label="Password"
            type="password"
            inputProps={{
                ref: passwordRef,
                onBlur: updatePassword
            }}
            autoComplete="new-password"
            helperText={error.password}
            error={error.password?true:false}
            disabled={isSubmitting}
        />
    </div>
}

export default Pengguna;