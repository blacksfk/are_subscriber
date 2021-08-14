/**
 * Supported units.
 */
const UNITS = [
	{unit: "second", divisor: 1000},
	{unit: "minute", divisor: 60},
	{unit: "hour", divisor: 60},
	{unit: "day", divisor: 24}
];

/**
 * Get a relative timestamp to the nearest whole unit.
 * @param  String date
 * @return String
 */
function timesince(date) {
	let diff = Date.now() - Date.parse(date);
	let unit = "millisecond";
	let len = UNITS.length;
	let suffix = "ago";

	if (diff < 0) {
		// date is in the future, so convert to an absolute value
		diff = Math.abs(diff);
		suffix = "in the future";
	}

	for (let i = 0; i < len; i++) {
		let curr = UNITS[i];

		if (diff / curr.divisor > 1) {
			// value is greater than or equal to one of the current unit
			unit = curr.unit;
			diff /= curr.divisor;
		} else {
			break;
		}
	}

	if (Math.floor(diff) !== 1) {
		// pluralise the unit
		unit += "s";
	}

	return `${Math.trunc(diff)} ${unit} ${suffix}`;
}

export default {
	install(Vue) {
		Vue.prototype.$timesince = timesince;
	}
}
