import * as React from 'react';
import './App.css';
import MainMap from './components/MainMap';
import Grid from "@material-ui/core/Grid"

class App extends React.Component{
    render() {
        return (
            <div>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                          <MainMap />
                    </Grid>
                </Grid>
            </div>
        )
    }
}
export default App;