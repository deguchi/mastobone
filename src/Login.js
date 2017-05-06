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
  TextInput,
} from 'react-native';
import {connect} from 'react-redux';
import { Actions } from 'react-native-router-flux'

import Spinner from './components/Spinner';

import theme from './util/theme';
import I18n from './util/i18n';

import {
  initializeAPI,
  getToken,
  setToken,
  getCurrentUser,
  setCurrentUser,
} from './actions'

const mapStateToProps = store => ({
  api: store.api,
  token: store.token,
});

const mapDispatchToProps = dispatch => ({
  initializeAPI (domain, scopes, clientName) {
    return dispatch(initializeAPI(domain, scopes, clientName))
  },
  getToken () {
    return dispatch(getToken())
  },
  setToken (username, domain, token) {
    return dispatch(setToken(username, domain, token))
  },
  getCurrentUser () {
    return dispatch(getCurrentUser())
  },
  setCurrentUser (username, domain) {
    return dispatch(setCurrentUser(username, domain))
  },
});

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: null,
      clientId: null,
      clientSecret: null,
      authorizationCode: null,
      domain: '',
      loading: false,
    };
  }
  async login() {
    // console.log(this.state.domain)
    // console.log(this.props.api)
    if (this.state.domain !== '') {
      await this.props.initializeAPI(this.state.domain);
      await this.props.api.createOAuthApp();
      await this.props.api.getAuthorizationUrl().then((url) => {
        this.setState({url: url});
      });
    }
  }
  async getAuthorizationCode(url) {
    // console.log(url)
    if(url.match(/\/oauth\/authorize\/(.*)/)) {
      // console.log(RegExp.$1);
      this.setState({url: null, loading: true});
      const token = await this.props.api.getToken(RegExp.$1);
      let username;
      await this.props.api.setToken(token);
      await this.props.api.getCurrentAccount().then((resp) => {
        // console.log(resp);
        if (!resp.status) {
          username = resp.username;
        }
      });
      await this.props.setCurrentUser(username, this.state.domain);
      await this.props.setToken(token);
      Actions.main();
    }
  }
  render() {
    // console.log(this.props);
    return (
      <View style={styles.container}>
        {(() => {
          if (this.state.url) {
            return (<WebView
              source={{uri: this.state.url}}
              style={{marginTop: 20, width: 400, height: 750}}
              onLoad={(event) => this.getAuthorizationCode(event.nativeEvent.url)}
            />);
          } else if(this.state.loading) {
            return <Spinner error={false} />;
          } else {
            return (<View style={styles.container}>
              <TextInput style={styles.textInput} placeholder={'Enter instance domain'}
                onChangeText={(value) => this.setState({domain: value})}
                autoCapitalize="none"
                autoFocus={true}
                autoCorrect={false}
              />
              <TouchableHighlight onPress={this.login.bind(this)}>
                <Text style={styles.instructions}>Login</Text>
              </TouchableHighlight>
            </View>);
          }
        })()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.color.bg,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: theme.color.tint,
    marginBottom: 5,
  },
  textInput: {
    width: 300,
    height: 40,
    padding: 10,
    backgroundColor: 'white',
    marginBottom: 10
  }
});


export default connect(mapStateToProps, mapDispatchToProps)(Login)