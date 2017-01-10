import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import IconMenu from 'material-ui/IconMenu';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import { Link } from 'react-router';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Snackbar from 'material-ui/Snackbar';
import moment from 'moment';
import { getLocation, removeEvent, getUserEvents, getDistanceInfo } from '../actions/index';
import { GoogleApiWrapper, Marker} from 'google-maps-react';
import ReactDOM from 'react-dom';


class Map extends React.Component {
  componentDidMount() {
    setTimeout(() => {
      this.loadMap();
    }, 300)
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.google !== this.props.google) {
      this.loadMap();
    }
  }
  loadMap() {
    let travelInfo;
    const { google } = this.props;
    if (!this.props.event.events[0]) {
      return <div>Event Not Listed</div>;
    }
    const eventArr = this.props.event.events.filter((event) => {
      return event.id === Number(this.props.params.eventId);
    });
    const eventLatLng = {
      latitude: Number(eventArr[0].latitude),
      longitude: Number(eventArr[0].longitude),
    }
    if (this.props && this.props.google) {
      const { google } = this.props;
      const maps = google.maps;
      const mapRef = this.refs.map;
      const node = ReactDOM.findDOMNode(mapRef);
      let crd;
      const position = navigator.geolocation.getCurrentPosition((pos) => {
        const zoom = 2;
        crd = pos.coords;

        console.log('this is a test:: ', eventLatLng)
        const locations = [[crd.latitude, crd.longitude], [eventLatLng.latitude, eventLatLng.longitude]]
        const eventMarker = new maps.Marker({
            position: new maps.LatLng(eventLatLng.latitude, eventLatLng.longitude),
            map: mapRef,
          })
        const userLocation = new maps.LatLng(crd.latitude, crd.longitude)

        const bound = new google.maps.LatLngBounds();


        console.log('locations:: ', locations)
        locations.forEach((val, i) => {
          bound.extend(new google.maps.LatLng(val[0], val[1]));
        });

        console.log('boundGetCenteR:: ', bound);
        const mapConfig = Object.assign({}, {
          center: bound.getCenter(),
          zoom: zoom,
        })
        this.map = new maps.Map(node, mapConfig);
        var currentLocation = new maps.Marker({
          position: userLocation,
          map: mapRef,
        })
        currentLocation.setMap(this.map)
        eventMarker.setMap(this.map)

        this.props.getDistanceInfo(locations)
        console.log('MAPPPPPP:: ', this.map)
      })
    }

  }

  render() {
    const style = {
      width: '100%',
      height: '100%'
    }
    return (
        <div ref='map' style={style}>
          Loading..
        </div>
    )
  }
}

class EventDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }
  componentWillMount() {
    const userid = Number(this.props.params.userId);
    this.props.getUserEvents({id: userid});
  }

  handleTouchTap() {
    this.setState({
      open: true,
    });
  }

  handleRequestClose() {
    this.setState({
      open: false,
    });
  }
  renderEvent() {
    if (!this.props.event.events[0]) {
      return <div>Event Not Listed</div>;
    }
    //
    const eventArr = this.props.event.events.filter((event) => {
      return event.id === Number(this.props.params.eventId);
    });
    //
    const event = eventArr[0];
    console.log('RENDER EVENT:: ', event)
    const momentDate = moment(event.date).format('LLLL');
    const momentFromNow = moment(event.date).fromNow();
    const est = moment(event.date)._d;
    const artist = JSON.parse(event.artist_name).map((performer) => performer.name);
    const date = momentDate.toString() + ' ' + est.toString().slice(34);
    let image = null;
    if(event.image){
      image = JSON.parse(event.image)[3].url || null;
    };
    const venue = JSON.parse(event.venue)[0];
    let venueName = null;
    let venueStateOrCountry = null;
    if (venue.state) {
      venueName = venue.state.name;
      venueStateOrCountry = venue.state.stateCode;
    } else if (venue.country) {
      venueName = venue.country.name;
      venueStateOrCountry = venue.country.countryCode;
    }
    const genreParse = JSON.parse(event.genre);
    let genre = null;
    if(genreParse.genre.name !== undefined){
      genre = genreParse.genre.name;
    }
    const imageDiv = {
      width: '45%',
      float: 'center',
      height: '248px',
      margin: '10px',
    };
    const imageStyle = {
      width: '50%',
      height: '50%',
    };
    const mapStyle = {
        width: '35vw',
        height: '50vh',
        float: 'right',
    }
    const menuStyle = {
      float: 'right',
      height: '0%',
    }
    return (
      <Card key={event.id} className="list-group-item" zDepth={1}>
        <CardMedia>
          <img src={image} style={imageStyle} />
        </CardMedia>
        <CardActions>
          <IconMenu
            style={menuStyle}
            iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
            anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
            targetOrigin={{horizontal: 'right', vertical: 'top'}}
          >
            <MenuItem
              primaryText="Remove Event"
              secondary
              onTouchTap={this.handleTouchTap}
              onClick={() => this.props.removeEvent(event.tm_id, 0)}
              />
              <Snackbar
                open={this.state.open}
                message="Event Removed"
                autoHideDuration={4000}
                onRequestClose={this.handleRequestClose}
              />
          </IconMenu>
        </CardActions>

        <div ref="map" style={mapStyle}>
          <Map {...this.props} object={[]} />
          {this.renderDistanceInfo()}
        </div>

        <CardText>
          <h1>{event.name}</h1>
          <p>Listed acts: {artist.join(', ')}</p>
          <p>{venue.name}</p>
          <p>Location: {venue.address.line1}</p>
          <span>{venue.city.name}</span>
          <p>{venueName + ', ' + venueStateOrCountry}</p>
          <p>Post code: {venue.postalCode}</p>
          <p>Event Start: {date}</p>
          <p>{genre}</p>
          <p><a href={event.event_url}>Buy Tickets</a></p>
        </CardText>
      </Card>
    );
  }

  renderDistanceInfo() {
    if(!this.props.distance.distance || !this.props.distance.duration) {
      <div>Calculating...</div>
    }
    return (
      <div>
        <div>You are {this.props.distance.distance} from here</div>
        <div>It will take you {this.props.distance.duration} to get here</div>
      </div>
    )
  }

  render() {
    return (
      <div>
        <h3>Event Details</h3>
        <div className="list-group col-sm-16">
          {this.renderEvent()}
        </div>
      </div>
    );
  }
}


function mapStateToProps(state) {
  return {
    event: state.userEvents,
    distance: state.getDistanceInfo,
  };
}

const googleWrapped = GoogleApiWrapper({ apiKey: process.env.GAPI_KEY })(EventDetail);

export default connect(mapStateToProps, { getDistanceInfo, getLocation, removeEvent, getUserEvents })(googleWrapped);
