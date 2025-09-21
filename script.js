// Quiz questions and answers
const questions = [
    { question: "1. Which is the largest desert in the world?", options: ["Thar Desert", "Sahara Desert", "Kalahari Desert", "Gobi Desert"], answer: "Sahara Desert" },
    { question: "2. Who invented the light bulb?", options: ["Alexander Graham Bell", "Thomas Alva Edison", "James Watt", "Albert Einstein"], answer: "Thomas Alva Edison" },
    { question: "3. Which is the longest river in India?", options: ["Ganga", "Yamuna", "Brahmaputra", "Godavari"], answer: "Ganga" },
    { question: "4. Which is the highest mountain peak in the world?", options: ["Kanchenjunga", "K2", "Mount Everest", "Nanda Devi"], answer: "Mount Everest" },
    { question: "5. Who is known as the \"Missile Man of India\"?", options: ["Homi Bhabha", "A.P.J. Abdul Kalam", "Vikram Sarabhai", "C.V. Raman"], answer: "A.P.J. Abdul Kalam" },
    { question: "6. What is the currency of Japan?", options: ["Yen", "Yuan", "Dollar", "Won"], answer: "Yen" },
    { question: "7. Which gas do plants release during photosynthesis?", options: ["Carbon dioxide", "Nitrogen", "Oxygen", "Hydrogen"], answer: "Oxygen" },
    { question: "8. Who was the first woman President of India?", options: ["Sarojini Naidu", "Indira Gandhi", "Pratibha Patil", "Sonia Gandhi"], answer: "Pratibha Patil" },
    { question: "9. Which is the national aquatic animal of India?", options: ["Dolphin", "Crocodile", "Whale", "Shark"], answer: "Dolphin" },
    { question: "10. Who discovered gravity when an apple fell from a tree?", options: ["Galileo Galilei", "Albert Einstein", "Isaac Newton", "Charles Darwin"], answer: "Isaac Newton" },
    { question: "11. Which Mughal Emperor built the Taj Mahal?", options: ["Akbar", "Aurangzeb", "Shah Jahan", "Humayun"], answer: "Shah Jahan" },
    { question: "12. Which Indian city is called the “Pink City”?", options: ["Jaipur", "Jodhpur", "Udaipur", "Bikaner"], answer: "Jaipur" },
    { question: "13. Who was the first Indian woman to go to space?", options: ["Sunita Williams", "Kalpana Chawla", "Indira Gandhi", "Sarojini Naidu"], answer: "Kalpana Chawla" },
    { question: "14. Which state of India is known as the \"Land of Rising Sun\"?", options: ["Sikkim", "Arunachal Pradesh", "Assam", "Manipur"], answer: "Arunachal Pradesh" },
    { question: "15. Which planet has the most moons?", options: ["Earth", "Jupiter", "Saturn", "Neptune"], answer: "Saturn" },
    { question: "16. Who is the author of the book Discovery of India?", options: ["Rabindranath Tagore", "Mahatma Gandhi", "Jawaharlal Nehru", "Subhash Chandra Bose"], answer: "Jawaharlal Nehru" },
    { question: "17. What is the study of earthquakes called?", options: ["Geology", "Seismology", "Astrology", "Meteorology"], answer: "Seismology" },
    { question: "18. Which was the first satellite launched by India?", options: ["INSAT-1A", "Aryabhata", "Bhaskara", "Rohini"], answer: "Aryabhata" },
    { question: "19. Who gave the slogan “Jai Jawan, Jai Kisan”?", options: ["Mahatma Gandhi", "Lal Bahadur Shastri", "Jawaharlal Nehru", "Subhash Chandra Bose"], answer: "Lal Bahadur Shastri" },
    { question: "20. What is the official language of Bhutan?", options: ["Hindi", "Dzongkha", "Nepali", "Tibetan"], answer: "Dzongkha" }
];

// DOM element references
const introScreen = document.getElementById('intro-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const nameForm = document.getElementById('name-form');
const userNameInput = document.getElementById('name');
const questionElement = document.getElementById('question');
const optionsContainer = document.getElementById('options-container');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const submitBtn = document.getElementById('submit-btn');
const timerFill = document.getElementById('timer-fill');
const scoreDisplay = document.getElementById('score-display');
const performanceMessage = document.getElementById('performance-message');
const pieChartCanvas = document.getElementById('pieChart');
const correctAnswersDisplay = document.getElementById('correct-answers');
const incorrectAnswersDisplay = document.getElementById('incorrect-answers');
const answersReview = document.getElementById('answers-review');
const restartBtn = document.getElementById('restart-btn');

// Quiz state variables
let currentQuestionIndex = 0;
let userAnswers = new Array(questions.length).fill(null);
let score = 0;
let timer;
let timeLeft = 300; // 5 minutes in seconds
let userName = '';

// Google Form Details - **IMPORTANT: REPLACE THESE WITH YOUR FORM'S ENTRY IDs**
const googleFormActionUrl = "https://docs.google.com/forms/d/e/1FAIpQLSeNH3Ec9SKehJLS_AMy5wRQNagRHghV3uF3ZVOir3jrFPIE1g/formResponse";
// To find these IDs:
// 1. Open your Google Form in a browser.
// 2. Right-click the "Your Name" input field and select "Inspect".
// 3. Find the 'name' attribute, which will look like 'entry.XXXXXXXXX'. This is the nameEntryId.
// 4. Do the same for the "Score" field to find the scoreEntryId.
const nameEntryId = 'entry.1018610583'; 
const scoreEntryId = 'entry.1466088924';

// Start Quiz and timer
nameForm.addEventListener('submit', (e) => {
    e.preventDefault();
    userName = userNameInput.value.trim();
    if (userName) {
        introScreen.style.display = 'none';
        quizScreen.style.display = 'block';
        startTimer();
        loadQuestion();
    }
});

function startTimer() {
    timerFill.style.transition = `width ${timeLeft}s linear`;
    timerFill.style.width = '0%';

    timer = setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0) {
            clearInterval(timer);
            submitQuiz();
        }
    }, 1000);
}

