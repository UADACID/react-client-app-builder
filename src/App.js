import React from 'react';

import Button from '@material-ui/core/Button';
import Radio from '@material-ui/core/Radio';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import LinearProgress from '@material-ui/core/LinearProgress';

import './App.css';
import imageOne from './one.png';
import imageTwo from './two.png';
import imageThree from './three.png';

var _ = require('lodash');


const config = {
  image: {
    a: {
      isAppNeedAuth: true,
      getAuthInstallationSection: 'dashboard_only',
      selectedFeatures: ['auth', 'banner', 'event', 'video', 'article', 'profile'],
      selectedFeaturesWithAuth: ['event', 'article', 'profile'],
      orderForTheHomeMenu: ['article', 'banner', 'video'],
      featuresSelectedForDashboardTab: ['article', 'video', 'event', 'profile']
    },
    b: {
      isAppNeedAuth: true,
      getAuthInstallationSection: 'each_feature',
      selectedFeatures: ['auth', 'banner', 'event', 'video', 'article', 'profile'],
      selectedFeaturesWithAuth: ['event'],
      orderForTheHomeMenu: ['banner', 'article', 'video'],
      featuresSelectedForDashboardTab: ['article', 'video', 'event', 'profile']
    },
    c: {
      isAppNeedAuth: false,
      getAuthInstallationSection: null,
      selectedFeatures: ['banner', 'event', 'video', 'article'],
      selectedFeaturesWithAuth: ['event'],
      orderForTheHomeMenu: ['banner', 'article', 'video'],
      featuresSelectedForDashboardTab: ['video', 'event', 'article',]
    }
  }
}

const useStyles = makeStyles(theme => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      // width: 200,
      width: 400,

    },
  },
}));

