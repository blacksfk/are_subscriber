/**
 * Which character to pad with.
 * @type {String}
 */
const ZERO_STR = "0";

/**
 * Split raw into mm:ss.xxx where:
 * m = minute
 * s = second
 * x = millisecond
 * @param  {Number} raw     Must be in milliseconds.
 * @param  {Number} places  Number of digits after the decimal point
 * @param  {Number} padding How wide the seconds part should be (including decimal point)
 * @return {String}
 */
function fmtLaptime(raw, places, padding) {
	// get the total seconds by dividing by 1000
	let s = raw / 1000;

	// determine how many minutes by dividing by 60 and flooring
	let m = Math.floor(s / 60);

	// re-calculate the seconds by getting the remainder of the above division
	// convieniently includes the milliseconds after the decimal point
	s = s % 60;

	// pad the strings appropriately
	let pm = m.toString().padStart(2, ZERO_STR);
	let ps = s.toFixed(places).padStart(padding, ZERO_STR);

	return `${pm}:${ps}`;
}

export default fmtLaptime;
