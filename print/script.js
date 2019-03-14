var words = [];
var quizAnswers = [];

const SPELLING = 7;
const DEFINITIONS = 7;

$(document).ready(function() {
	$.get("../res/unit_05_vocab.csv", function(data) {
		loadWords(data);
	}).then(function() {
		$.get("../res/unit_06_vocab.csv", function(data) {
			loadWords(data);
		}).then(function() {
			var spellingWords = [];
			var translationWords = [];

			//Spelling
			for (var i = 0; i < SPELLING; i++) {
				var question = $("<li><ol></ol></li>");
				var word = Object.keys(words[Math.floor(Math.random() * words.length)])[0];
				while (spellingWords.includes(word)) {
					word = Object.keys(words[Math.floor(Math.random() * words.length)])[0];
				}
				spellingWords.push(word);
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
				var word = words[Math.floor(Math.random() * words.length)];
				while (translationWords.includes(word) || spellingWords.includes(word)) {
					word = words[Math.floor(Math.random() * words.length)];
				}
				translationWords.push(Object.keys(word)[0]);
				$('#definitions .questions').append("<li>" + Object.keys(word)[0] + " ____________</li>");
				quizAnswers.push(Object.values(word)[0]);
			}
			for (var i = 0; i < DEFINITIONS; i++) {
				var word = words[Math.floor(Math.random() * words.length)];
				while (translationWords.includes(word)) {
					word = words[Math.floor(Math.random() * words.length)];
				}
				translationWords.push(Object.values(word)[0]);
				$('#definitions .questions').append("<li>" + Object.values(word)[0] + " ____________</li>");
				quizAnswers.push(Object.keys(word)[0]);
			}

			//Answers
			for (var i = 0; i < quizAnswers.length; i++) {
				if (isNaN(quizAnswers[i])) {
					$('#answers').append("<li>" + quizAnswers[i] + "</li>");
				} else {
					$('#answers').append("<li>" + String.fromCharCode(quizAnswers[i] + 97) + "</li>");
				}
			}
		});
	});
});