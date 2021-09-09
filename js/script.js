//1. Set and initialize variables 

let questionCount = 0;
let score = 0;
let ans;
let rand;
let record = [];
let status = 0;

function $(id) {
	return document.getElementById(id);
}

let question = $("question");
let progress = $("progress");
let submit = $("submit");

//2. Load current question into the app 
//Setting the question 
function setQuestion(qCount, rand) {
	let ques = questions[rand];
	question.textContent = ques.question;
}

function changeProgressBar(qCount) {
	progress.innerHTML = (qCount + 1) + " of 5";
}

function getQuestion(qCount, rand) {
	if(qCount == 4) { //last question
		submit.innerHTML = "Results";
	}
	
	if(qCount > 4) {
		return;
	}
	
	setQuestion(qCount,rand);
	changeProgressBar(qCount);
}

////3. Generate random, unused number
function randomGenerator() {
    // generate a random number between 0 and the last index in the array parameter
    let randomNumber = Math.round(Math.random() * questions.length);
    return randomNumber;
    
}

//setQuestion(randomGenerator());

//4. Loading the next question after the next question button is clicked

submit.addEventListener("click",nextQuestion);

function nextQuestion() { 	
    //if its the last question - load result page 
//    if(questionCount == 4) {
//        setResultPage();
//    }
    return getQuestion(++questionCount, randomGenerator());
}

//5. Final parts - retake button, setting up random number for the first time, what happens when the page first loads etc
//Retake button 
//retake.addEventListener("click",retakeTest);
//
//function retakeTest() {
//	window.location.reload();
//}

rand = Math.round(Math.random() * questions.length);
while(rand === questions.length) {
	rand = Math.round(Math.random() * questions.length);
}

record[0] = rand;

//onload function
window.onload = getQuestion(questionCount, rand);

