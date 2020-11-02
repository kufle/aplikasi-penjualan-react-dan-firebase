import React, { useEffect, useState } from 'react';
import {Prompt} from 'react-router-dom';

//import material
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TypoGraphy from '@material-ui/core/Typography';
import UploadIcon from '@material-ui/icons/CloudUpload';
import SaveIcon from '@material-ui/icons/Save';

//import firebase
import {useFirebase} from '../../../components/FirebaseProvider';
import {useDocument} from 'react-firebase-hooks/firestore';

import AppPageLoading from '../../../components/AppPageLoading'
import { useSnackbar } from 'notistack';
import useStyles from './styles/edit';

function EditProduk({match}){

    const classes = useStyles();

    const {firestore, storage, user} = useFirebase();

    const produkDoc = firestore.doc(`toko/${user.uid}/produk/${match.params.produkId}`);

    const produkStorageRef = storage.ref(`toko/${user.uid}/produk/`)

    const [snapshot, loading] = useDocument(produkDoc);

    const [isSubmitting, setSubmitting] = useState(false);

    const [isSomethingChange, setIsSomethingChange] = useState(false);

    const {enqueueSnackbar} = useSnackbar();

    const [form,setForm] = useState({
        nama: '',
        sku: '',
        harga: 0,
        stok: 0,
        deskripsi: ''
    })

    const [error, setError] = useState({
        nama: '',
        sku: '',
        harga: '',
        stok: '',
        deskripsi: ''
    })

    useEffect(()=>{
        if(snapshot){
            setForm( currentForm => ({
                ...currentForm,
                ...snapshot.data()
            }));
        }
    },[snapshot]);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        })
        setError({
            ...error,
            [e.target.name]: ''
        })

        setIsSomethingChange(true);
    } 

    const validate = () => {
        const newError = {...error};

        if(!form.nama){
            newError.nama = 'Nama Produk wajib diisi';
        }

        if(!form.harga) {
            newError.harga = 'Harga Produk wajib diisi';
        }

        if(!form.stok) {
            newError.stok = 'Stok Produk wajib diisi';
        }

        return newError;
    }

    const handleSubmit = async e => {
        e.preventDefault();
        const findErrors = validate();

        if(Object.values(findErrors).some(err => err !== '')){
            setError(findErrors);
        }else {
            setSubmitting(true);
            try {
                await produkDoc.set(form,{merge: true});
                enqueueSnackbar('Data produk berhasil ditambahkan',{variant: 'success'});
                setIsSomethingChange(false);
            }catch(e){
                enqueueSnackbar(e.message,{variant: 'error'});
            }
            setSubmitting(false);
        }
    }

    const handleUploadFile = async (e) => {
        console.log('masuk')
        const file = e.target.files[0];

        if(!['image/png','image/jpeg'].includes(file.type)){
            setError(error =>({
                ...error,
                foto: `Tipe File tidak didukung: ${file.type}`
            }))
        }else if(file.size >= 512000){
            setError(error=>({
                ...error,
                foto: 'ukuran file terlalu besar > 500KB'
            }))
        }else {
            const reader = new FileReader();

            reader.onabort = () => {
                setError(error=>({
                    ...error,
                    foto: 'Proses pembacaan file dibatalkan'
                }))
            }

            reader.onerror = () => {
                setError(error=>({
                    ...error,
                    foto: 'File tidak bisa dibaca'
                }))
            }

            reader.onload = async () => {
                setError(error=>({
                    ...error,
                    foto: ''
                }))
                setSubmitting(true);
                try{
                    const fotoExtension = file.name.substring(file.name.lastIndexOf('.'));
                    
                    const fotoRef = produkStorageRef.child(`${match.params.produkId}${fotoExtension}`);

                    const fotoSnapshot = await fotoRef.putString(reader.result,'data_url');

                    const fotoUrl = await fotoSnapshot.ref.getDownloadURL();

                    setForm(currentForm => ({
                        ...currentForm,
                        foto: fotoUrl
                    }))

                    setIsSomethingChange(true);
                }catch(e){
                    setError(error=>({
                        ...error,
                        foto: e.message
                    }))
                }

                setSubmitting(false);
            }

            reader.readAsDataURL(file);
        }
    }

    if(loading){
        return <AppPageLoading/>
    }

    return <div>
        <TypoGraphy variant="h5" component="h1">Edit Produk : {form.nama}</TypoGraphy>
        <Grid container alignItems="center" justify="center">
            <Grid item xs={12} sm={6}>
                <form id="form-produk" onSubmit={handleSubmit} noValidate>
                    <TextField 
                        name="nama"
                        id="nama"
                        label="Nama Produk"
                        value={form.nama}
                        onChange={handleChange}
                        error={error.nama?true:false}
                        helperText={error.nama}
                        margin="normal"
                        fullWidth
                        required
                        disabled={isSubmitting}
                    />
                    <TextField 
                        name="sku"
                        id="sku"
                        label="SKU Produk"
                        value={form.sku}
                        onChange={handleChange}
                        error={error.sku?true:false}
                        helperText={error.sku}
                        margin="normal"
                        fullWidth
                        disabled={isSubmitting}
                    />
                    <TextField 
                        name="harga"
                        id="harga"
                        label="Harga Produk"
                        type="number"
                        value={form.harga}
                        onChange={handleChange}
                        error={error.harga?true:false}
                        helperText={error.harga}
                        margin="normal"
                        fullWidth
                        required
                        disabled={isSubmitting}
                    />
                    <TextField 
                        name="stok"
                        id="stok"
                        label="Stok Produk"
                        type="number"
                        value={form.stok}
                        onChange={handleChange}
                        error={error.stok?true:false}
                        helperText={error.stok}
                        margin="normal"
                        fullWidth
                        required
                        disabled={isSubmitting}
                    />
                    <TextField 
                        name="deskripsi"
                        id="deskripsi"
                        label="Deskripsi Produk"
                        value={form.deskripsi}
                        multiline
                        rowsMax={3}
                        onChange={handleChange}
                        error={error.deskripsi?true:false}
                        helperText={error.deskripsi}
                        margin="normal"
                        fullWidth
                        disabled={isSubmitting}
                    />
                </form>
            </Grid>
            <Grid item xs={12} sm={6}>
                <div className={classes.uploadFotoProduk}>
                    {form.foto && <img src={form.foto} alt={form.nama} /> }
                    <input className={classes.hideInputfile} type="file" id="upload-foto-produk" onChange={handleUploadFile} accept="image/jpg,image/png" />
                    <label htmlFor="upload-foto-produk">
                        <Button variant="outlined" component="span">Upload Foto<UploadIcon className={classes.iconRight}/></Button>
                    </label>
                    {error.foto && <TypoGraphy color="error">{error.foto}</TypoGraphy>}
                </div>
            </Grid>
            <Grid item xs={12}>
                <div className={classes.actionButton}>
                    <Button 
                        form="form-produk"
                        type="submit"
                        color="primary" 
                        variant="contained"
                        disabled={isSubmitting || !isSomethingChange}
                        ><SaveIcon className={classes.iconLeft}/>
                        Simpan 
                    </Button>
                </div>
            </Grid>
        </Grid>
        <Prompt 
            when={isSomethingChange}
            message="Terdapat perubahan yang belum disimpan, apakah anda yakin akan menginggalkan halaman ini ?"
        />
    </div>
}

export default EditProduk;