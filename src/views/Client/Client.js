import React, { useState, useEffect } from 'react';
import * as SpotifyWebApi from 'spotify-web-api-js';
import { Grommet, Box, Button, Heading, TextInput, Paragraph } from 'grommet';
import { Gamepad, Send } from 'grommet-icons';
import { navigate } from 'gatsby';
import AppBar from '../../common/components/AppBar'

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

    const sendSong = (song) => {
        console.log(song)
    }

    const SongList = () => {
        return (
            <Box style={{ margin: '10px' }} direction='column' flex>
                {
                    searchResults.map((song) =>
                        <Box style={{ margin: '8px 0' }} direction='row'>
                            <Button size="small" primary icon={<Send />} onClick={() => sendSong(song)} />
                            <Paragraph style={{ paddingLeft: '10px' }}>{song.name}</Paragraph>
                        </Box>)
                }
            </Box>
        )

    }



    return (
        <Grommet themeMode="dark">
            <Box fill>
                <AppBar >
                    <Heading level='3' margin='none'>Music Collab - Client</Heading>
                    <Button icon={<Gamepad />} onClick={() => { navigate('/') }} />
                </AppBar>
                <Box style={{ margin: '20px' }} direction='column' flex overflow={{ horizontal: 'hidden' }}>
                    <Box style={{ minHeight: '500px' }} flex align='start' justify='center'>
                        <TextInput value={searchQueary} onChange={onChange} />
                        <SongList />
                    </Box>
                </Box>
            </Box >
        </Grommet >)
} 