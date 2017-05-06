/**
 * @flow
 */


import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
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
      flexDirection: 'row',
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
    icon: {
      width: 50,
      height: 50,
    },
    username: {
      color: 'white',
    },
    body: {
      width: 280,
      marginLeft: 10,
    },
    map: {
      marginTop: 10,
      width: null,
      height: 200,
    }
  });

  console.log(props.twoot.extra)
  if (props.twoot.extra !== "null" && props.twoot.extra !== {}) {
  }

  return (
    <View style={style.container}>
      <Image source={{uri: props.twoot.account.avatar_static}} style={style.icon} />
      <View style={style.body}>
        <Text style={style.username}>{props.twoot.account.acct}</Text>
        <HTMLView
          value={props.twoot.content}
          onLinkPress={(url) => openBrowser(url)}
          stylesheet={style}
        />
        {(() => {
          // experimental
          if (props.twoot.extra !== "null" && props.twoot.extra !== "{}") {
            const extra = JSON.parse(props.twoot.extra);
            console.log(extra);
            const placeName = 'Hello Mastodon!';
            const zoom = 17;
            const lat = extra['lat'];
            const lon = extra['lon'];
            console.log(lat, lon);
            return <TouchableHighlight onPress={() => openBrowser(`https://www.google.co.jp/maps/place/${encodeURIComponent(placeName)}/@${lat},${lon},${zoom}z/data=!4m5!3m4!1s0x6018f313a98e3861:0x580be5145020e6eb!8m2!3d35.665507!4d139.66342`)}>
              <Image style={style.map} source={{uri: `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lon}&zoom=${zoom}&size=280x200&maptype=roadmap&markers=color:red%7Clabel:C%7C35.665507,139.6612313&key=AIzaSyBbo4xyvaCt93zN9FmQcH0MFWQBV_0SFJU`}}/>
            </TouchableHighlight>
          }
        })()}
      </View>
    </View>
  );
};

