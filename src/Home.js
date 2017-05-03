/**
 * @flow
 */


import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  ListView,
  RefreshControl,
} from 'react-native';

import {connect} from 'react-redux';
import { Actions } from 'react-native-router-flux'
import HTMLView from 'react-native-htmlview';

import theme from './util/theme';
import openBrowser from './util/openBrowser';
import I18n from './util/i18n';

import Spinner from './components/Spinner';
import ContainerStyle from './components/ContainerStyle';

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
      refreshing: false,
    };
  }
  _logout () {
    this.props.removeToken().then(() => {
      Actions.login();
    });
  }
  componentDidMount() {
    if (this.props.token) {
      this._fetch();
    }
  }
  _fetch() {
    console.log(this.props.api.token)
    this.props.api.getCurrentAccount().then((resp) => {
      console.log(resp);
      if (!resp.status) {
        this.setState({username: resp.username, refreshing: false});
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
  _onRefresh() {
    this.setState({refreshing: true});
    this._fetch();
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
              style={[styles.timeline, ContainerStyle]}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this._onRefresh.bind(this)}
                />
              }
            />;
          } else if (this.state.username) {
            return (
              <Text style={styles.instructions}>
                {I18n.t('Welcome')} {this.state.username}
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
    container: {
      flex: 1,
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: theme.color.gray,
      minHeight: 60,
    },
    span: {
      color: theme.color.tint,
      // color: 'white',
    },
    p: {
      color: 'white',
    },
  });
  return (
    <View style={style.container}>
      <HTMLView
        value={props.twoot.content}
        onLinkPress={(url) => openBrowser(url)}
        stylesheet={style}
      />
    </View>
  );
};

