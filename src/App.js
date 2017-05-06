/**
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  WebView,
} from 'react-native';

import {connect} from 'react-redux';
import { Scene, Router, ActionConst, Actions } from 'react-native-router-flux'
import Icon from 'react-native-vector-icons/FontAwesome';
import IconIonicons from 'react-native-vector-icons/Ionicons';

import theme from './util/theme';
import I18n from './util/i18n';

import Login from './Login';
import Home from './Home';

import Spinner from './components/Spinner';


import {
  initializeAPI,
  getToken,
  removeToken,
  getCurrentUser,
} from './actions'

const mapStateToProps = store => ({
  api: store.api,
  token: store.token,
  currentUser: store.currentUser,
});

const mapDispatchToProps = dispatch => ({
  initializeAPI (domain, scopes, clientName) {
    return dispatch(initializeAPI(domain, scopes, clientName))
  },
  getToken () {
    return dispatch(getToken())
  },
  removeToken () {
    return dispatch(removeToken())
  },
  getCurrentUser () {
    return dispatch(getCurrentUser())
  },
});



const TabIcon = ({ selected, title, iconName, size }) => (
  <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
    <Icon name={iconName} size={size} color={selected ? theme.color.tint : '#fff'} style={{ marginRight: 5 }}/>
    <Text style={{ color: selected ? '#2b90d9' : '#fff' }}>{title}</Text>
  </View>
);

const styles = StyleSheet.create({
  scene: {
    backgroundColor: theme.color.bg
  },

  iconContainer: {
    borderTopWidth: StyleSheet.hairlineWidth * 4,
    borderTopColor: theme.color.tint,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },

  iconContainerSelected: {
    borderTopColor: theme.color.tint
  },

  bar: {
    backgroundColor: theme.color.bg,
    borderBottomWidth: 1,
    borderBottomColor: theme.color.tint,
  },

  navTitle: {
    color: theme.color.tint,
    fontWeight: 'bold',
    fontSize: 17,
  },

});

type State = {
  login: boolean,
  loading: boolean,
};

class App extends Component {
  state: State;
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      login: false,
    };
  }
  async componentDidMount() {
    // console.log(this.props.token)
    await this.props.getCurrentUser();
    if (this.props.currentUser) {
      await this.props.getToken(this.props.currentUser);
      // console.log(this.props.token)
      if(this.props.token) {
        // console.log(this.props.currentUser.split('@')[1])
        await this.props.initializeAPI(this.props.currentUser.split('@')[1]);
        console.log(this.props.api)
        this.props.api.setToken(this.props.token);
        this.setState({loading: false});
      } else {
        this.setState({login: true, loading: false});
      }
    } else {
      this.setState({login: true, loading: false});
    }
  }
  logout () {
    this.props.removeToken().then(() => {
      Actions.login();
    });
  }
  render () {
    // console.log(this.props)
    if (this.state.loading) {
      return (<View style={{flex:1, backgroundColor: theme.color.bg}}>
        <Spinner error={false} />
      </View>);
    }
    return (
      <Router
        sceneStyle={styles.scene}
        navigationBarStyle={styles.bar}
        titleStyle={styles.navTitle}
      >
        <Scene key='root'>
          <Scene key='main' tabs={true} tabBarIconContainerStyle={styles.iconContainer} tabBarSelectedItemStyle={styles.iconContainerSelected} tabBarStyle={styles.bar} type={ActionConst.REPLACE}>
            <Scene key='home' size={30} sceneStyle={styles.scene} title={I18n.t('Home')} iconName='home' icon={TabIcon} component={Home} initial={true}  renderRightButton={() => {
              return <IconIonicons name="md-exit" size={24} color={theme.color.tint} style={{ marginRight: 5 }} onPress={this.logout.bind(this)} />
            }} />
          </Scene>
          <Scene key='login' hideNavBar={true} component={Login} title={I18n.t('Login')} initial={this.state.login} />
        </Scene>
      </Router>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);