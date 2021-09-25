/**
 * Lap prototype.
 */
function Lap(lapNo, sectorCount, driver) {
	let rawTotal = -1;

	this.lapNo = lapNo;
	this.sectors = [];
	this.total = "";
	this.driver = driver;
	this.currSectorIndex = 0;
	this.notes = [];

	for (let i = 0; i < sectorCount; i++) {
		// initialise all sector times to zero
		this.sectors.push(0);
	}

	/**
	 * Set an on-going sector time to this lap.
	 * @param {Number} time In milliseconds.
	 */
	this.setSector = function(time) {
		this.sectors[this.currSectorIndex++] = time;
	}

	/**
	 * Mark this lap as complete by using the telemetry
	 * data as the source of truth.
	 * @param  {Number} time In milliseconds.
	 * @return {void}
	 */
	this.complete = function(time) {
		rawTotal = time;
		this.total = fmtLaptime(time, 3, 6);
	}

	/**
	 * Get a delta from the best lap time in seconds. Returns
	 * an empty string until the lap is marked as complete. It
	 * is assumed that this lap will only ever be the same or slower
	 * than the provided best.
	 * @param  {Number} best In milliseconds.
	 * @return {String}      "+w.xyz"
	 */
	this.delta = function(best) {
		if (rawTotal < 0) {
			// lap not complete
			return "";
		}

		// assumumption: this laptime is always the same or
		// worse as the provided best lap
		let diff = rawTotal - best;

		return `+${(diff / 1000).toFixed(3)}`;
	}
}

export default Lap;
