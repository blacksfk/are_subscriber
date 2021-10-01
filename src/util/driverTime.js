/**
 * Groups a driver with the stint timer and total driving
 * time remaining.
 * @param {String} name  Full driver's name.
 * @param {Number} stint Stint timer (in milliseconds).
 * @param {Number} total Total driving time remaining (in milliseconds).
 */
function DriverTime(name, stint, total) {
	this.name = name;
	this.stintRemaining = stint;
	this.totalRemaining = total;
}

export default DriverTime;
