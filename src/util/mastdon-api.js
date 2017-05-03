/**
 * Mastodon React Native
 * Copyright (c) 2017 Satoshi Deguchi
 * This software is released under GNU AGPL v3.
 * http://www.gnu.org/licenses/agpl.html
 * @flow
 */

import querystring from 'querystring';

export default class MastodonAPI {
  constructor(baseUrl, scopes, clientName) {
    this.baseUrl = baseUrl;
    this.scopes = scopes;
    this.clientName = clientName;
    this.clientId = null;
    this.token = null;
  }
  setToken(token) {
    this.token = token;
  }
  createOAuthApp() {
    const url = this.baseUrl +'/api/v1/apps';
    var redirectUri = 'urn:ietf:wg:oauth:2.0:oob';

    return new Promise((resolve, reject) => {
      fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_name: this.clientName,
          redirect_uris: redirectUri,
          scopes: this.scopes
        })
      })
      .then((response) => response.json())
      .then((responseJson) => {
        this.clientId = responseJson.client_id;
        this.clientSecret = responseJson.client_secret;
        return resolve(responseJson);
      })
      .catch((error) => {
        return reject(error);
      });
    });
  }
  getAuthorizationUrl() {
    var redirectUri = 'urn:ietf:wg:oauth:2.0:oob';
    return new Promise((resolve) => {
        var url = this.baseUrl + '/oauth/authorize' + "?" + querystring.stringify({
          redirect_uri: redirectUri,
          response_type: 'code',
          client_id: this.clientId,
          scope: this.scopes
        });
        resolve(url);
    });
  }
  getToken (code) {
    return new Promise((resolve, reject) => {
      fetch(`${this.baseUrl}/oauth/token`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          code,
          grant_type: 'authorization_code',
          redirect_uri: 'urn:ietf:wg:oauth:2.0:oob'
        }),
      })
      .then((response) => response.json())
      .then((response) => {
        // console.log(response)
        var accessToken= response["access_token"];
        resolve(accessToken);
        // var refresh_token= response["refresh_token"];
        // delete response["refresh_token"];
        // return callback(null, access_token, refresh_token, response); // callback results =-=
      })
      .catch((error) => {
        // console.log(error)
        reject(error);
      });
    });
  }
  _request(path) {
    return fetch(this.baseUrl + path, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    })
    .then((response) => {
      if (response.status===200) {
        return response.json();
      } else {
        throw response;
      }
    })
    .then((responseJson) => {
      return responseJson;
    })
    .catch((error) => {
      return error;
    });
  }
  getCurrentAccount() {
    return this._request('/api/v1/accounts/verify_credentials');
  }
  getTimeline() {
    return this._request('/api/v1/timelines/home');
  }
}