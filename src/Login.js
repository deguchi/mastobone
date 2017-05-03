/**
 * Mastodon React Native
 * Copyright (c) 2017 Satoshi Deguchi
 * This software is released under GNU AGPL v3.
 * http://www.gnu.org/licenses/agpl.html
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
import { Actions } from 'react-native-router-flux'

import theme from './util/theme';

import {
  initializeAPI,
  loadToken,
  saveToken,
} from './actions'

const mapStateToProps = store => ({
  api: store.api,
  token: store.token,
});

const mapDispatchToProps = dispatch => ({
  initializeAPI (baseUrl, scopes, clientName) {
    return dispatch(initializeAPI(baseUrl, scopes, clientName))
  },
  loadToken () {
    return dispatch(loadToken())
  },
  saveToken (token) {
    return dispatch(saveToken(token))
  },
});

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: null,
      baseUrl: 'https://bookn.me',
      clientName: 'mastdon',
      scopes: 'read write follow',
      clientId: null,
      clientSecret: null,
      authorizationCode: null,
    };
    this.props.loadToken();
    this.props.initializeAPI(this.state.baseUrl, this.state.scopes, this.state.clientName);
  }
  async login() {
    // console.log(this.props.api)
    await this.props.api.createOAuthApp()
    await this.props.api.getAuthorizationUrl().then((url) => {
      this.setState({url: url});
    });
  }
  async getAuthorizationCode(url) {
    // console.log(url)
    if(url.match(/\/oauth\/authorize\/(.*)/)) {
      // console.log(RegExp.$1);
      const token = await this.props.api.getToken(RegExp.$1);
      this.props.saveToken(token).then(() => {
        Actions.main();
      });
    }
  }
  render() {
    console.log(this.props);
    if (this.props.token) {
      Actions.main();
      return null;
    }
    return (
      <View style={styles.container}>
        <TouchableHighlight onPress={this.login.bind(this)}>
          <Text style={styles.instructions}>Login</Text>
        </TouchableHighlight>
        {(() => {
          if (this.state.url) {
            return (<WebView
              source={{uri: this.state.url}}
              style={{marginTop: 20, width: 400, height: 750}}
              onLoad={(event) => this.getAuthorizationCode(event.nativeEvent.url)}
            />);
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
});


export default connect(mapStateToProps, mapDispatchToProps)(Login)