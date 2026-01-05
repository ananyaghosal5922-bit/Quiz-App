
let questions = [
    {
        text: "What is the capital of India?",
        options: ["Delhi", "Mumbai", "Kolkata", "Chennai"],
        correct: 0
    },
    {
        text: "What is the national flower of India?",
        options: ["Rose", "Sunflower", "Lotus", "Lily"],
        correct: 2
    },
    {
        text: "What is the full form of CPU?",
        options: [
            "Central Processing Unit",
            "Computer Personal Unit",
            "Control Processing Utility",
            "Central Power Unit"
        ],
        correct: 0
    },
    {
        text: "CSS stands for?",
        options: [
            "Color Style Sheets",
            "Cascading Style Sheets",
            "Creative Style System",
            "Coded Style Syntax"
        ],
        correct: 1
    },
    {
        text: "HTML stands for?",
        options: [
            "Hyper Trainer Markup Language",
            "Hyper Text Markup Language",
            "High Text Markup Language",
            "None"
        ],
        correct: 1
    }
];

let currentQuestion = 0;
let submitted = JSON.parse(localStorage.getItem("submitted")) || false;
let selectedAnswers = JSON.parse(localStorage.getItem("answers")) || {};
let timeLeft = 60;

let quizContainer = document.getElementById("quiz-container");
let progress = document.getElementById("progress");
let scoreBox = document.getElementById("score");
let submitBtn = document.getElementById("submitBtn");
let resetBtn = document.getElementById("resetBtn");
let nextBtn = document.getElementById("nextBtn");
let prevBtn = document.getElementById("prevBtn");
let palette = document.getElementById("question-palette");
let timerBox = document.getElementById("timer");

function loadQuestion() {
    quizContainer.innerHTML = "";

    let q = questions[currentQuestion];
    let card = document.createElement("div");
    card.className = "question-card";

    card.innerHTML = `<h3>Q${currentQuestion + 1}. ${q.text}</h3>`;

    q.options.forEach((opt, index) => {
        card.innerHTML += `
            <label class="option">
                <input type="radio" name="option" value="${index}"
                ${selectedAnswers[currentQuestion] == index ? "checked" : ""}
                ${submitted ? "disabled" : ""}>
                ${opt}
            </label>
        `;
    });

    quizContainer.appendChild(card);

    if (submitted) {
        if (selectedAnswers[currentQuestion] == q.correct) {
            card.classList.add("correct");
        } else {
            card.classList.add("incorrect");
        }
    }

    updateProgress();
    updatePalette();
}

function updatePalette() {
    palette.innerHTML = "";

    questions.forEach((_, index) => {
        let btn = document.createElement("button");
        btn.innerText = index + 1;
        btn.className = "palette-btn";

        if (submitted) {
            if (selectedAnswers[index] == questions[index].correct) {
                btn.classList.add("palette-correct");
            } else {
                btn.classList.add("palette-wrong");
            }
        }

        btn.onclick = () => {
            currentQuestion = index;
            loadQuestion();
        };

        palette.appendChild(btn);
    });
}

function updateProgress() {
    let answered = Object.keys(selectedAnswers).length;
    progress.innerHTML = `Answered: ${answered}/${questions.length}`;
}

quizContainer.addEventListener("change", (e) => {
    if (submitted) return;

    selectedAnswers[currentQuestion] = parseInt(e.target.value);
    localStorage.setItem("answers", JSON.stringify(selectedAnswers));
    updateProgress();
});

let timer = setInterval(() => {
    if (timeLeft <= 0 || submitted) {
        clearInterval(timer);
        submitQuiz();
    }
    timerBox.innerText = `Time Left: ${timeLeft--}s`;
}, 1000);

nextBtn.onclick = () => {
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        loadQuestion();
    }
};

prevBtn.onclick = () => {
    if (currentQuestion > 0) {
        currentQuestion--;
        loadQuestion();
    }
};

function submitQuiz() {
    if (submitted) return;

    submitted = true;
    localStorage.setItem("submitted", true);

    let score = 0;
    questions.forEach((q, index) => {
        if (selectedAnswers[index] == q.correct) score++;
    });

    scoreBox.innerHTML = `Your Score: ${score}/${questions.length}`;
    loadQuestion();
}

submitBtn.onclick = submitQuiz;

resetBtn.onclick = () => {
    localStorage.clear();
    location.reload();
};

loadQuestion();

if (submitted) {
    submitQuiz();
}             
