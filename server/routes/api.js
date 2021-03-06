const express = require('express');
const userController = require('../user/userController');
const eventController = require('../event/eventController');
const artistsController = require('../artists/artistsController');
const commentsController = require('../comments/commentsController');
const bandsintown = require('../API/bandsInTown');
const songkick = require('../API/songkick');
const ticketmaster = require('../API/ticketmaster');
const distance = require('../API/distance');

const router = new express.Router();

// user calls
router.post('/users/addfollow', userController.addfollow);
router.post('/users/unfollow', userController.unfollow);
router.post('/users/changepassword', userController.changepassword);
router.get('/users/getall', userController.getAll);
router.get('/users/getinfo', userController.getInfo);
router.get('/users/getotherinfo', userController.getOtherInfo);
router.get('/users/getfriends', userController.getFriends);
router.get('/users/getotherfriends', userController.getOtherFriends);
router.post('/users/finduser', userController.findUser);

// event calls
router.get('/events/getall', eventController.getUserEvents);
router.get('/events/getuserevents', eventController.getOtherUserEvents);
router.get('/events/getfriendsevents', eventController.getFriendsEvents);
router.post('/events/addevent', eventController.addEvent);
router.post('/events/deleteevent', eventController.deleteEvent);

// comment calls
router.get('/comments/getcomments', commentsController.getComments);
router.post('/comments/addcomment', commentsController.addComment);
router.post('/comments/removecomment', commentsController.removeComment);

// artist calls
router.get('/artists/getall', artistsController.getUserArtists);
router.post('/artists/addartist', artistsController.addArtist);
router.post('/artists/deleteartist', artistsController.deleteArtist);

// bandsintown api call
router.get('/bandsintown/getartist', bandsintown.getArtist);

// songkick api call
router.get('/songkick/getartist', songkick.getArtist);
router.get('/songkick/getartistcalendar', songkick.getArtistCalendar);
router.get('/songkick/getlocalevents', songkick.getLocalEvents);
router.get('/songkick/getlocation', songkick.getLocation);

// ticketmaster api call
router.get('/ticketmaster/searchticketmaster', ticketmaster.searchTicketmaster);

// googlemapsmatrix api call
router.post('/distance/getdistanceinfo', distance.getDistanceInfo);

module.exports = router;
