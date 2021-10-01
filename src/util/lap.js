import fmtLaptime from "./fmtLaptime";

/**
 * Blank lap time.
 * @type {String}
 */
const BLANK = "--.--.---";

/**
 * Lap prototype.
 */
function Lap(lapNo, sectorCount, driver) {
	let rawTotal = -1;
	let currSectorIdx = 0;
	let inLap = false;
	let outLap = false;

	this.lapNo = lapNo;
	this.sectors = [];
	this.total = "";
	this.driver = driver;
	this.notes = [];

	for (let i = 0; i < sectorCount; i++) {
		// initialise all sector times to zero
		this.sectors.push(0);
	}

	/**
	 * Set an on-going sector time.
	 * @param {Number} time In milliseconds.
	 */
	this.setSector = function(time) {
		this.sectors[currSectorIdx] = time;
	}

	/**
	 * Mark the current sector as complete.
	 * @param  {Number} time In milliseconds.
	 */
	this.sectorComplete = function(time) {
		this.setSector(time);
		currSectorIdx++;
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
	 * Get the lap time in milliseconds. Returns zero
	 * until the lap has been marked as complete.
	 * @return {Number}
	 */
	this.milliseconds = function() {
		if (rawTotal < 0) {
			return 0;
		}

		return rawTotal;
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
		if (rawTotal < 0 || best <= 0) {
			return BLANK;
		}

		// assumumption: this laptime is always the same or
		// worse as the provided best lap
		let diff = rawTotal - best;

		return `+${(diff / 1000).toFixed(3)}`;
	}

	/**
	 * Mark this lap as an in lap.
	 * @return {void}
	 */
	this.inLap = function() {
		if (inLap) {
			// already has been marked as an in lap
			return;
		}

		inLap = true;
		this.notes.push("In lap");
	}

	/**
	 * Mark this lap as an out lap.
	 * @return {void}
	 */
	this.outLap = function() {
		if (outLap) {
			// already has been marked as an out lap
			return;
		}

		outLap = true;
		this.notes.push("Out lap");
	}
}

export default Lap;
