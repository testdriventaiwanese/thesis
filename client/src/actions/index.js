import { hashHistory } from 'react-router';
import axios from 'axios';
import APIKEYS from './APIKEYS';

export const SEARCH_EVENTS = 'SEARCH_EVENTS';
export const EVENT_SELECTED = 'EVENT_SELECTED';
export const SAVE_EVENT = 'SAVE_EVENT';
export const SAVE_ARTIST = 'SAVE_ARTIST';
export const GET_EVENTS = 'GET_EVENTS';
export const FRIENDS_EVENTS = 'FRIENDS_EVENTS';
export const GET_ARTISTS = 'GET_ARTISTS';
export const GET_USERINFO = 'GET_USERINFO';
export const SIGN_UP = 'SIGN_UP';
export const LOG_IN = 'LOG_IN';
export const REMOVE_EVENT = 'REMOVE_EVENT';
export const SEARCH_ARTISTS = 'SEARCH_ARTISTS';
export const SEARCH_USERS = 'SEARCH_USERS';
export const UNFOLLOW = 'UNFOLLOW';
export const GET_FRIENDS = 'GET_FRIENDS';
export const GET_USER_EVENTS = 'GET_USER_EVENTS';
export const GET_ARTIST_CALENDAR = 'GET_ARTIST_CALENDAR';
export const REMOVE_ARTIST = 'REMOVE_ARTIST';
export const GET_EVENT_COMMENTS = 'GET_EVENT_COMMENTS';
export const GET_LOCAL_EVENTS = 'GET_LOCAL_EVENTS';

const TM_ROOT_URL = 'https://app.ticketmaster.com/discovery/v2/events.json?classificationName=Music&';
const config = {
  headers: { authHeader: localStorage.getItem('token') },
};

