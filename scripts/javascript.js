// Atualiza o copyright e última modificação
const currentYear = new Date().getFullYear();
document.getElementById("copyright").textContent = `© ${currentYear} Guilherme Prates Batista`;

const lastModified = document.lastModified;
document.getElementById("last-modified").textContent = `Last modification: ${lastModified}`;

// Dados dos cursos
const courses = [
    { subject: 'CSE', number: 110, credits: 2, completed: true },
    { subject: 'WDD', number: 130, credits: 2, completed: true },
    { subject: 'CSE', number: 111, credits: 2, completed: true },
    { subject: 'CSE', number: 210, credits: 2, completed: true },
    { subject: 'WDD', number: 131, credits: 2, completed: true },
    { subject: 'WDD', number: 231, credits: 2, completed: false },
];

const courseContainer = document.getElementById("course-container");
const totalCreditsElement = document.getElementById("total-credits");
const filterButtons = document.querySelectorAll(".filter-btn");

// Função para renderizar cursos
function renderCourses(filteredCourses) {
    // Limpa o contêiner de cursos
    courseContainer.innerHTML = "";

    // Calcula o total de créditos usando reduce
    const totalCredits = filteredCourses.reduce((sum, course) => sum + course.credits, 0);
    totalCreditsElement.textContent = `Total Credits: ${totalCredits}`;

    // Renderiza os cursos
    filteredCourses.forEach(course => {
        const card = document.createElement("div");
        card.className = `course-card ${course.completed ? "completed" : "not-completed"}`;
        card.innerHTML = `
            <h3>${course.subject} ${course.number}</h3>
        `;
        courseContainer.appendChild(card);
    });
}

// Filtra os cursos com base no botão clicado
function filterCourses(filter) {
    let filteredCourses;
    if (filter === "all") {
        filteredCourses = courses;
    } else {
        filteredCourses = courses.filter(course => course.subject === filter);
    }
    renderCourses(filteredCourses);
}

// Adiciona evento de clique aos botões de filtro
filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        const filter = button.getAttribute("data-filter");
        filterCourses(filter);
    });
});

// Renderiza todos os cursos inicialmente
filterCourses("all");
