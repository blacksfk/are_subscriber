/**
 * Determines whether or not the set is rain or slicks.
 * @param  {Number} set
 * @return {String|Number}     "Rain tyres" or the slick tyre set.
 */
function rainOrSlicks(set) {
	if (set === 0) {
		// 0 == rain tyres
		return "Rain tyres";
	}

	// dry tyre sets
	return set;
}

export default rainOrSlicks;
