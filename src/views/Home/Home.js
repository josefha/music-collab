import React, { useState, useEffect } from 'react';
import * as SpotifyWebApi from 'spotify-web-api-js';
import { Grommet, Box, Button, Heading, TextInput, Paragraph } from 'grommet';
import { Gamepad, Play, Next, Previous, Pause } from 'grommet-icons';

export default () => {
    document.title = "music-collab beta"
    const token = process.env.GATSBY_SPOTIFY_TOKEN
    let spotifyApi = new SpotifyWebApi()
    spotifyApi.setAccessToken(token)

    const [searchQueary, setsearchQueary] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    var prev = null
    const onChange = event => {
        let queryTerm = event.target.value
        setsearchQueary(queryTerm);
        // abort previous request, if any
        if (prev !== null) {
            prev.abort();
        }
        // store the current promise in case we need to abort it
        prev = spotifyApi.searchTracks(queryTerm, { limit: 10 });
        prev.then(function (data) {
            // clean the promise so it doesn't call abort
            prev = null;
            // ...render list of search results...
            setSearchResults(data.tracks.items)
        }, function (err) {
            console.error(err);
        });

    }

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
        return (
            <Box style={{ margin: '10px' }} direction='column' flex>
                {
                    searchResults.map((song) =>
                        <Box style={{ margin: '8px 0' }} direction='row'>
                            <Button size="small" primary icon={<Play />} onClick={() => playSong(song)} />
                            <Paragraph style={{ paddingLeft: '10px' }}>{song.name}</Paragraph>
                        </Box>)
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

    const playSong = (song) => {
        let uri = song.uri
        console.log(uri)
        spotifyApi.play({ uris: [uri] }).then(function (data) {
            console.log('playback', data);
        }, function (err) {
            console.error(err);
        });
    }

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
    });

    return (
        <Grommet themeMode="dark">
            <Box fill>
                <AppBar >
                    <Heading level='3' margin='none'>Music Collab</Heading>
                    <Button icon={<Gamepad />} onClick={() => { }} />
                </AppBar>
                <Box style={{ margin: '20px' }} direction='column' flex overflow={{ horizontal: 'hidden' }}>
                    <Box style={{ minHeight: '500px' }} flex align='start' justify='center'>
                        <TextInput value={searchQueary} onChange={onChange} />
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