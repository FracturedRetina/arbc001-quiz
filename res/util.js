const LONG = "ايو";
const SHORT = "َُِ";
const OTHER = "ّْ";

const PERSON_FIRST = 1;
const PERSON_SECOND = 2;
const PERSON_THIRD = 3;

const GENDER_NONE = 'n';
const GENDER_MASCULINE = 'm';
const GENDER_FEMININE = 'f';

const SINGULAR = 1;
const DUAL = 2;
const PLURAL = 3;

function loadWords(data) {
	var loaded = [];
	var lines = data.split("\n");
	for (var i = 0; i < lines.length; i++) {
		var splitLn = lines[i].split(',');
		var entry = {};
		entry[splitLn[0]] = splitLn[1];
		loaded.push(entry);
	}
	return loaded;
}

function loadPronouns(data) {
	var ret = {};
	var lines = data.split("\n");
	for (var i = 0; i < lines.length; i++) {
		var splitLn = lines[i].split(',');
		for (var j = 0; j < splitLn.length; j++) {
			if (j == 0) {
				if (ret[PERSON_FIRST] == undefined) {
					ret[PERSON_FIRST] = {};
				}
				if (ret[PERSON_FIRST][GENDER_NONE] == undefined) {
					ret[PERSON_FIRST][GENDER_NONE] = {};
				}
				ret[PERSON_FIRST][GENDER_NONE][i + 1] = splitLn[j];
			} else {
				if (ret[Math.floor((j - 1) / 2) + 2] == undefined) {
					ret[Math.floor((j - 1) / 2) + 2] = {};
				}
				if (ret[Math.floor((j - 1) / 2) + 2][(j % 2 == 1) ? GENDER_MASCULINE : GENDER_FEMININE] == undefined) {
					ret[Math.floor((j - 1) / 2) + 2][(j % 2 == 1) ? GENDER_MASCULINE : GENDER_FEMININE] = {};
				}
				ret[Math.floor((j - 1) / 2) + 2][(j % 2 == 1) ? GENDER_MASCULINE : GENDER_FEMININE][i + 1] = splitLn[j];
			}
		}
	}
	return ret;
}

function countVowels(word) {
	var numVowels = 0;

	for (var i = 0; i < word.length; i++) {
		if (SHORT.includes(word[i]) || LONG.includes(word[i])) {
			numVowels++;
		}
	}

	return numVowels;
}

function shuffleVowels(word) {
	var changed = false;
	var numVowels = 0;
	var ret = "";

	for (var i = 0; i < word.length; i++) {
		if (SHORT.includes(word[i])) {
			if (Math.random() > 0.5) {
				ret += LONG[SHORT.indexOf(word[i])];
				changed = true;
			} else {
				ret += word[i];
			}
			numVowels++;
		} else if (LONG.includes(word[i]) && word[i + 1] != "ّ") {
			if (Math.random() > 0.5) {
				ret += SHORT[LONG.indexOf(word[i])];
				changed = true;
			} else {
				ret += word[i];
			}
			numVowels++;
		} else {
			ret += word[i];
		}
	}

	if (!changed && numVowels > 0) {
		return shuffleVowels(word);
	} else {
		return ret;
	}
}

function stripTashkeel(word) {
	var ret = "";

	for (var i = 0; i < word.length; i++) {
		if (!SHORT.includes(word[i]) && !OTHER.includes(word[i])) {
			ret += word[i];
		}
	}

	return ret;
}