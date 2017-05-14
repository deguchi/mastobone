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
import IconMaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import IconEntypo from 'react-native-vector-icons/Entypo';
import ToolTip from 'react-native-tooltip';

import theme from './util/theme';
import openBrowser from './util/openBrowser';
import I18n from './util/i18n';

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

type State = {
  username: string,
  timeline: Array<any>,
  refreshing: boolean,
};

class Home extends Component {
  state: State;
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      timeline: [],
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
    } else {
      Actions.login();
    }
  }
  _fetch() {
    // console.log(this.props.api.token)
    this.props.api.get('/api/v1/accounts/verify_credentials').then((resp) => {
      console.log(resp);
      if (!resp.status) {
        this.setState({username: resp.username, refreshing: false});
      } else if (resp.status===401) {
        this._logout();
      }
    });
    this.props.api.get('/api/v1/timelines/home').then((resp) => {
      console.log(resp);
      if (!resp.status) {
        this.setState({timeline: resp});
      }
    });
  }
  _onRefresh() {
    this.setState({refreshing: true});
    this._fetch();
  }
  render() {
    // console.log(this.props)
    let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    if (this.state.timeline.length > 0) {
      return (<View style={styles.container}>
        <ListView
          dataSource={ds.cloneWithRows(this.state.timeline)}
          renderRow={(twoot) => <Twoot twoot={twoot} />}
          style={styles.timeline}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
        />
      </View>);
    } else if (this.state.username !== '') {
      return (<View style={styles.containerCenter}>
        <Text style={styles.instructions}>
          {I18n.t('Welcome')} {this.state.username}
        </Text>
      </View>);
    } else {
      return (<View style={styles.containerCenter}>
          <Spinner error={false} />
      </View>);
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.color.bg,
  },
  containerCenter: {
    flex: 1,
    backgroundColor: theme.color.bg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
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
    iconContainer: {
      flex: 1,
    },
    icon: {
      width: 50,
      height: 50,
    },
    username: {
      color: theme.color.shine,
    },
    body: {
      flex: 4.5,
    },
    map: {
      marginTop: 10,
      width: null,
      height: 200,
    }
  });
  let twoot;
  if (props.twoot.reblog) {
    twoot = props.twoot.reblog;
  } else {
    twoot = props.twoot;
  }
  if (!twoot.content.match('<p>')) {
    twoot.content = `<p>${twoot.content}</p>`
  }
  return (
    <View style={style.container}>
      <View style={style.iconContainer}>
        <Image source={{uri: twoot.account.avatar_static}} style={style.icon} />
      </View>
      <View style={style.body}>
        <Text style={style.username}>
          {twoot.account.acct}
          {(() => {
            if (props.twoot.reblog) {
              return (<IconMaterialCommunityIcons name="twitter-retweet"
                                 size={18}
                                 color={theme.color.shine}
                                 style={{ marginLeft: 100 }}
                      />)
            }
          })()}
        </Text>
        <HTMLView
          value={twoot.content}
          onLinkPress={(url) => openBrowser(url)}
          stylesheet={{
            span: {
              color: theme.color.tint,
            },
            p: {
              color: theme.color.shine,
            },
          }}
        />
        {(() => {
          // experimental
          if (twoot.extra && twoot.extra !== "null" && twoot.extra !== "{}") {
            const extra = JSON.parse(twoot.extra);
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
        <View style={{
          flex: 1,flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          marginTop: 5,
        }}>
          <IconEntypo name="reply"
             size={18}
             color={theme.color.shine}
             style={{ marginRight: 10 }}
          />
          {(() => {
            if (props.twoot.visibility==='public' || props.twoot.visibility==='unlisted') {
              return <IconEntypo name="retweet"
                 size={18}
                 color={theme.color.shine}
                 style={{ marginRight: 10 }}
              /> ;
            } else {
              return <IconEntypo name="lock"
                 size={18}
                 color={theme.color.shine}
                 style={{ marginRight: 10 }}
              />;
            }
          })()}
          <IconEntypo name="star"
             size={18}
             color={theme.color.shine}
             style={{ marginRight: 10 }}
          />
          <IconEntypo name="dots-three-horizontal"
             size={18}
             color={theme.color.shine}
             style={{ marginRight: 10 }}
          />
        </View>
      </View>
    </View>
  );
};

