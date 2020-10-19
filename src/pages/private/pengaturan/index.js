import React from 'react';
import { Route, Switch, Redirect} from 'react-router-dom';

//komponen halaman Pengaturan
import Pengguna from './pengguna';
import Toko from './toko';

function Pengaturan(){
    return (
        <Switch>
            <Route path="/pengaturan/pengguna" component={Pengguna} />
            <Route path="/pengaturan/toko" component={Toko} />
            <Redirect to="/pengaturan/pengguna" />
        </Switch>
    )
}

export default Pengaturan;