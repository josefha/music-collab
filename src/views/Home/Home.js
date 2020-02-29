import React, { useState, useContext } from 'react';
import { Box, Button, Heading, TextInput, Paragraph } from 'grommet';
import { Apps } from 'grommet-icons';
import { navigate } from 'gatsby';
import AppBar from '../../common/components/AppBar'
import AppWrapper from '../../common/components/AppWrapper'
import { Context } from '../../common/components/State/Store'
import { GlobalStateContext, GlobalDispatchContext } from '../../common/context/GlobalContextProvider'


export default () => {
    const dispatch = useContext(GlobalDispatchContext);
    const [code, setCode] = useState("");

    const joinRoom = () => {
        dispatch({ type: 'SET_ROOM_ID', payload: code })
        navigate('/client')
    }

    const createRoom = () => {
        dispatch({ type: 'SET_ROOM_ID', payload: makeid(4) })
        navigate('/play')
    }

    const makeid = (length) => {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
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
                    <Button style={{ maxWidth: '350px', margin: "5px" }} label="Or Create New Player" onClick={() => createRoom()} />
                </Box>
            </Box>
        </AppWrapper >
    )
} 