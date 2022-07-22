backend_base_url ="http://localhost:8000"
frontend_base_url ="http://localhost:5500"

const ROOM_STATUS_START = 'start'
const ROOM_STATUS_PENDING = 'pending'
const ROOM_STATUS_STOP = 'stop'

// Get UUID v4
// function uuidv4() {
//     return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
//       (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
//     );
// } 