import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, IconButton, Typography } from '@material-ui/core/';
import MenuDropDown from './MenuDropDown';
import AvatarMenu from './AvatarMenu';
import ExploreIcon from '@material-ui/icons/Explore';
import Grid from '@material-ui/core/Grid';

const styles = (theme) => ({
  root: {
    flexGrow: 1
  },
  title: {
    justifyContent: 'center',
    padding: '0 15'
  },
  menu: {
    backgroundColor: '#282c3e'
  },
  menuButton: {
    marginRight: theme.spacing(1),
    marginLeft: 'auto'
  }
});

class Header extends Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <AppBar className={classes.menu} position='fixed'>
          <Toolbar>
            <AvatarMenu edge='start' />
            <Grid container spacing={3} className={classes.title}>
              <Grid item>
                <ExploreIcon fontSize='large' />
              </Grid>
              <Grid item>
                <Typography variant='h4'>MyTinerary</Typography>
              </Grid>
            </Grid>
            <IconButton edge='end' className={classes.menuButton} color='inherit' aria-label='menu'>
              <MenuDropDown />
            </IconButton>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default withStyles(styles)(Header);
