const LONG = "ايو";
const SHORT = "َُِ";
const OTHER = "ّْ";

function loadWords(data) {
	var lines = data.split("\n");
	for (var i = 0; i < lines.length; i++) {
		var splitLn = lines[i].split(',');
		var entry = {};
		entry[splitLn[0]] = splitLn[1];
		words.push(entry);
	}
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