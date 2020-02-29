const Reducer = (state, action) => {
    switch (action.type) {
        case 'SET_ROOM_ID': {
            return {
                ...state,
                roomId: action.payload
            };
        }
        default:
            return state;
    }
};

export default Reducer;