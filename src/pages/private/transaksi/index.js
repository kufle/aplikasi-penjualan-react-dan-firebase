import React, { useState,useEffect } from 'react';
//material-ui
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Grid from '@material-ui/core/Grid';
import { useFirebase } from '../../../components/FirebaseProvider';
import {useCollection} from 'react-firebase-hooks/firestore';
import {currency} from '../../../utils/formatter';
import format from 'date-fns/format';
import AppPageLoading from '../../../components/AppPageLoading';

//icon
import DeleteIcon from '@material-ui/icons/Delete';
import ViewIcon from '@material-ui/icons/Visibility';
import { IconButton } from '@material-ui/core';

import useStyles from './styles';
import DetailsDialog from './detail';

function Transaksi(){
    const classes = useStyles();
    const {firestore,user} = useFirebase();
    const transaksiCollection = firestore.collection(`toko/${user.uid}/transaksi`);

    const [snapshot,loading] = useCollection(transaksiCollection);
    const [transaksiItems,setTransaksiItems] = useState([]);

    useEffect(()=>{
        if(snapshot){
            setTransaksiItems(snapshot.docs);
        }
    },[snapshot]);

    const handleDelete = transaksiDocs => async (e) => {
        if(window.confirm('Apakah anda yakin ingin menghapus transaksi ini ?')){
            await transaksiDocs.ref.delete();
        }
    }

    const [details,setDetails] = useState({
        open: false,
        transaksi: {}
    })

    const handleCloseDetails = (e) =>{
        setDetails({
            open: false,
            transaksi: {}
        })
    }

    const handleOpenDetails = transaksiDocs => (e) => {
        setDetails({
            open: true,
            transaksi: transaksiDocs.data()
        })
    }

    if(loading){
        return <AppPageLoading/>
    }

    return <>
            <Typography component="h1" variant="h5" paragraph>Daftar Transaksi</Typography>
            {
                transaksiItems.length <=0 && <Typography>Belum ada transaksi</Typography>
            }

            <Grid container spacing={5}>
                {
                    transaksiItems.map(transaksiDocs=>{
                        const transaksiData = transaksiDocs.data();
                        return <Grid key={transaksiDocs.id} item xs={12} sm={12} md={6} lg={4}>
                            <Card className={classes.card}>
                                <CardContent className={classes.transaksiSummary}>
                                    <Typography variant="h5" noWrap>No: {transaksiData.no}</Typography>
                                    <Typography>Total: {currency(transaksiData.total)}</Typography>
                                    <Typography>Tanggal: {format(new Date(transaksiData.timestamp),'dd-MM-yyyy HH:mm')}</Typography>
                                </CardContent>
                                <CardActions className={classes.transaksiActions}>
                                    <IconButton onClick={handleOpenDetails(transaksiDocs)}><ViewIcon/></IconButton>
                                    <IconButton onClick={handleDelete(transaksiDocs)}><DeleteIcon/></IconButton>
                                </CardActions>
                            </Card>
                        </Grid>
                    })
                }
            </Grid>
            <DetailsDialog open={details.open} handleClose={handleCloseDetails} transaksi={details.transaksi}/>
    </>
}

export default Transaksi;