import React, { useState, useEffect } from 'react';

//import material-ui
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import useStyles from './styles/toko';

//validator
import isUrl from 'validator/lib/isURL';

//import firebase
import { useFirebase } from '../../../components/FirebaseProvider';

//snacbar
import {useSnackbar} from 'notistack';

//firebase hooks
import {useDocument} from 'react-firebase-hooks/firestore';

//loading
import AppPageLoading from '../../../components/AppPageLoading' 

//react router
import {Prompt} from 'react-router-dom';


function Toko(){

    const classes = useStyles();

    const {firestore, user} = useFirebase();

    const tokoDoc = firestore.doc(`toko/${user.uid}`)

    const [snapshot, loading] = useDocument(tokoDoc);

    const {enqueueSnackbar} = useSnackbar();

    const [form,setForm] = useState({
        nama: '',
        alamat: '',
        telepon: '',
        website: ''
    })

    const [error,setError] = useState({
        nama: '',
        alamat: '',
        telepon: '',
        website: ''
    })

    const [isSubmitting,setSubmitting] = useState(false);
    const [isSomethingChange,setSomethingChange] = useState(false);

    useEffect(()=> {
        if(snapshot){
            setForm(snapshot.data());
        }
    }, [snapshot])

    const validate = () => {

        const newError = {...error};

        if(!form.nama){
            newError.nama = 'Nama wajib diisi';
        }

        if(!form.alamat) {
            newError.alamat = 'Alamat wajib diisi';
        }

        if(!form.telepon){
            newError.telepon = 'Telepon wajib diisi';
        }

        if(!form.website){
            newError.website = 'Website wajib diisi';
        }else if(!isUrl(form.website)){
            newError.website = 'Website tidak valid';
        }

        return newError;
    }

    const handleChange = e => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })

        setError({
            [e.target.name]: ''
        })

        setSomethingChange(true);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const findErrors = validate();

        if(Object.values(findErrors).some(err => err !== '')){
            setError(findErrors);
        }else {
            setSubmitting(true);
            try{
                await tokoDoc.set(form,{merge:true});
                enqueueSnackbar(`Data toko berhasil diperbarui`,{variant:'success'});
                setSomethingChange(false);
            }
            catch(e){
                enqueueSnackbar(`${e.message}`,{variant: 'error'});
            }
            setSubmitting(false);
        }
        
    }

    if(loading) {
        return <AppPageLoading />
    }

    return <div className={classes.pengaturanToko}>
        <form onSubmit={handleSubmit} noValidate>
            <TextField 
                id="nama"
                name="nama"
                label="Nama Toko"
                margin="normal"
                fullWidth
                required
                value={form.nama}
                onChange={handleChange}
                error={error.nama?true:false}
                helperText={error.nama}
                disabled={isSubmitting}
            />

            <TextField 
                id="alamat"
                name="alamat"
                label="Alamat Toko"
                margin="normal"
                fullWidth
                required
                multiline
                rowsMax={3}
                value={form.alamat}
                onChange={handleChange}
                error={error.alamat?true:false}
                helperText={error.alamat}
                disabled={isSubmitting}
            />

            <TextField 
                id="telepon"
                name="telepon"
                label="Telepon Toko"
                margin="normal"
                fullWidth
                required
                value={form.telepon}
                onChange={handleChange}
                error={error.telepon?true:false}
                helperText={error.telepon}
                disabled={isSubmitting}
            />

            <TextField 
                id="website"
                name="website"
                label="Website Toko"
                margin="normal"
                fullWidth
                required
                value={form.website}
                onChange={handleChange}
                error={error.website?true:false}
                helperText={error.website}
                disabled={isSubmitting}
            />

            <Button
                type="submit"
                className={classes.actionButton}
                variant="contained"
                color="primary"
                margin="normal"
                disabled={isSubmitting || !isSomethingChange}>
                    Simpan
            </Button>
        </form>

        <Prompt 
            when={isSomethingChange}
            message="Terdapat perubahan yang belum disimpan, apakah anda yakin akan menginggalkan halaman ini ?"
        />
    </div>
}

export default Toko;