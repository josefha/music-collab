import React, { useState, useEffect, useContext } from 'react';
import * as SpotifyWebApi from 'spotify-web-api-js';
import AppBar from '../../common/components/AppBar'
import AppWrapper from '../../common/components/AppWrapper'
import { Box, Button, Heading, TextInput, Paragraph } from 'grommet';
import { Gamepad, Play, Next, Previous, Pause, Inbox, Home, Clear, Spotify } from 'grommet-icons';
import { FirebaseContext } from "gatsby-plugin-firebase"
import { GlobalStateContext } from '../../common/context/GlobalContextProvider'
import { navigate } from 'gatsby';


export default () => {
    const token = process.env.GATSBY_SPOTIFY_TOKEN
    let spotifyApi = new SpotifyWebApi()
    spotifyApi.setAccessToken(token)

    const firebase = React.useContext(FirebaseContext)
    const state = useContext(GlobalStateContext) || { roomId: "" };

    const [searchQueary, setsearchQueary] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [inboxResults, setinboxResults] = useState([]);
    const [pageIndex, setPageIndex] = useState(0);

    useEffect(() => {
        if (!firebase) {
            return
        }
        LisenOnInbox()
    }, [firebase])

    const LisenOnInbox = () => {
        var inboxRef = firebase.database().ref('room/' + state.roomId);
        inboxRef.on('value', function (snapshot) {
            updateInbox(snapshot.val());
        });
    }

    const updateInbox = (songs) => {
        if (songs) {
            setinboxResults(Object.values(songs))
        } else {
            setinboxResults([])
        }
    }

    const OpenInSpotify = (song) => {
        var win = window.open(song.external_url, '_blank');
        win.focus();
    }

    const InboxSongList = (props) => {
        let songs = props.songs ? props.songs : []
        return (
            <Box style={{ margin: '10px' }} direction='column' flex>
                {
                    songs.map((song) =>
                        <Box
                            index={song.uri}
                            style={{ margin: '8px 0' }} direction='row'>
                            <Button size="small" primary icon={<Play />} onClick={() => playSong(song)} />
                            <Button style={{ marginLeft: '5px' }} size="small" primary icon={<Spotify />} onClick={() => OpenInSpotify(song)} />
                            <Paragraph style={{ paddingLeft: '10px' }}>{song.sentBy} want you to play <b>{song.title}</b></Paragraph>
                        </Box>)
                }
            </Box>
        )
    }

    const clearInbox = () => {
        firebase.database().ref('room/' + state.roomId).remove()
    }


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

    const playSong = (song) => {
        let uri = song.uri
        console.log(uri)
        spotifyApi.play({ uris: [uri] }).then(function (data) {
            console.log('playback', data);
        }, function (err) {
            console.error(err);
        });
    }

    const SongList = (props) => {
        return (
            <Box style={{ margin: '10px' }} direction='column' flex>
                {
                    props.songs.map((song) =>
                        <Box style={{ margin: '8px 0' }} direction='row'>
                            <Button size="small" primary icon={<Play />} onClick={() => playSong(song)} />
                            <Paragraph style={{ paddingLeft: '10px' }}>{song.name}</Paragraph>
                        </Box>)
                }
            </Box>
        )
    }

    return (
        <AppWrapper>
            <AppBar >
                <Heading level='3' margin='none'>Music Collab: {state.roomId}</Heading>
                <span>
                    {pageIndex === 0 ?
                        <Button icon={<Inbox />} onClick={() => { setPageIndex(1) }} />
                        :
                        <span>
                            <Button icon={<Clear />} onClick={() => clearInbox()} />
                            <Button icon={<Home />} onClick={() => setPageIndex(0)} />
                        </span>}
                </span>
            </AppBar>
            <Box style={{ margin: '20px' }} direction='column' flex overflow={{ horizontal: 'hidden' }}>
                <Box style={{ minHeight: '500px' }} flex align='start' justify='center'>
                    {pageIndex === 0 ?
                        <>
                            <TextInput value={searchQueary} onChange={onChange} />
                            <SongList songs={searchResults} />
                        </> :
                        <>
                            <h3> Your friends recomendations: </h3>
                            <InboxSongList songs={inboxResults} />
                        </>}
                </Box>
                <Box direction='row' flex align='center' justify='center'>
                    <Button primary icon={<Previous />} onClick={() => prevSong()} />
                    <Button style={{ marginLeft: '5px' }} primary icon={<Pause />} onClick={() => pause()} />
                    <Button style={{ marginLeft: '5px' }} primary icon={<Play />} onClick={() => play()} />
                    <Button style={{ marginLeft: '5px' }} primary icon={<Next />} onClick={() => nextSong()} />
                </Box>
            </Box>
        </AppWrapper>)
} 