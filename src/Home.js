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
  ListView,
} from 'react-native';

import {connect} from 'react-redux';
import { Actions } from 'react-native-router-flux'

import theme from './util/theme';

import Spinner from './components/Spinner';

import {
  initializeAPI,
  loadToken,
  saveToken,
  removeToken,
} from './actions'

const mapStateToProps = store => ({
  api: store.api,
  token: store.token,
});

const mapDispatchToProps = dispatch => ({
  removeToken () {
    return dispatch(removeToken())
  },
});

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: null,
      timeline: null,
    };
  }
  _logout () {
    this.props.removeToken().then(() => {
      Actions.login();
    });
  }
  componentDidMount() {
    this._fetch();
  }
  _fetch() {
    if (this.props.token) {
      this.props.api.setToken(this.props.token);
      this.props.api.getCurrentAccount().then((resp) => {
        // console.log(resp);
        if (!resp.status) {
          this.setState({username: resp.username});
        } else if (resp.status===401) {
          this._logout();
        }
      });
      this.props.api.getTimeline().then((resp) => {
        console.log(resp);
        if (!resp.status) {
          let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
          this.setState({timeline: ds.cloneWithRows(resp)});
        }
      });
    }
  }
  render() {
    // console.log(this.props)
    return (
      <View style={styles.container}>
        {(() => {
          if (this.state.timeline) {
            return <ListView
              dataSource={this.state.timeline}
              renderRow={(twoot) => <Twoot twoot={twoot} />}
              style={styles.timeline}
            />;
          } else if (this.state.username) {
            return (
              <Text style={styles.instructions}>
                Welcome {this.state.username}
              </Text>
            );
          } else {
            return <Spinner error={false} />;
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
  timeline: {
    flex: 1,
    flexDirection: 'column',
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Home)


const Twoot = (props) => {
  const style = StyleSheet.create({
    twoot: {
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: theme.color.tint,
    },
    content: {
      color: 'white',
    }
  });
  // console.log(props.twoot)
      // onPress={() => Actions.twoot({ twoot: props.twoot })}
  return (
    <TouchableHighlight underlayColor="#EABA07"
      style={style.twoot}
    >
      <Text style={style.content}>{props.twoot.content}</Text>
    </TouchableHighlight>
  );
};
