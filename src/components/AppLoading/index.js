import React from 'react';

//import material-ui
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';

//import style
import useStyles from './styles';

function AppLoading(){
    const classes = useStyles();

    return (
        <Container maxWidth="xs">
            <div className={classes.loadingBox}>
                <Typography
                variant="h6"
                component="h2"
                className={classes.title}
                >Aplikasi Penjualan</Typography>
                <LinearProgress />
            </div>
        </Container>
    )
}

export default AppLoading;