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
  TextInput,
} from 'react-native';

import {connect} from 'react-redux';
import { Actions } from 'react-native-router-flux'
import HTMLView from 'react-native-htmlview';

import theme from './util/theme';
import openBrowser from './util/openBrowser';
import I18n from './util/i18n';

import Spinner from './components/Spinner';

import Icon from 'react-native-vector-icons/FontAwesome';

import {
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
  status: string,
};

class newTwoot extends Component {
  state: State;
  constructor(props) {
    super(props);
    this.state = {
      status: '',
    };
  }
  async _twoot() {
    console.log(this.state.status)
    const params = {
      status: this.state.status,
    };
    // status: The text of the status
    // in_reply_to_id (optional): local ID of the status you want to reply to
    // media_ids (optional): array of media IDs to attach to the status (maximum 4)
    // sensitive (optional): set this to mark the media of the status as NSFW
    // spoiler_text (optional): text to be shown as a warning before the actual content
    // visibility (optional): either "direct", "private", "unlisted" or "public"
    await this.props.api.post('/api/v1/statuses', params);
    Actions.main();
  }
  render() {
    return (<View style={styles.container}>
      <Icon name="times"
         size={32}
         color={theme.color.shine}
         style={styles.cancel}
         onPress={Actions.main}
      />
      <TextInput style={styles.textInput}
                 placeholder={I18n.t('WhatDoing')}
                 onChangeText={(value) => this.setState({status: value})}
                 autoCapitalize="none"
                 autoFocus={true}
                 autoCorrect={false}
                 multiline={true}
      />
      <TouchableHighlight style={styles.button} onPress={this._twoot.bind(this)}>
        <Text style={styles.buttonText}>{I18n.t('Twoot')}</Text>
      </TouchableHighlight>
    </View>)
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.color.bg,
    padding: 10,
  },
  cancel: {
    marginRight: 5,
    marginBottom: 5,
    alignSelf: 'flex-end',
  },
  textInput: {
    fontSize: 16,
    width: null,
    height: 500,
    padding: 10,
    backgroundColor: theme.color.shine,
    marginBottom: 10
  },
  button: {
    backgroundColor: theme.color.tint,
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: theme.color.shine,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(newTwoot)

