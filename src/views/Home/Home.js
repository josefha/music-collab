import React, { useState, useContext } from 'react';
import { Box, Button, Heading, TextInput, Paragraph } from 'grommet';
import { Apps } from 'grommet-icons';
import { navigate } from 'gatsby';
import AppBar from '../../common/components/AppBar'
import AppWrapper from '../../common/components/AppWrapper'
import { Context } from '../../common/components/State/Store'


export default () => {
    const [state, dispatch] = useContext(Context);

    const [roomId, setroomId] = useState("TEST01");
    const [name, setName] = useState("Alex");

    const [code, setCode] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    const joinRoom = () => {
        console.log("Joiing")
        dispatch({ type: 'SET_ROOM_ID', payload: "TEST02" })
        navigate('/client')
    }

    return (
        <AppWrapper>
            <AppBar >
                <Heading level='3' margin='none'> Music Collab </Heading>
                <Button icon={<Apps />} onClick={() => { navigate('/') }} />
            </AppBar>
            <Box style={{ margin: '20px' }} direction='column' flex overflow={{ horizontal: 'hidden' }}>
                <Box justify='center'>
                    <h2>Join with code</h2>
                    <TextInput
                        style={{ margin: '0 0 15px 0' }}
                        value={code} onChange={(e) => setCode(e.target.value)} />
                    <Button style={{ maxWidth: '350px', margin: "5px" }} primary label="Join" onClick={() => joinRoom()} />
                    <Button style={{ maxWidth: '350px', margin: "5px" }} label="Or Create New Player" onClick={() => navigate('/play')} />
                </Box>
            </Box>
        </AppWrapper >
    )
} 