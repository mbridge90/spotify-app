let accessToken ;
const clientID = "c14364ae1e67466d8feaa58eedbb1a5c";
const redirectURI = "https://mbridge90.surge.sh";

const Spotify = {

  getAccessToken() {
      if (accessToken) {
          return accessToken;
      }

      //check for access token match in url
      const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
      const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

      if (accessTokenMatch && expiresInMatch) {
          accessToken = accessTokenMatch[1];
          const expiresIn = Number(expiresInMatch[1]);
          window.setTimeout(() => accessToken = '', expiresIn * 1000);
          window.history.pushState('Access Token', null, '/');
          return this.getAccessToken();
      } else {
          window.location = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
      }
  },



   savePlaylist(playlistName, trackURIs) {
      if (!playlistName || !trackURIs.length) {
          return;
      }

      const userAccessToken = Spotify.getAccessToken();
      const headers = {
          Authorization: `Bearer ${userAccessToken}`
      }
      let userID;

      return fetch("https://api.spotify.com/v1/me", {headers: headers})
          .then(response => {return response.json()})
          .then(jsonResponse => {
              userID = jsonResponse.id;
              return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
                  headers: headers,
                  body: JSON.stringify({name: playlistName}),
                  method: "POST"
              })
                  .then(response => {
                      console.log(response);
                      return response.json()
                  })
                  .then(jsonResponse => {
                      console.log(jsonResponse);
                      let playlistID = jsonResponse.id;
                      console.log(playlistID);
                      return fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`,
                          {
                              headers: headers,
                              body: JSON.stringify({uris: trackURIs}),
                              method: "POST"
                          })
                          .then(response => {
                                  return response.json()
                              }
                          ).then(jsonResponse => {return playlistID = jsonResponse.id});
                  })
               })
      },

  async search(searchTerm) {

      const userAccessToken = await Spotify.getAccessToken();
      console.log(userAccessToken);

      return fetch(`https://api.spotify.com/v1/search?type=track&q=${searchTerm}`,
          {headers: {
              Authorization: `Bearer ${userAccessToken}`
          }}
          ).then(response => {
              return response.json()}
              ).then(jsonResponse => {
                  console.log(jsonResponse);
                  if (!jsonResponse.tracks) {
                return [];
         } else {
          return jsonResponse.tracks.items.map(track => {
              return {
                  id: track.id,
                  name: track.name,
                  artist: track.artists[0].name,
                  album: track.album.name,
                  uri: track.uri
              }
          })
      }
      });
      }
}

export default Spotify;