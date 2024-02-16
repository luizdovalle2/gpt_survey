var buttons = document.querySelectorAll(".button-subproperties");
var amount_activate = 0
var topicFormEl = document.getElementById('topicForm');
var buttonSubProp = document.getElementById('sendSubProp');
var buttonAnswers = document.getElementById('sendAnswers');
var buttonP1 = document.getElementById('P1');
var buttonP2 = document.getElementById('P2');
var buttonP3 = document.getElementById('P3');
var buttonP4 = document.getElementById('P4');
var selectedSubProp
var amountQuestionsFinal = 0
var questionsPanel = document.getElementById("questions-panel");
var topicPanel = document.getElementById("topic-panel");
var buttonPanel = document.getElementById("button-panel");
var anlysisPanel = document.getElementById("panel-analysis");
var analysisText = document.getElementById("analysis-text");

var loadDiv = document.createElement("div");
loadDiv.id = "newDivId";
loadDiv.className = "spinner";


topicFormEl.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission
    topic = topicFormEl.elements['topic'].value
    amount_form_value = topicFormEl.elements['amount-questions'].value
    if(!isNaN(parseInt(amount_form_value))){
        if(parseInt(amount_form_value) > 10 || parseInt(amount_form_value)<1){
            alert("The question amount should be an integer value between 1 and 10")
            return
        }
    }
    document.getElementById("topic-button").disabled = true;
    amountQuestionsFinal = parseInt(amount_form_value)
    var congifSurvey = {
        "topic": topic,
        "questionAmount": amountQuestionsFinal
    };
    topicPanel.appendChild(loadDiv);

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/form_topic', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(congifSurvey));
    var JSONresponse = ""
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            topicPanel.removeChild(loadDiv);
            JSONresponse = xhr.responseText; // Log the response from the server
        }
        if(JSONresponse.trim() === "null"){
            createDivProblem(topicPanel)
            return
        }
        enableButtonPanel(JSONresponse)
    };
});

function createDivProblem(element) {
    var divProblem = document.createElement('div');
    divProblem.classList.add('panel');
    divProblem.innerHTML = "There was a problem creating the survey, please refresh the page and try another topic"
    divProblem.style.padding = '0 0 10vh 0';
    element.appendChild(divProblem)
}

function enableButtonPanel(JSONresponse) {
    var buttonValues = JSON.parse(JSONresponse);
    buttonP1.innerHTML  = buttonValues.P1
    buttonP2.innerHTML  = buttonValues.P2
    buttonP3.innerHTML  = buttonValues.P3
    buttonP4.innerHTML  = buttonValues.P4

    buttonPanel.classList.toggle("hidden");
    buttonPanel.classList.toggle("visible");
    window.scrollTo(0, document.body.scrollHeight);

}



// Attach event listener to each button
buttons.forEach(function(button) {
    button.setAttribute("activateButton", "0");
    button.addEventListener("click", function() {
        if (button.getAttribute("activateButton") === "1") {
            button.setAttribute("activateButton", "0");
            this.style.backgroundColor = "whitesmoke";
            amount_activate -=1
        } else {
            if(amount_activate<3){
                button.id
                button.setAttribute("activateButton", "1");
                this.style.backgroundColor = "green";
                amount_activate +=1
            }
        }
    });
});

buttonSubProp.addEventListener("click", function(event) {
    event.preventDefault(); // Prevent the default form submission
    buttonSubProp.disabled = true;
    var subPropString = ""
    document.querySelectorAll('[activateButton="1"]').forEach(function(element) {
        if (element.id == "P5"){
             subPropString += document.getElementById('supPropForm').elements['otherSub'].value + ",  "
        }
        else{
             subPropString += element.innerHTML + " | "
        }
    });

    var newDiv = document.createElement("div");
    newDiv.id = "newDivId";
    newDiv.className = "spinner";
    buttonPanel.appendChild(loadDiv);
    window.scrollTo(0, document.body.scrollHeight);


    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/subprop_form', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(subPropString));
    var JSONresponse = ""
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            buttonPanel.removeChild(loadDiv);
            JSONresponse = xhr.responseText; // Log the response from the server
        }
        if(JSONresponse.trim() === "null"){
            createDivProblem(buttonPanel)
            return
        }
        enableQuestionsPanel(JSONresponse)
    };
});

function enableQuestionsPanel(JSONresponse) {
    var questionValues = JSON.parse(JSONresponse);
    let htmlCode = '';
    for (let i = 1; i <= amountQuestionsFinal; i++) {
        // Generate paragraph element
        const paragraphId = `textQ${i}`;
        const formId = `Q${i}`;
        const paragraphContent = formId +". " + questionValues[formId];;
        htmlCode += `<p id="${paragraphId}" class="question-text">${paragraphContent}</p>`;

        // Generate form element
        htmlCode += `<form id="${formId}" class="answer-form" ><input type="text" name="answer" placeholder="" class="answer-input" required></form>`;
    }

    questionsPanel.classList.toggle("hidden");
    questionsPanel.classList.toggle("visible");
    window.scrollTo(0, document.body.scrollHeight);
    document.getElementById("QA").innerHTML = htmlCode

}

buttonAnswers.addEventListener("click", function(event) {
    event.preventDefault(); // Prevent the default form submission

    var answersMessage = { };
    var subPropString = ""
    var allQuestions = true
    document.querySelectorAll('.answer-form').forEach(function(element) {
        answersMessage[element.id] = element.elements['answer'].value
        if(answersMessage[element.id].trim() == ''){
            allQuestions = false
        }
    });
    if(!allQuestions){
        alert("Please answer all the questions")
           return
    }
    buttonAnswers.disabled = true;
    questionsPanel.appendChild(loadDiv);
    window.scrollTo(0, document.body.scrollHeight);

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/answers_form', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(answersMessage));
    var JSONresponse = ""
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            questionsPanel.removeChild(loadDiv);
            JSONresponse = xhr.responseText; // Log the response from the server
        }
        enableAnalysisPanel(JSONresponse)
    };
});

function enableAnalysisPanel(JSONresponse){
    var analysisValue = JSON.parse(JSONresponse);
    analysisText.innerHTML = analysisValue;
    analysisText.style.textAlign = 'justify';
    anlysisPanel.classList.toggle("hidden");
    anlysisPanel.classList.toggle("visible");

}

function refreshPage(){
    // Reload the current page
    location.reload();
}