// Load current question and its options
function loadQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    questionElement.textContent = currentQuestion.question;
    optionsContainer.innerHTML = '';

    currentQuestion.options.forEach(option => {
        const button = document.createElement('button');
        button.classList.add('option-btn');
        button.textContent = option;
        button.addEventListener('click', () => selectAnswer(option));
        
        // Highlight the user's previously selected answer
        if (userAnswers[currentQuestionIndex] === option) {
            button.classList.add('selected');
        }

        optionsContainer.appendChild(button);
    });

    updateNavigationButtons();
}

// Handle answer selection
function selectAnswer(option) {
    userAnswers[currentQuestionIndex] = option;
    // Remove 'selected' class from all options
    document.querySelectorAll('.option-btn').forEach(btn => btn.classList.remove('selected'));
    // Add 'selected' class to the clicked option
    event.target.classList.add('selected');
}

// Update navigation button visibility
function updateNavigationButtons() {
    prevBtn.style.display = currentQuestionIndex > 0 ? 'inline-block' : 'none';
    if (currentQuestionIndex === questions.length - 1) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'inline-block';
    } else {
        nextBtn.style.display = 'inline-block';
        submitBtn.style.display = 'none';
    }
}

// Navigation event listeners
nextBtn.addEventListener('click', () => {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        loadQuestion();
    }
});

prevBtn.addEventListener('click', () => {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        loadQuestion();
    }
});

// Submit the quiz
submitBtn.addEventListener('click', submitQuiz);

function submitQuiz() {
    clearInterval(timer);
    calculateScore();
    showResults();
    submitToGoogleForm();
}

// Calculate the final score
function calculateScore() {
    score = 0;
    userAnswers.forEach((answer, index) => {
        if (answer === questions[index].answer) {
            score++;
        }
    });
}

// Display results and performance
function showResults() {
    quizScreen.style.display = 'none';
    resultScreen.style.display = 'block';

    scoreDisplay.textContent = `${score} / ${questions.length}`;
    
    let message = '';
    if (score <= 10) {
        message = 'Very bad performance';
    } else if (score >= 11 && score <= 15) {
        message = 'Good performance';
    } else {
        message = 'Very good performance';
    }
    performanceMessage.textContent = message;

    const correct = score;
    const incorrect = questions.length - score;
    correctAnswersDisplay.textContent = correct;
    incorrectAnswersDisplay.textContent = incorrect;

    // Create the pie chart
    new Chart(pieChartCanvas, {
        type: 'pie',
        data: {
            labels: ['Correct', 'Incorrect'],
            datasets: [{
                data: [correct, incorrect],
                backgroundColor: ['#28a745', '#dc3545'], // Green for correct, Red for incorrect
            }]
        },
        options: {
            responsive: true,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed;
                            return `${label}: ${value}`;
                        }
                    }
                }
            }
        }
    });

    // Review each question's answer
    answersReview.innerHTML = '';
    questions.forEach((q, index) => {
        const userAns = userAnswers[index];
        const correctAns = q.answer;
        const isCorrect = userAns === correctAns;

        const reviewItem = document.createElement('div');
        reviewItem.classList.add('review-item', isCorrect ? 'correct' : 'incorrect');

        const questionText = document.createElement('p');
        questionText.classList.add('question-text');
        questionText.innerHTML = `<strong>${q.question}</strong>`;
        
        const yourAnswer = document.createElement('p');
        yourAnswer.innerHTML = `Your Answer: <span class="${isCorrect ? 'correct' : 'incorrect'}-answer">${userAns || 'Not attempted'}</span>`;

        const correctAnswer = document.createElement('p');
        correctAnswer.classList.add('correct-answer');
        correctAnswer.innerHTML = `Correct Answer: <span class="correct-answer">${correctAns}</span>`;

        reviewItem.appendChild(questionText);
        reviewItem.appendChild(yourAnswer);
        if (!isCorrect) {
            reviewItem.appendChild(correctAnswer);
        }
        
        answersReview.appendChild(reviewItem);
    });
}

// Submit data to Google Form using Fetch API
function submitToGoogleForm() {
    const formData = new FormData();
    formData.append(nameEntryId, userName);
    formData.append(scoreEntryId, score);

    // This URLSearchParams method correctly formats the data for a form submission
    const formUrlEncoded = new URLSearchParams(formData).toString();

    // Use a hidden iframe to prevent CORS issues
    const iframe = document.createElement('iframe');
    iframe.name = 'google-form-iframe';
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    const form = document.createElement('form');
    form.action = googleFormActionUrl;
    form.method = 'POST';
    form.target = 'google-form-iframe';

    const nameInput = document.createElement('input');
    nameInput.type = 'hidden';
    nameInput.name = nameEntryId;
    nameInput.value = userName;

    const scoreInput = document.createElement('input');
    scoreInput.type = 'hidden';
    scoreInput.name = scoreEntryId;
    scoreInput.value = score;

    form.appendChild(nameInput);
    form.appendChild(scoreInput);
    document.body.appendChild(form);

    form.submit();
    document.body.removeChild(form);
    document.body.removeChild(iframe);

    console.log('Data submitted to Google Form.');
}

// Restart Quiz by reloading the page
restartBtn.addEventListener('click', () => {
    location.reload();
});
