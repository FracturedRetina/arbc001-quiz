var words = [];
var currAnswer;
var numCorrect = 0;
var numAnswered = 0;
var questionType;

$(document).ready(function() {
	$.get("../res/unit_05_vocab.csv", function(data) {
		loadWords(data);
	}).then(function() {
		$.get("../res/unit_06_vocab.csv", function(data) {
			loadWords(data);
		}).then(function() {
			if (Math.random() > 0.5) {
				generateSpellingQuestion();
				questionType = "spelling";
			} else {
				generateVocabQuestion();
				questionType = "vocab";
			}
		});
	});

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
		if (Math.random() > 0.5) {
			generateSpellingQuestion();
			questionType = "spelling";
		} else {
			generateVocabQuestion();
			questionType = "vocab";
		}
		$('#submit').text("Submit");
	}
}

function generateVocabQuestion() {
	var wordEntry = words[Math.floor(Math.random() * words.length)];
	var word = Object.keys(wordEntry)[0];
	var translation = Object.values(wordEntry)[0];
	
	if (Math.random() > 0.5) {
		$('#instructions').html("Enter the English translation of the Arabic word <span class=\"arabic\">" + word + "</span>.");
		currAnswer = translation;
	} else {
		$('#instructions').text("Enter the Arabic translation of the English word " + translation + ". Do not add any tashkeel.");
		currAnswer = word;
	}

	$('#question').append("<input id=\"question-" + numAnswered + "\" />");
	$('#question-' + numAnswered).keypress(function(e) {
		if (e.which == 13) {
			onSubmit();
		}
	});
}

function generateSpellingQuestion() {
	var wordEntry = words[Math.floor(Math.random() * words.length)];
	var word = Object.keys(wordEntry)[0];
	var translation = Object.values(wordEntry)[0];
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
		$('#instructions').text("Select the correct spelling of the Arabic word for " + translation + ".");
	}
	if ($('#question').children().length <= 1) {
		generateSpellingQuestion();
	}
}