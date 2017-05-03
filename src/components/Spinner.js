import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Spinner from 'react-native-spinkit';

import theme from '../util/theme';

export default (props) => {
  return (
    <View style={{
      flex: 1,
      justifyContent: 'center', // 子の配置 'flex-start', 'center', 'flex-end', 'space-between', 'space-around'
      alignItems: 'center', // 'stretch', 'flex-start', 'flex-end', 'center'
    }}>
      {(() => {
        if (props.error) {
          return (
            <TouchableOpacity onPress={props.onPress} style={{
              flex: 1,
              justifyContent: 'center', // 子の配置 'flex-start', 'center', 'flex-end', 'space-between', 'space-around'
              alignItems: 'center', // 'stretch', 'flex-start', 'flex-end', 'center'
            }}>
              <Icon
                style={{ marginBottom: 8 }}
                name="reload" size={32}
                color={theme.color.tint}
              />
              <Text style={{ color: 'black' }}>読み込みエラー</Text>
            </TouchableOpacity>
          )
        } else {
          return <Spinner
                  isVisible={true}
                  size={50}
                  type="ChasingDots"
                  color={theme.color.tint} />
        }
      })()}

    </View>
  );
}