var spellingWords = {};
var vocabWords = {};
var currAnswer;
var numCorrect = 0;
var numAnswered = 0;
var questionType;

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

	genNextQuestion();

	$('#submit').click(onSubmit);
});

function onSubmit() {
	if ($('#feedback').css("display") == "none") {
		if (questionType == "vocab") {
			if ($('input').val() == stripTashkeel(currAnswer)) {
				$('#feedback').text("Correct!");
				$('#feedback').css("color", "green");
				$('#feedback').slideDown();
				numCorrect++;
			} else {
				$('#feedback').text(stripTashkeel(currAnswer));
				$('#feedback').css("color", "red");
				$('#feedback').slideDown();
			}
		} else if (questionType == "spelling") {
			if (currAnswer == $('input[type=radio]:checked').val()) {
				$('#feedback').text("Correct!");
				$('#feedback').css("color", "green");
				$('#feedback').slideDown();
				numCorrect++;
			} else {
				$('#feedback').text("Incorrect");
				$('#feedback').css("color", "red");
				$('#feedback').slideDown();
				$('label').eq($('input[type=radio]:checked').val()).css("color", "red");
			}
			$('label').eq(currAnswer).css("color", "green");
		}

		numAnswered++;
		$('#submit').text("Next question");
		$('#score').text(numCorrect + "/" + numAnswered);
	} else {
		$('#question').empty();
		$('#feedback').slideUp();
		genNextQuestion();
		$('#submit').text("Submit");
	}
}

function genNextQuestion() {
	if (Math.random() > 0.5) {
		genSpellingQuestion();
		questionType = "spelling";
	} else {
		genVocabQuestion();
		questionType = "vocab";
	}
}

function genVocabQuestion() {
	var word = Object.keys(vocabWords)[Math.floor(Math.random() * Object.keys(vocabWords).length)];
	var wordData = vocabWords[word];
	
	if (Math.random() > 0.5) {
		$('#instructions').html("Enter the English translation of the Arabic word <span class=\"arabic\">" + word + "</span>.");
		currAnswer = wordData.en;
	} else {
		$('#instructions').text("Enter the Arabic translation of the English word " + wordData.en + ". Do not add any tashkeel.");
		currAnswer = word;
	}

	$('#question').append("<input id=\"question-" + numAnswered + "\" />");
	$('#question-' + numAnswered).keypress(function(e) {
		if (e.which == 13) {
			onSubmit();
		}
	});
}

function genSpellingQuestion() {
	var word = Object.keys(spellingWords)[Math.floor(Math.random() * Object.keys(spellingWords).length)];
	var wordData = spellingWords[word];
	var numVowels = countVowels(word);
	var correct = Math.floor(Math.random() * 3);
	var answers = [];
	
	currAnswer = correct;
	
	for (var i = 0; i < 3; i++) {
		var answer = shuffleVowels(word);
		if (i == correct) {
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
		$('#question').append("<div><input id=\"choice-" + i + "\" type=\"radio\" name=\"" + numAnswered + "\" value=\"" + i + "\" /><label for=\"choice-" + i + "\" class=\"arabic\">" + answer + "<span></div>");
		$('#instructions').text("Select the correct spelling of the Arabic word for " + wordData.en + ".");
	}
	if ($('#question').children().length <= 1) {
		genSpellingQuestion();
	}
}