buttonContainer = document.querySelector('.button-container');
voteForm = document.querySelector('.vote-form');
submitButton = document.querySelector("#submit-btn");
question = document.querySelector(".question");
formControls = document.querySelector(".form-controls");

var firebaseConfig = {
    apiKey: "AIzaSyDxkJJSo4T3L-NJofwaU5Sl_bODYNNfD5A",
    authDomain: "poll-app-141fa.firebaseapp.com",
    databaseURL: "https://poll-app-141fa.firebaseio.com",
    projectId: "poll-app-141fa",
    storageBucket: "poll-app-141fa.appspot.com",
    messagingSenderId: "392838219265",
    appId: "1:392838219265:web:a9d9691cfbb6676e712200",
    measurementId: "G-E41B5ZQ7SW"
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();
const db = firebase.firestore();

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const pollID = urlParams.get("pollid");
console.log(pollID);
let docRef = db.collection('polls').doc(`${pollID}`);


docRef.get().then((doc) => {
    if (doc.exists) {
        question.innerText = doc.data().question;
        doc.data().labels.forEach((label) => {
            const newOption = document.createElement("input");
            newOption.setAttribute('type', 'radio');
            newOption.setAttribute('name', "options");
            newOption.setAttribute('value', label);
            newOption.setAttribute('id', label);

            const newLabel = document.createElement("label");
            newLabel.setAttribute("for", label);
            newLabel.innerText = label;

            formControls.appendChild(newOption);
            formControls.appendChild(newLabel);
            // voteForm.insertBefore(newOption, submitButton);
            // voteForm.insertBefore(newLabel, submitButton);
        });
        console.log("Buttons updated!");
    }
    else {
        console.log("No data found!");
    }

}).catch(error => {
    console.log("Error getting document", error);
})

const submitForm = (e) => {
    e.preventDefault();

    submitButton.disabled = true;
    const optionsList = document.getElementsByName("options");

    for (let i = 0; i < optionsList.length; i++) {
        if (optionsList[i].checked) {
            incrementCount(optionsList[i].value);
        }
    }
}


const incrementCount = (label) => {
    docRef.update({
        [label]: firebase.firestore.FieldValue.increment(1)
    }).then(() => {
        alert("Your Response has been recorded. Thank You");
        window.location.href = `http://127.0.0.1:5500/index.html`;
    });
}

submitButton.addEventListener('click', submitForm);
