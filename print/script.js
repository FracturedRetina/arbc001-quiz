var spellingWords = {};
var vocabWords = {};
var quizAnswers = [];

const SPELLING = 7;
const DEFINITIONS = 7;

$(document).ready(function() {
	$.ajax({
		url: "../res/unit_05_vocab.csv",
		success: function(data) {
			var words = loadWords(data);
			spellingWords = {...spellingWords, ...words};
			vocabWords = {...vocabWords, ...words};
		},
		async: false
	});
	$.ajax({
		url: "../res/unit_06_vocab.csv",
		success: function(data) {
			var words = loadWords(data);
			spellingWords = {...spellingWords, ...words};
			vocabWords = {...vocabWords, ...words};
		},
		async: false
	});
	$.ajax({
		url: "../res/unit_03_vocab.csv",
		success: function(data) {
			var words = loadWords(data);
			spellingWords = {...spellingWords, ...words};
			vocabWords = {...vocabWords, ...words};
		},
		async: false
	});
	$.ajax({
		url: "../res/countries_vocab.csv",
		success: function(data) {
			var words = loadWords(data);
			spellingWords = {...spellingWords, ...words};
		},
		async: false
	});

	var spellingUsed = [];
	var vocabUsed = [];

	//Spelling
	for (var i = 0; i < SPELLING; i++) {
		var question = $("<li><ol></ol></li>");
		var word = Object.keys(spellingWords)[Math.floor(Math.random() * Object.keys(spellingWords).length)];
		while (spellingUsed.includes(word)) {
			word = Object.keys(spellingWords)[Math.floor(Math.random() * Object.keys(spellingWords).length)];
		}
		spellingUsed.push(word);
		var numVowels = countVowels(word);
		var correct = Math.floor(Math.random() * 3);
		quizAnswers.push(correct);
		var answers = [];
		for (var j = 0; j < 3; j++) {
			var answer = shuffleVowels(word);
			if (j == correct) {
				answer = word;
			} else {
				if (answers.length == Math.pow(2, numVowels) - 1) {
					break;
				} else {
					while (answers.includes(answer)) {
						answer = shuffleVowels(word);
					}
					answers.push(answer);
				}
			}
			question.find('ol').append("<li>" + answer + "</li>");
		}
		if (question.find('ol').children().length > 1) {
			$('#spelling .questions').append(question);
		} else {
			i--;
		}
	}

	//Definitions
	$('#definitions .questions').attr("start", SPELLING + 1);
	for (var i = 0; i < DEFINITIONS; i++) {
		var word = Object.keys(vocabWords)[Math.floor(Math.random() * Object.keys(vocabWords).length)];
		while (vocabUsed.includes(word) || spellingUsed.includes(word)) {
			word = Object.keys(vocabWords)[Math.floor(Math.random() * Object.keys(vocabWords).length)];
		}
		vocabUsed.push(word);
		$('#definitions .questions').append("<li>" + vocabWords[word].en + " ____________</li>");
		quizAnswers.push(vocabWords[word].en);
	}
	for (var i = 0; i < DEFINITIONS; i++) {
		var word = Object.keys(vocabWords)[Math.floor(Math.random() * Object.keys(vocabWords).length)];
		while (vocabUsed.includes(word) || spellingUsed.includes(word)) {
			word = Object.keys(vocabWords)[Math.floor(Math.random() * Object.keys(vocabWords).length)];
		}
		vocabUsed.push(vocabWords[word].en);
		$('#definitions .questions').append("<li>" + word + " ____________</li>");
		quizAnswers.push(word);
	}

	//Answers
	for (var i = 0; i < quizAnswers.length; i++) {
		if (isNaN(quizAnswers[i])) {
			$('#answers').append("<li>" + quizAnswers[i] + "</li>");
		} else {
			$('#answers').append("<li>" + String.fromCharCode(quizAnswers[i] + 97) + "</li>");
		}
	}

	$('#answers').on("load", function() {
		this.css("margin-top", this.height());
	});
});