export default function(state = [], action) {
  switch(action.type) {
  case 'GET_EVENTS':
  console.log('GET EVENTS ACTION GOT: ', action.payload.data);
    return action.payload.data;
  }
  return state;
}