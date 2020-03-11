import React, { useState, useContext, useEffect } from 'react';
import * as SpotifyWebApi from 'spotify-web-api-js';
import { Box, Button, Heading, TextInput, Paragraph, RadioButtonGroup } from 'grommet';
import { Gremlin, Send } from 'grommet-icons';
import { navigate } from 'gatsby';
import AppBar from '../../common/components/AppBar'
import AppWrapper from '../../common/components/AppWrapper'
import { FirebaseContext } from "gatsby-plugin-firebase"
import { GlobalStateContext } from '../../common/context/GlobalContextProvider'
import sendSong1 from '../../common/api/spotify/sendSong'


export default () => {
    const token = process.env.GATSBY_SPOTIFY_TOKEN
    let spotifyApi = new SpotifyWebApi()
    spotifyApi.setAccessToken(token)

    const state = useContext(GlobalStateContext) || { roomId: "" };


    const [clientState, setClientState] = useState({name: "Alex",
    searchCategory: "Song",
    searchQuery: "",
    searchResults:[],
    topSongs:[],
  })

    const firebase = useContext(FirebaseContext)

    useEffect(() => {
      if(clientState.topSongs.length > 0){
        renderTopSongs(clientState.topSongs);
      }

    },[clientState.topSongs])

    var prev = null
    const onChange = event => {
        let queryTerm = event.target.value
        setClientState({...clientState, searchQuery:queryTerm});
        // abort previous request, if any
        if (prev !== null) {
            prev.abort();
        }

        if(clientState.searchCategory === 'Song'){
          prev = spotifyApi.searchTracks(queryTerm, { limit: 10 });
        }else if(clientState.searchCategory === 'Artist'){
          prev = spotifyApi.searchArtists(queryTerm, {limit:10});
        }

        prev.then(function (data) {
            // clean the promise so it doesn't call abort
            prev = null;
            // ...render list of search results...
            if(data && data.tracks && data.tracks.items){
              setClientState({...clientState, searchResults: data.tracks.items});
            }else{
              setClientState({...clientState, searchResults: data.artists.items});
            }

        }, function (err) {
            console.error(err);
        });

    }

    const renderTopSongs = (topSongs) => {
      console.log("renderTopSongs", topSongs);
      return(    <Box style={{ margin: '10px' }} direction='column' flex>
                {
                    clientState.searchResults.map((song, key) =>
                        <Box style={{ margin: '8px 0' }} direction='row' key={key}>
                            <Button size="small" primary icon={<Send />} onClick={() => sendSong(song)} />
                            <Paragraph style={{ paddingLeft: '10px' }}>{song.name}</Paragraph>
                        </Box>)
                }
            </Box>)


    }

    const showTopSongs = (artist) => {
      navigate('/artist', {state: {data: artist}});
    }

    const sendSong = (song) => {
        let postData = {
            sentBy: clientState.name,
            title: song.name,
            uri: song.uri,
            external_url: song.external_urls.spotify,
        }

        sendSong1(postData,state.roomId,firebase)

    }

    const SongList = () => {
        return (
            <Box style={{ margin: '10px' }} direction='column' flex>
                {
                    clientState.searchResults.map((song, key) =>
                        <Box style={{ margin: '8px 0' }} direction='row' key={key}>
                            <Button size="small" primary icon={<Send />} onClick={() => sendSong(song)} />
                            <Paragraph style={{ paddingLeft: '10px' }}>{song.name}</Paragraph>
                        </Box>)
                }
            </Box>
        )
    }

    const ArtistList = () => {
      return (
            <Box style={{ margin: '10px' }} direction='column' flex>
                {
                    clientState.searchResults.map((artist, key) =>
                        <Box style={{ margin: '8px 0' }} direction='row' key={key}>
                            <Button size="small" primary icon={<Send />} onClick={() => showTopSongs(artist)} />
                            <Paragraph style={{ paddingLeft: '10px' }}>{artist.name}</Paragraph>
                        </Box>)
                }
            </Box>
      );
    }

    const handleSearchCategory = (event) => {
      if(event.target.value === 'Artist'){
        setClientState({...clientState, searchCategory: "Artist"});
      }else if(event.target.value ==='Song'){
        setClientState({...clientState, searchCategory: "Song"});
      }
    }



    return (
        <AppWrapper>
            <AppBar >
                <Heading level='3' margin='none'>Send songs to {state.roomId}</Heading>
                <Button icon={<Gremlin />} onClick={() => { navigate('/') }} />
            </AppBar>
            <Box style={{ margin: '20px' }} direction='column' flex overflow={{ horizontal: 'hidden' }}>
                <Box style={{ minHeight: '500px' }} flex align='start' justify='center'>
                  <RadioButtonGroup
                    name="searchByX"
                    options={["Artist", "Song"]}
                    value={clientState.searchCategory}
                    onChange={handleSearchCategory}
                  />
                    <TextInput value={clientState.searchQueary} onChange={onChange} />
                    {clientState.searchCategory === 'Song' ? <SongList /> : <ArtistList/> }
                </Box>
            </Box>
        </AppWrapper >
    )
}
