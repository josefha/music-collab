/*
data = {
            sentBy: string (user.name),
            title: string (song.title),
            uri: string (song.uri),
            external_url: string (song.external_urls.spotify),
        }
*/
/*
firebase : FirebaseContext
*/

const sendSong = (data,roomID, firebase) => {
  console.log("data:",data,roomID,firebase);
  let newSongKey = firebase.database().ref().child('room').push().key;
  let updates = {};
  updates['/room/' + roomID + '/' + newSongKey] = data;

  firebase.database().ref().update(updates);
}

export default sendSong;