function App() {

  const classes = useStyles();

  //HANDLE SELECT IMAGE
  const [selectedValue, setSelectedValue] = React.useState('b');
  const handleChange = event => {
    setSelectedValue(event.target.value);
  };
  const handleClickImage = value => {
    setSelectedValue(value);
  }

  //APP NAME
  const [appName, setAppName] = React.useState('')

  //IS APP NEED AUTH
  const [isNeedAuth, setIsNeedAuth] = React.useState(false);
  const handleChangeAuth = event => {
    if (event.target.checked) {
      setListFeature({ ...listFeature, auth: true, profile: true })
    } else {
      setListFeature({ ...listFeature, auth: false, profile: false })
    }
    setIsNeedAuth(event.target.checked);
  };


  //AUTH INSTALLATION SECTION
  const [selectedAuthSection, setSelectedAuthSection] = React.useState('dashboard_only');
  const handleChangeSection = event => {
    setSelectedAuthSection(event.target.value);
  };


  //LIST FEATURE
  const [listFeature, setListFeature] = React.useState({
    banner: true,
    event: false,
    video: true,
    article: false
  });
  const handleChangeListFeature = name => event => {
    setListFeature({ ...listFeature, [name]: event.target.checked });
  };
  const { banner, event, video, article } = listFeature;



  const [loadingSubmit, setLoadingSubmit] = React.useState(false)
  const onSubmit = () => {
    const filteredSelectedFeature = _.pickBy(listFeature);

    const selectedFeatures = Object.keys(filteredSelectedFeature)
    // if (isNeedAuth) {
    //   selectedFeatures.push('auth')
    //   selectedFeatures.push('profile')
    // }


    // return
    setLoadingSubmit(true)

    const formData = {
      appName: appName,
      isAppNeedAuth: config.image[selectedValue].isAppNeedAuth,
      getAuthInstallationSection: config.image[selectedValue].getAuthInstallationSection,
      selectedFeatures: config.image[selectedValue].selectedFeatures, // untuk generate route 
      selectedFeaturesWithAuth: config.image[selectedValue].selectedFeaturesWithAuth,// di sini harus dipastikan tidak ada fitur 'auth'  tp bisa di tambahkan 'dashboard'
      orderForTheHomeMenu: config.image[selectedValue].orderForTheHomeMenu,// di sini harus dipastikan tidak ada fitur 'auth'
      featuresSelectedForDashboardTab: config.image[selectedValue].featuresSelectedForDashboardTab // di sini harus sesuai urutan
    }

    // console.log(formData)
    // return
    var filename = ''
    fetch('http://localhost:3000/builder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(formData)
    }).then(response => {
      filename = response.headers.get("content-disposition");
      filename = filename.match(/(?<=")(?:\\.|[^"\\])*(?=")/)[0];
      return response.blob()
    })
      .then(blob => {
        console.log({ blob })
        var url = window.URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setLoadingSubmit(false)
        setOpenDialog(false)
      });
  }

  // DIALOG
  const [openDialog, setOpenDialog] = React.useState(false);


  //RENDER UI

  const renderAppName = () => <TextField id="outlined-basic" label="App Name" variant="outlined" onChange={(e) => setAppName(e.target.value)} />

  const renderListFeature = () => <div>
    <p className="label">Select a feature</p>
    <Grid className="border">
      <FormControlLabel
        control={<Checkbox checked={banner} onChange={handleChangeListFeature('banner')} value="banner" />}
        label="Banner"
        labelPlacement="start"
      />
      <FormControlLabel
        control={<Checkbox checked={video} onChange={handleChangeListFeature('video')} value="video" />}
        label="Video"
        labelPlacement="start"
      />
      <FormControlLabel
        control={<Checkbox checked={article} onChange={handleChangeListFeature('article')} value="article" />}
        label="Article"
        labelPlacement="start"
      />
      <FormControlLabel
        control={<Checkbox checked={event} onChange={handleChangeListFeature('event')} value="event" />}
        label="Event"
        labelPlacement="start"
      />
    </Grid></div>

  const renderIsNeedAuth = () => <Grid
    container
    alignItems="center"
    className="border"
  >
    <Grid item xs={2}>
    </Grid>
    <Grid item xs={10}>
      <FormControlLabel
        control={<Checkbox
          checked={isNeedAuth}
          onChange={handleChangeAuth}
          value="primary"
          inputProps={{ 'aria-label': 'primary checkbox' }}
        />}
        className="label"
        label="does the application require auth ?"
        labelPlacement="start"
      />
    </Grid>
  </Grid>

  const renderAuthSection = () => <div>
    <p className="label">Auth Installation Section</p>
    <Grid
      className="border"
    >
      <FormControlLabel
        value="start"
        control={<Radio color="primary" checked={selectedAuthSection === 'dashboard_only'} value="dashboard_only" onChange={handleChangeSection} />}
        label="Dashboard only"
        labelPlacement="start"
      />
      <FormControlLabel
        value="start"
        control={<Radio color="primary" checked={selectedAuthSection === 'each_feature'} value="each_feature" onChange={handleChangeSection} />}
        label="Each feature"
        labelPlacement="start"
      />
    </Grid></div>

  return (
    <div class="flex-container">
      <div class="image-item-container">
        {/* <img src={imageOne} alt="logo" /> */}
        <h2>Layout 1</h2>
        <img src={imageOne} class={selectedValue === 'a' ? "responsive2" : "responsive"} alt="1" onClick={() => handleClickImage('a')} />
        {/* <Radio
          checked={selectedValue === 'a'}
          onChange={handleChange}
          value="a"
          name="radio-button-demo"
          inputProps={{ 'aria-label': 'A' }}
        /> */}
      </div>
      <div class="image-item-container">
        <h2>Layout 2</h2>
        <img src={imageTwo} class={selectedValue === 'b' ? "responsive2" : "responsive"} alt="1" onClick={() => handleClickImage('b')} />
        {/* <Radio
          checked={selectedValue === 'b'}
          onChange={handleChange}
          value="b"
          name="radio-button-demo"
          inputProps={{ 'aria-label': 'B' }}
        /> */}
      </div>
      <div class="image-item-container">
        <h2>Layout 3</h2>
        <img src={imageThree} class={selectedValue === 'c' ? "responsive2" : "responsive"} alt="1" onClick={() => handleClickImage('c')} />
        {/* <Radio
          checked={selectedValue === 'c'}
          onChange={handleChange}
          value="c"
          name="radio-button-demo"
          inputProps={{ 'aria-label': 'C' }}
        /> */}
      </div>
      <div class="image-item-container">

        <div class="Aligner-item">
          <form className={[classes.root]} noValidate autoComplete="off">
            <h2 className="title">Meteor Builder Application</h2>
            <div style={{ height: 40 }}></div>
            {renderAppName()}
            {/* {renderListFeature()}
            {renderIsNeedAuth()}
            {
              !isNeedAuth ? null : renderAuthSection()
            } */}

            <Button variant="contained" style={{background: 'linear-gradient(to right bottom, #FF0000, #9D0000)'}} color={loadingSubmit ? 'default' : "primary"} onClick={() => loadingSubmit ? setOpenDialog(true) : onSubmit()}>
              {loadingSubmit ? <CircularProgress size={24} color="secondary" /> : 'MAKE IT'}
            </Button>
          </form>
        </div>

      </div>
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Download process in progress"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            please wait until the process is fully finished before using it again
          <LinearProgress />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            CANCEL
          </Button>
          <Button onClick={() => setOpenDialog(false)} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default App;
