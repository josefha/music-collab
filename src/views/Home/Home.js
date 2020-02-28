import React, { useState, useEffect } from 'react';
import * as SpotifyWebApi from 'spotify-web-api-js';
import { Grommet, Box, Button, Heading, List } from 'grommet';
import { Gamepad, Play, Next, Previous, Pause } from 'grommet-icons';

export default () => {
    document.title = "music-collab beta"
    const token = process.env.GATSBY_SPOTIFY_TOKEN
    let spotifyApi = new SpotifyWebApi()
    spotifyApi.setAccessToken(token)

    const AppBar = (props) => (
        <Box
            tag='header'
            direction='row'
            align='center'
            justify='between'
            background='brand'
            pad={{ left: 'medium', right: 'small', vertical: 'small' }}
            elevation='medium'
            style={{ zIndex: '1' }}
            {...props}
        />
    );

    const IncomingSong = () => {
        const data =
            [{ title: 'Levels', artist: 'Avacci', sentBy: 'Alex' },
            { title: 'PIMP', artist: '50cent', sentBy: 'Josef' },
            { title: 'Levels', artist: 'Avacci', sentBy: 'Martin' }]

        return (
            <Box direction='column' flex>
                {
                    data.map((song) => <Box >{song.title + " - " + song.artist + '    | From ' + song.sentBy} </Box>)
                }
            </Box>
        )

    }


    const theme = {
        global: {
            font: {
                family: 'Roboto',
                size: '18px',
                height: '20px',
            },
        },
    };






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

    // spotifyApi.getUserPlaylists()  // note that we don't pass a user id
    //     .then(function (data) {
    //         console.log('User playlists', data);
    //     }, function (err) {
    //         console.error(err);
    //     });

    const play = () => {
        spotifyApi.play().then(function (data) {
            console.log('User playlists', data);
        }, function (err) {
            console.error(err);
        });
    }

    const nextSong = () => {
        spotifyApi.skipToNext().then(function (data) {
            console.log('User playlists', data);
        }, function (err) {
            console.error(err);
        });
    }

    const pause = () => {
        spotifyApi.pause().then(function (data) {
            console.log('User playlists', data);
        }, function (err) {
            console.error(err);
        });
    }

    const prevSong = () => {
        spotifyApi.skipToPrevious().then(function (data) {
            console.log('User playlists', data);
        }, function (err) {
            console.error(err);
        });
    }

    useEffect(() => {
        console.log("YES")
    });



    return (
        <Grommet themeMode="dark">
            <Box fill>
                <AppBar >
                    <Heading level='3' margin='none'>Music Collab</Heading>
                    <Button icon={<Gamepad />} onClick={() => { }} />
                </AppBar>

                <Box style={{ margin: '20px' }} direction='column' flex overflow={{ horizontal: 'hidden' }}>
                    <Box style={{ minHeight: '500px' }} flex align='center' justify='center'>
                        <IncomingSong />
                    </Box>
                    <Box direction='row' flex align='center' justify='center'>
                        <Button primary icon={<Previous />} onClick={() => prevSong()} />
                        <Button primary icon={<Pause />} onClick={() => pause()} />
                        <Button primary icon={<Play />} onClick={() => play()} />
                        <Button primary icon={<Next />} onClick={() => nextSong()} />
                    </Box>
                </Box>
            </Box >
        </Grommet >)
} 