module.exports = {
  selectEvent(event) {
    return {
      type: EVENT_SELECTED,
      payload: event,
    };
  },
  searchEvents(query) {
    const url = `${TM_ROOT_URL}keyword=${query}&&apikey=${APIKEYS.TM}`;
    const request = axios.get(url);
    return {
      type: SEARCH_EVENTS,
      payload: request,
    };
  },
  saveEvent(event) {
    let eventObj;
    if (!event._embedded) {
      eventObj = {
        tm_id: event.id || null,
        name: event.name || null,
        date: event.dates.start.dateTime || null,
        event_url: event.url || null,
        sale_date: JSON.stringify(event.sales.public) || null,
      };
    } else {
      let latitude = null;
      let longitude = null;
      if (event._embedded.venues[0].location) {
        latitude = event._embedded.venues[0].location.latitude || null;
        longitude = event._embedded.venues[0].location.longitude || null;
      }
      eventObj = {
        tm_id: event.id || null,
        name: event.name || null,
        artist_name: JSON.stringify(event._embedded.attractions) || null,
        date: event.dates.start.dateTime || null,
        event_url: event.url || null,
        venue: () => (event._embedded.venues[0].name ? event._embedded.venues[0].name : null),
        venue_address: event._embedded.venues[0].address.line1 || null,
        city: event._embedded.venues[0].city.name || null,
        zipcode: event._embedded.venues[0].postalCode || null,
        image: event._embedded.attractions[0].images[3].url || null,
        genre: event.classifications[0].genre.name || null,
        subgenre: event.classifications[0].subGenre.name || null,
        latitude: latitude,
        longitude: longitude,
        country: event._embedded.venues[0].country.name || null,
        sale_date: JSON.stringify(event.sales.public) || null,
      };
    }
    axios.post('/api/events/addevent', eventObj, config)
    .then(() => {
      hashHistory.push('/');
    });
    return {
      type: SAVE_EVENT,
      payload: eventObj,
    };
  },
  saveArtist(bandsintown, songkick) {
    const artistObj = {
      mbid: songkick.identifier[0].mbid,
      name: songkick.displayName,
      image: bandsintown.image_url,
      events: songkick.uri,
      facebook: bandsintown.facebook_page_url,
      onTourUntil: songkick.onTourUntil,
      upcoming_events: bandsintown.upcoming_event_count,
    };
    axios.post('/api/artists/addartist', artistObj, config)
      .then(() => {
        hashHistory.push('/');
      });
    return {
      type: SAVE_ARTIST,
      payload: artistObj,
    };
  },
  removeEvent(tm_id, i) {
    const resultObj = {
      tm_id,
    };
    axios.post('/api/events/deleteevent', resultObj, config)
      .then(() => {
        hashHistory.replace('/');
      });
    return {
      type: REMOVE_EVENT,
      tm_id,
      i,
    };
  },
  removeArtist(artist_mbid, i) {
    const resultObj = {
      artist_mbid,
    };
    axios.post('/api/artists/deleteartist', resultObj, config)
      .then(() => {
        hashHistory.replace('/');
      });
    return {
      type: REMOVE_ARTIST,
      artist_mbid,
      i,
    };
  },
  getEvents() {
    const request = axios.get('/api/events/getAll', config)
      .catch(() => {
        return { data: [] };
      });
    return {
      type: GET_EVENTS,
      payload: request,
    };
  },
  getFriendsEvents() {
    const request = axios.get('/api/events/getfriendsevents', config)
      .catch(() => {
        return { data: [] };
      });
    return {
      type: FRIENDS_EVENTS,
      payload: request,
    };
  },
  getUserInfo() {
    const request = axios.get('/api/users/getinfo', config)
      .catch(() => {
        return { data: [] };
      });
    return {
      type: GET_USERINFO,
      payload: request,
    };
  },
  getFriends() {
    const getFriendsRequest = axios.get('/api/users/getfriends', config)
      .catch(() => {
        return { data: [] };
      });
    return {
      type: GET_FRIENDS,
      payload: getFriendsRequest,
    };
  },
  getArtists() {
    const request = axios.get('/api/artists/getall', config)
      .catch(() => {
        return { data: [] };
      });
    return {
      type: GET_ARTISTS,
      payload: request,
    };
  },
  searchUsers(userQuery) {
    const userQueryObj = {
      query: userQuery,
    };
    const searchUserResult = axios.post('/api/users/finduser', userQueryObj, config)
      .catch(() => { data: [] } );
    return {
      type: SEARCH_USERS,
      payload: searchUserResult,
    };
  },
  addFollower(userId) {
    const addFollowObj = {
      userId,
    };
    const addFollowerResult = axios.post('/api/users/addfollow', addFollowObj, config)
      .then(() => {
        hashHistory.push('/');
      })
      .catch(() => {
        return { data: [] };
      });
  },
  unfollow(userId, index) {
    const unfollowObj = {
      userId,
    };
    const unfollowResult = axios.post('/api/users/unfollow', unfollowObj, config);
    return {
      type: 'UNFOLLOW',
      userId,
      index,
    }
  },
  signUp(result) {
    const resultObj = {
      email: result.email,
      password: result.password,
      fullname: result.name,
    };
    axios.post('/auth/signup', resultObj);
    return {
      type: SIGN_UP,
      payload: resultObj,
    }
  },
  logIn(result) {
    const resultObj = {
      email: result.email,
      password: result.password,
    };
    axios.post('/auth/login', resultObj)
      .then((res) => {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('id', res.data.userId);
      })
      .then(() => {
        hashHistory.push('/');
      });

    return {
      type: LOG_IN,
      payload: resultObj,
    };
  },
  searchArtists(query) {
    const artistConfig = {
      headers: {
        authHeader: localStorage.getItem('token'),
        artist: query,
      },
    };
    const bandsintownArtistSearch = () => axios.get('/api/bandsintown/getartist', artistConfig);
    const songkickArtistSearch = () => axios.get('/api/songkick/getartist', artistConfig);
    return {
      type: SEARCH_ARTISTS,
      payload: axios.all([bandsintownArtistSearch(), songkickArtistSearch()])
      .then(axios.spread((bandsintown, songkick) => {
        return { bandsintown, songkick };
      }))
      .catch(() => {
        return { bandsintown: [], songkick: [] };
      }),
    };
  },
  searchNearby(google, map, request) {
    return new Promise((resolve, reject) => {
      const service = new google.maps.places.PlacesService(map);

      service.nearbySearch(request, (results, status, pagination) => {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          resolve(results, pagination);
        } else {
          reject(results, status);
        }
      });
    });
  },
  getUserEvents(user) {
    const userEventsConfig = {
      headers: {
        authHeader: localStorage.getItem('token'),
        userId: user.id,
        userInfo: user,
      },
    };
    const request = axios.get('/api/events/getuserevents', userEventsConfig)
    return {
      type: GET_USER_EVENTS,
      payload: request,
    }
  },
  getArtistCalendar(artist) {
    const getArtistConfig = {
      headers: {
        authHeader: localStorage.getItem('token'),
        mbid: artist.mbid,
      }
    };
    const request = axios.get('/api/songkick/getartistcalendar', getArtistConfig)
      .catch(() => {
        return { data: [] };
      });
    return {
      type: GET_ARTIST_CALENDAR,
      payload: request,
    };
  },
  addEventComment(eventId, userId, friendId, text) {
    let commentObj = {
      id_events: eventId,
      userId,
      friendId,
      text,
    }
    const addEventCommentConfig = {
      headers: {
        authheader: localStorage.getItem('token'),
        eventId,
        userId,
      },
    };
    const request = axios.post('/api/comments/addcomment', commentObj, addEventCommentConfig)
      .then(() => axios.get('/api/comments/getcomments', addEventCommentConfig));

    return {
      type: GET_EVENT_COMMENTS,
      payload: request,
    }
  },
  getEventComments(userId, eventId) {
    const getEventCommentsConfig = {
      headers: {
        authheader: localStorage.getItem('token'),
        eventId,
        userId,
      },
    };
    const request = axios.get('/api/comments/getcomments', getEventCommentsConfig);
    return {
      type: GET_EVENT_COMMENTS,
      payload: request,
    }
  },
  removeEventComment(comment) {
    const commentObj = {
      commentId: comment.id,
    };
    const removeEventCommentConfig = {
      headers: {
        authheader: localStorage.getItem('token'),
        eventId: comment.id_event,
        userId: comment.id_friend,
      },
    };
    const request = axios.post('/api/comments/removecomment', commentObj, removeEventCommentConfig)
      .then(() => axios.get('/api/comments/getcomments', removeEventCommentConfig));
    return {
      type: GET_EVENT_COMMENTS,
      payload: request,
    }
  },
  getLocation(query) {
    console.log('query:: ', query)
    console.log('query.latitude:: ', query.latitude)
    console.log('query.longitude:: ', query.longitude)
    const config = {
      headers: {
        authHeader: localStorage.getItem('token'),
        latitude: query.latitude,
        longitude: query.longitude,
      }
    }

    console.log('config:: ', config)

    return axios.get('/api/songkick/getlocation', config)
      .then((res) => {
        console.log('GET LOCATION RES:: ', res.data.resultsPage.results.location[0].metroArea.id);
        const metroId = res.data.resultsPage.results.location[0].metroArea.id
        return {
          type: metroId
        };
      });
    },
  getLocalEvents(id) {
    const config = {
      headers: {
        authHeader: localStorage.getItem('token'),
        id,
      }
    }
    const request = axios.get('/api/songkick/getlocalevents', config)
    .catch((res) => {
      console.log('GET LOCAL EVENTS RES:: ', res);
      return {}
    });

    return {
      type: GET_LOCAL_EVENTS,
      payload: request,
    }
  },
};
