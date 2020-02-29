import React, { useState, useContext } from 'react';
import * as SpotifyWebApi from 'spotify-web-api-js';
import { Box, Button, Heading, TextInput, Paragraph } from 'grommet';
import { Gremlin, Send } from 'grommet-icons';
import { navigate } from 'gatsby';
import AppBar from '../../common/components/AppBar'
import AppWrapper from '../../common/components/AppWrapper'
import { FirebaseContext } from "gatsby-plugin-firebase"
import { Context } from '../../common/components/State/Store'

export default () => {
    const token = process.env.GATSBY_SPOTIFY_TOKEN
    let spotifyApi = new SpotifyWebApi()
    spotifyApi.setAccessToken(token)

    const [state, dispatch] = useContext(Context);

    const [name, setName] = useState("Alex");

    const [searchQueary, setsearchQueary] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    const firebase = useContext(FirebaseContext)

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
        let postData = {
            sentBy: name,
            title: song.name,
            uri: song.uri,
            external_url: song.external_urls.spotify,
        }

        let newSongKey = firebase.database().ref().child('room').push().key;
        let updates = {};
        updates['/room/' + state.roomId + '/' + newSongKey] = postData;

        firebase.database().ref().update(updates);
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
        <AppWrapper>
            <AppBar >
                <Heading level='3' margin='none'>Send songs to {state.roomId}</Heading>
                <Button icon={<Gremlin />} onClick={() => { navigate('/') }} />
            </AppBar>
            <Box style={{ margin: '20px' }} direction='column' flex overflow={{ horizontal: 'hidden' }}>
                <Box style={{ minHeight: '500px' }} flex align='start' justify='center'>
                    <TextInput value={searchQueary} onChange={onChange} />
                    <SongList />
                </Box>
            </Box>
        </AppWrapper >
    )
} 