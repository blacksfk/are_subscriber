<template>
	<div class="car-container">
		<img class="img img-lg" :src="model.src" :alt="model.name">
		<h3>{{ model.name }}</h3>
	</div>
</template>
<style>
.car-container {
	display: flex;
	flex-flow: column wrap;
	align-items: center;
}
</style>
<script>
/**
 * Car models keyed by ID. Refer to Appendix 2 of the shared memory documentation.
 */
const CAR_MODELS = {
	// alpine
	alpine_a110_gt4: new Car(
		"Alpine A110 GT4",
		"https://www.ultimatecarpage.com/images/car/7198/Alpine-A110-GT4-134422.jpg"
	),

	// aston martin
	amr_v12_vantage_gt3: new Car(
		"Aston Martin V12 Vantage GT3",
		"https://www.assettocorsa.it/competizione/wp-content/uploads/AMR-V12-Vantage-GT3.jpg"
	),
	amr_v8_vantage_gt3: new Car(
		"Aston Martin V8 Vantage GT3",
		"https://www.assettocorsa.it/competizione/wp-content/uploads/AMR-V8-Vantage-GT3.jpg"
	),
	amr_v8_vantage_gt4: new Car(
		"Aston Martin V8 Vantage GT4",
		"https://assets.autobuzz.my/wp-content/uploads/2018/06/20085610/2018-Aston-Martin-Vantage-GT4-Race-Car-2.jpg"
	),

	// audi
	audi_r8_lms: new Car(
		"Audi R8 LMS",
		"https://www.assettocorsa.it/competizione/wp-content/uploads/Audi-R8-LMS.jpg"
	),
	audi_r8_lms_evo: new Car(
		"Audi R8 LMS Evo",
		"https://www.assettocorsa.it/competizione/wp-content/uploads/Audi-R8-LMS-Evo.jpg"
	),
	audi_r8_gt4: new Car(
		"Audi R8 LMS GT4",
		"https://upload.wikimedia.org/wikipedia/commons/d/db/Audi_R8_GT4.jpg"
	),

	// bentley
	bentley_continental_gt3_2016: new Car(
		"Bentley Continental GT3",
		"https://www.assettocorsa.it/competizione/wp-content/uploads/Bentley-Continental-GT3-2015.jpg"
	),
	bentley_continental_gt3_2018: new Car(
		"Bentley Continental GT3",
		"https://www.assettocorsa.it/competizione/wp-content/uploads/Bentley-Continental-GT3.jpg"
	),

	// bmw
	bmw_m6_gt3: new Car(
		"BMW M6 GT3",
		"https://www.assettocorsa.it/competizione/wp-content/uploads/BMW-M6-GT3-1.jpg"
	),
	bmw_m4_gt4: new Car(
		"BMW M4 GT4",
		"https://www.bmw-m.com/content/dam/bmw/marketBMW_M/common/topics/magazine-article-pool/2019/m4-gt4/bmw-m4gt4-stage-01.jpg.asset.1565164763264.jpg"
	),

	// chevy
	chevrolet_camaro_gt4r: new Car(
		"Chevrolet Camaro GT4.R",
		"https://european.gt4series.com/timthumb.php?w=1400&src=%2Fimages%2Fcars%2Fimage_17.jpg"
	),

	// ferrari
	ferrari_488_gt3: new Car(
		"Ferrari 488 GT3",
		"https://www.assettocorsa.it/competizione/wp-content/uploads/Ferrari-488-GT3-1.jpg"
	),
	ferrari_488_gt3_evo: new Car(
		"Ferrari 488 GT3 Evo",
		"https://periodismodelmotor.com/wp-content/uploads/2019/10/Ferrari-488-GT3-EVO-2020.jpg"
	),

	// ginetta
	ginetta_g55_gt4: new Car(
		"Ginetta G55 GT4",
		"https://www.ginetta.com/uploads/images/G55-GT4/_1980xAUTO_crop_center-center_75/GT4-front-three-quarter.jpg"
	),

	// honda
	honda_nsx_gt3: new Car(
		"Honda NSX GT3",
		"https://www.assettocorsa.it/competizione/wp-content/uploads/Honda-NSX-GT3.jpg"
	),
	honda_nsx_gt3_evo: new Car(
		"Honda NSX GT3 Evo",
		"https://www.assettocorsa.it/competizione/wp-content/uploads/Honda-NSX-GT3-Evo.jpg"
	),

	// jaaaaaaaaag
	jaguar_g3: new Car(
		"Emil Frey Jaguar G3",
		"https://www.assettocorsa.it/competizione/wp-content/uploads/Emil-Frey-Jaguar-G3.jpg"
	),

	// ktm
	ktm_xbow_gt4: new Car(
		"KTM X-bow GT4",
		"https://www.ktm.com/ktmgroup-storage/PHO_CAR_PERS_REVO_X-BOW-GT4-2018-PERSP-LI_%23SALL_%23AEPI_%23V1.png"
	),

	// lambo
	lamborghini_gallardo_rex: new Car(
		"Reiter Engineering Gallardo R-EX",
		"https://www.assettocorsa.it/competizione/wp-content/uploads/Reiter-Engineering-R-EX-GT3.jpg"
	),
	lamborghini_huracan_gt3: new Car(
		"Lamborghini Huracan GT3",
		"https://www.assettocorsa.it/competizione/wp-content/uploads/Lamborghini-Huracan-GT3.jpg"
	),
	lamborghini_huracan_gt3_evo: new Car(
		"Lamborghini Huracan GT3 Evo",
		"https://www.assettocorsa.it/competizione/wp-content/uploads/Lamborghini-Huracan-GT3-Evo.jpg"
	),
	lamborghini_huracan_st: new Car(
		"Lamborghini Huracan Super Trofeo",
		"https://www.assettocorsa.it/competizione/wp-content/uploads/Lamborhini-Huracan-ST.jpg"
	),

	// lexus
	lexus_rc_f_gt3: new Car(
		"Lexus RC F GT3",
		"https://www.assettocorsa.it/competizione/wp-content/uploads/Lexus-RC-F-GT3-1.jpg"
	),

	// maserati
	maserati_mc_gt4: new Car(
		"Maserati Gran Turismo MC GT4",
		"https://www.britishgt.com/timthumb.php?w=982&src=%2Fimages%2Fcars%2F60-01.jpg"
	),

	// mclaren
	mclaren_650s_gt3: new Car(
		"McLaren 650S GT3",
		"https://www.assettocorsa.it/competizione/wp-content/uploads/McLaren-650S-GT3.jpg"
	),
	mclaren_720s_gt3: new Car(
		"McLaren 720S GT3",
		"https://www.assettocorsa.it/competizione/wp-content/uploads/McLaren-720S-GT3.jpg"
	),
	mclaren_570s_gt4: new Car(
		"McLaren 570S GT4",
		"https://i.ytimg.com/vi/hQZplW9HAyo/maxresdefault.jpg"
	),

	// mercedes
	mercedes_amg_gt3: new Car(
		"Mercedes-AMG GT3",
		"https://www.assettocorsa.it/competizione/wp-content/uploads/Mercedes-AMG-GT3-1.jpg"
	),
	mercedes_amg_gt3_evo: new Car(
		"Mercedes-AMG GT3 Evo",
		"https://i2.wp.com/assettocorsa.net/competizione/wp-content/uploads/ss_d973d274e0121978ed4c775b95ef6fee99316a67-1440x810.jpg"
	),
	mercedes_amg_gt4: new Car(
		"Mercedes-AMG GT4",
		"https://www.mercedes-amg.com/content/global/en/vehicles/customer-racing/gt-4/jcr:content/stage/media/slides/slide/image.media6.responsive_full_viewport_16_9.1531816284936.jpeg"
	),

	// 23
	nissan_gt_r_gt3_2017: new Car(
		"Nissan GT-R Nismo GT3",
		"https://www.assettocorsa.it/competizione/wp-content/uploads/Nissan-GT-R-Nismo-GT3-2015.jpg"
	),
	nissan_gt_r_gt3_2018: new Car(
		"Nissan GT-R Nismo GT3",
		"https://www.assettocorsa.it/competizione/wp-content/uploads/Nissan-GT-R-Nismo-GT3.jpg"
	),

	// porsche
	porsche_991_gt3_r: new Car(
		"Porsche 991 GT3 R",
		"https://www.assettocorsa.it/competizione/wp-content/uploads/Porsche-991-GT3-R.jpg"
	),
	porsche_991ii_gt3_r: new Car(
		"Porsche 991 II GT3 R",
		"https://www.assettocorsa.it/competizione/wp-content/uploads/Porsche-991II-GT3-R.jpg"
	),
	porsche_991ii_gt3_cup: new Car(
		"Porsche 991 II GT3 Cup",
		"https://www.assettocorsa.it/competizione/wp-content/uploads/Porsche-991II-GT3-Cup.jpg"
	),
	porsche_718_cayman_gt4_mr: new Car(
		"Porsche 718 Cayman GT4 MR",
		"https://www.brp.gr.com/wp/wp-content/themes/BRP-2018/images/about/machine/porsche_gt4/pict_04.jpg"
	)
};

/**
 * Auxiliary prototype to assist car model creation.
 * @param {String} name The full name of the model.
 * @param {String} src  Fully qualified URL to a picture of the model.
 */
function Car(name, src) {
	this.name = name;
	this.src = src;
}

/**
 * Injected properties.
 */
let props = {
	id: String
};

/**
 * Computed instance variables.
 */
let computed = {
	model() {
		let m = CAR_MODELS[this.id];

		if (!m) {
			return new Car("Unknown", "");
		}

		return m;
	}
};

export default {
	props,
	computed
};
</script>