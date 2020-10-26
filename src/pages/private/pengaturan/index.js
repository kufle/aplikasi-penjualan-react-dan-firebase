import React from 'react';
import { Route, Switch, Redirect} from 'react-router-dom';

//import material-ui
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Paper from '@material-ui/core/Paper';
import useStyles from './styles'

//komponen halaman Pengaturan
import Pengguna from './pengguna';
import Toko from './toko';

function Pengaturan(props){
    const {location,history} = props;
    const handleChangeTab = (event,value) => {
        history.push(value);
    }
    const classes = useStyles();
    return (
        <Paper square>
            <Tabs 
                value={location.pathname}
                indicatorColor="primary"
                textColor="primary"
                onChange={handleChangeTab}
            >
                <Tab label="Pengguna" value="/pengaturan/pengguna">

                </Tab>
                <Tab label="Toko" value="/pengaturan/toko"></Tab>
            </Tabs>
            <div className={classes.tabContent}>
                <Switch>
                    <Route path="/pengaturan/pengguna" component={Pengguna} />
                    <Route path="/pengaturan/toko" component={Toko} />
                    <Redirect to="/pengaturan/pengguna" />
                </Switch>
            </div>
        </Paper>
    )
}

export default Pengaturan;