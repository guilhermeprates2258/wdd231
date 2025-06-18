// Atualiza o ano e a data da última modificação
const currentYear = new Date().getFullYear();
document.getElementById("copyright").textContent = `Ferrera 3D Studio © ${currentYear}`;

const lastModified = document.lastModified;
document.getElementById("last-modified").textContent = `Last modification: ${lastModified}`;

document.addEventListener('DOMContentLoaded', () => {
    // Function 2: Track user interaction and store their favorite project
    const projects = document.querySelectorAll('.second-grid img');
    projects.forEach(project => {
        project.addEventListener('click', () => {
            const projectName = project.alt;
            localStorage.setItem('favoriteProject', projectName);
            alert(`Your favorite project is saved as: ${projectName}`);
        });
    });

    // Conditionally display a message based on localStorage value
    const favoriteProject = localStorage.getItem('favoriteProject');
    if (favoriteProject) {
        const message = document.createElement('p');
        message.textContent = `Your favorite project: ${favoriteProject}`;

        // Ensure there's an element where the message can be appended
        const messageContainer = document.querySelector('#message-container');
        if (messageContainer) {
            messageContainer.appendChild(message);
        } else {
            document.body.appendChild(message); // Default to appending to body if container is missing
        }
    }
});


document.addEventListener("DOMContentLoaded", function() {
    fetch('data/plans.json')
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('plans-container');
            data.forEach(plan => {
                const card = document.createElement('div');
                card.classList.add('plan-card');
                card.innerHTML = `
                    <h3 class="plan-title">${plan.title}</h3>
                    <p class="plan-description">${plan.description}</p>
                    <p class="plan-price">${plan.price}</p>
                    <ul class="plan-services">
                        ${plan.services.map(service => `<li>${service}</li>`).join('')}
                    </ul>
                    <a href="#" class="btn" onclick="selectPlan('${plan.title}')">Escolher Plano</a>
                `;
                container.appendChild(card);
            });
        })
        
});

function selectPlan(plan) {
    // Impede o comportamento padrão do link
    event.preventDefault();
    sessionStorage.setItem("selectedPlan", plan);
}
