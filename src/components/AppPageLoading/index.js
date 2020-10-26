import React from 'react';

//import material-ui
import CircularProgress from '@material-ui/core/CircularProgress';

//import style
import useStyles from './styles';

function AppPageLoading(){
    const classes = useStyles();

    return (
        <div className={classes.loadingBox}>
            <CircularProgress />
        </div>
    )
}

export default AppPageLoading;