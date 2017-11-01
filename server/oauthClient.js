/*
Copyright 2017 Globo.com

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

const oauthClientId = process.env.OAUTH_CLIENT_ID
const oauthClientSecret = process.env.OAUTH_CLIENT_SECRET
const oauthTokenUrl = process.env.OAUTH_TOKEN_URL
const oauthAuthorizeUrl = process.env.OAUTH_AUTHORIZE_URL
const oauthRedirectUrl = process.env.OAUTH_REDIRECT_URL

const ClientOAuth2 = require('client-oauth2')

var oauthClient = new ClientOAuth2({
    clientId: oauthClientId,
    clientSecret: oauthClientSecret,
    accessTokenUri: oauthTokenUrl,
    authorizationUri: oauthAuthorizeUrl,
    redirectUri: oauthRedirectUrl,
    scopes: []
})

oauthClient.isAuthenticated = (session, callback) => {
    token = oauthClient.createToken(session.tokenData)

    if(token.expired()){
        token.refresh().then((updatedToken) => {
            if(updatedToken !== token){
                session.tokenData = updatedToken.data
                session.save()
            } 
            callback(true)
        }).catch((e) => {
            console.error("[Auth] Error refreshing expired token")
            console.log(e); 
            callback(false)
        })
    }else{
        callback(true)
    }
}

module.exports = oauthClient