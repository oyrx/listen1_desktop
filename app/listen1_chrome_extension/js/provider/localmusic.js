function build_localmusic() {
    const defaultLocalMusicPlaylist = {
      tracks:[],
      info:{
        id: "lmplaylist_reserve",
        cover_img_url: "images/mycover.jpg",
        title: "本地音乐",
        source_url: ``,
      }
    };
    function lm_show_playlist(url, hm) {
      return {
        success(fn) {
            return fn({
              result:[],
            });
        },
      };
    }
  
    function lm_get_playlist(url, hm, se) {
      const list_id = getParameterByName('list_id', url);
      return {
        success(fn) {
          var playlist = localStorage.getObject(list_id);
  
          if (playlist===null || playlist ===undefined){
            playlist = defaultLocalMusicPlaylist;
          }
          fn(playlist);
        },
      };
    }
  
    
    function lm_album(url, hm, se) {
      const album = getParameterByName('list_id', url).split('_').pop();
      return {
        success(fn) {
          const list_id = 'lmplaylist_reserve';
          var playlist = localStorage.getObject(list_id);
  
          if (playlist===null || playlist ===undefined){
            playlist = JSON.parse(JSON.stringify(defaultLocalMusicPlaylist));
            playlist.info.title = album;
          }
          else {
            playlist.info.title = album;
            playlist.tracks = playlist.tracks.filter(tr=>tr.album===album);
          }
          fn(playlist);
        },
      };
    }
    function lm_artist(url, hm, se) {
      const artist = getParameterByName('list_id', url).split('_').pop();
      return {
        success(fn) {
          const list_id = 'lmplaylist_reserve';
          var playlist = localStorage.getObject(list_id);
  
          if (playlist===null || playlist ===undefined){
            playlist = JSON.parse(JSON.stringify(defaultLocalMusicPlaylist));
            playlist.info.title = artist;
          }
          else {
            playlist.info.title = artist;
            playlist.tracks = playlist.tracks.filter(tr=>tr.artist===artist);
          }
          fn(playlist);
        },
      };
    }
    function lm_bootstrap_track(sound, track, success, failure, hm, se) {
      sound.url = track.sound_url;
      success();
    }
  
    function lm_search(url, hm, se) {
      const searchType = getParameterByName('type', url);
      return {
        success(fn) {   
            return fn({
              result: [],
              total: 0,
              type: searchType
            });
        }
      };
    }
  
    function lm_lyric(url, hm, se) {
      return {
        success(fn){
          return fn({
            lyric: "",
            tlyric: ""
          });
        }
      };
    }
  
    function lm_add_playlist(list_id, tracks) {
      let playlist = localStorage.getObject(list_id);
      if (playlist === null) {
        playlist =  JSON.parse(JSON.stringify(defaultLocalMusicPlaylist));
      }
      const tracksIdSet = {};
      tracks.forEach(tr=>{
        tracksIdSet[tr.id] = true;
      })
      playlist.tracks = tracks.concat(playlist.tracks.filter(tr=>tracksIdSet[tr.id]!==true));
      localStorage.setObject(list_id, playlist);
  
      return {
        success(fn){
          return fn({list_id, playlist
          });
        }
      };
    }
  
    function lm_parse_url(url) {
      let result;
      return result;
    }
  
    function get_playlist(url, hm, se) {
      const list_id = getParameterByName('list_id', url).split('_')[0];
      switch (list_id) {
        case 'lmplaylist':
          return lm_get_playlist(url, hm, se);
        case 'lmartist':
          return lm_artist(url, hm, se);
        case 'lmalbum':
          return lm_album(url, hm, se);
        default:
          return null;
      }
    }
  
    function lm_remove_from_playlist(list_id, track_id){
      const playlist = localStorage.getObject(list_id);
      if (playlist == null) {
        return;
      }
      const newtracks = playlist.tracks.filter(item => item.id !== track_id);
      playlist.tracks = newtracks;
      localStorage.setObject(list_id, playlist);
  
      return {
        success(fn){
          return fn();
        }
      };
    }
  
    return {
      show_playlist: lm_show_playlist,
      get_playlist,
      parse_url: lm_parse_url,
      bootstrap_track: lm_bootstrap_track,
      search: lm_search,
      lyric: lm_lyric,
      add_playlist: lm_add_playlist,
      remove_from_playlist: lm_remove_from_playlist
    };
  }
  
  const localmusic = build_localmusic(); // eslint-disable-line no-unused-vars
    