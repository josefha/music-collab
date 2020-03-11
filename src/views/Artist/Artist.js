import React, {useEffect, useState, useContext} from "react";
import * as SpotifyWebApi from "spotify-web-api-js";
import {Box,Button, Paragraph} from "grommet";
import { Gremlin, Play } from 'grommet-icons';
import styles from './artist.module.css';
import sendSong1 from '../../common/api/spotify/sendSong'
import { FirebaseContext } from "gatsby-plugin-firebase"
import { GlobalStateContext } from '../../common/context/GlobalContextProvider'


export default ({artist}) => {
	const [artistState, setArtistState] = useState({
		name: "",
		topTracks: [],
		artist : {}
	});
	useEffect(() => {
		if(artist){
			setArtistState({...artistState, artist:artist.location.state.data});
		}
	}, []);

	useEffect(() => {
		if(artistState.artist){
			getTopTracks();
		}

	},[artistState])

  const state = useContext(GlobalStateContext) || { roomId: "" };

	const firebase = useContext(FirebaseContext)

	// Get token
	const token = process.env.GATSBY_SPOTIFY_TOKEN;
	let spotifyApi = new SpotifyWebApi();
	spotifyApi.setAccessToken(token);

	const getTopTracks = () => {
		console.log("getTop", artistState);
		const artistId = artistState.artist.id;
		const topSongs = spotifyApi.getArtistTopTracks(artistId, "SE", {
			limit: 10
		});

		topSongs.then(
			function(data) {
				setArtistState({
					name: artistState.artist.name,
					topTracks: data.tracks
				});
			},
			function(err) {
				console.log(err);
			}
		);
	};

	const sendSong = (song) => {
		const postData= {
			sentBy: 'Alex',
			title: song.name,
			uri: song.uri,
			external_url: song.external_urls.spotify
		}
		sendSong1(postData,state.roomId, firebase);
	}

	const renderTopSongs = () => {
		return (
			<>
			<h2>TopSongs</h2>
				{artistState.topTracks.map((song, key) =>
					(<Box direction="row" key={key} className={styles.topSongContainer}>
					<Button size="small" primary icon={<Play />} onClick={() => sendSong(song)} />
					<Paragraph className={styles.songName}>{song.name}</Paragraph>
					</Box>
				))}
			</>
		);
	};

	return (
		<div>
			<Box direction="column" flex>
				<h2> {artistState.name} </h2>
				<Box style={{margin: "20px"}} gap="xsmall">
				{renderTopSongs()}
				</Box>
			</Box>
		</div>
	);
};
