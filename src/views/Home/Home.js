import React, { useState, useEffect } from 'react';
import * as SpotifyWebApi from 'spotify-web-api-js';

export default () => {
    document.title = "music-collab beta"
    const token = process.env.GATSBY_SPOTIFY_TOKEN
    let spotifyApi = new SpotifyWebApi()
    spotifyApi.setAccessToken(token)


    // spotifyApi.pause().then(function (data) {
    //     console.log('User playlists', data);
    // }, function (err) {
    //     console.error(err);
    // });

    // spotifyApi.skipToNext().then(function (data) {
    //     console.log('User playlists', data);
    // }, function (err) {
    //     console.error(err);
    // });

    // spotifyApi.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE', function (err, data) {
    //     if (err) console.error(err);
    //     else console.log('Artist albums', data);
    // });

    // spotifyApi.getUserPlaylists('2020')
    //     .then(function (data) {
    //         console.log('User playlists', data);
    //     }, function (err) {
    //         console.error(err);
    //     });

    spotifyApi.getUserPlaylists()  // note that we don't pass a user id
        .then(function (data) {
            console.log('User playlists', data);
        }, function (err) {
            console.error(err);
        });

    useEffect(() => {
        console.log("YES")

    });

    return (<div>Hello welcome to music-collab!</div>)
} 