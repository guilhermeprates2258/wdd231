document.addEventListener("DOMContentLoaded", () => {
    const businessList = document.getElementById("business-list");
    const gridButton = document.getElementById("grid");
    const listButton = document.getElementById("list");

    // Mapeamento de níveis
    const nivelMap = {
        1: "Membro",
        2: "Prata",
        3: "Ouro"
    };

    // Função para carregar os membros (empresas)
    async function fetchMembers() {
        try {
            const response = await fetch("data/members.json");
            if (!response.ok) {
                throw new Error("Erro ao carregar o arquivo JSON");
            }
            const members = await response.json();
            // Filtra apenas os membros com nível "Prata" ou "Ouro"
            const filteredMembers = members.filter(member => member.nivel === 2 || member.nivel === 3);
            displayMembers(filteredMembers); // Passa os membros filtrados para a função displayMembers
        } catch (error) {
            console.error("Erro ao carregar os membros:", error);
            businessList.innerHTML = "<p>Não foi possível carregar as empresas.</p>";
        }
    }

    // Função para exibir os membros no HTML
    function displayMembers(members) {
        if (!businessList) return;
        businessList.innerHTML = ""; // Limpa a lista atual

        members.forEach(member => {
            const card = document.createElement("div");
            card.classList.add("business");

            // Estrutura do card
            card.innerHTML = `
                <img src="images/${member.imagem}" alt="${member.nome}">
                <h3>${member.nome}</h3>
                <p><strong>Endereço:</strong> ${member.endereco}</p>
                <p><strong>Telefone:</strong> ${member.telefone}</p>
                <p><strong>Site:</strong> <a href="${member.site}" target="_blank">${member.site}</a></p>
                <p><strong>Nível:</strong> ${nivelMap[member.nivel] || "Desconhecido"}</p>
                <p>${member.descricao}</p>
            `;
            businessList.appendChild(card);
        });
    }

    // Alternar entre grade e lista
    if (gridButton && listButton) {
        gridButton.addEventListener("click", () => {
            businessList.classList.remove("list-view");
            businessList.classList.add("grid-view"); // Adiciona a classe para a visualização em grade
        });

        listButton.addEventListener("click", () => {
            businessList.classList.remove("grid-view");
            businessList.classList.add("list-view"); // Adiciona a classe para a visualização em lista
        });
    }

    // Carregar os membros assim que a página estiver carregada
    fetchMembers();


    // Função para carregar o clima de Maringá usando a API OpenWeatherMap
    

    // Função para exibir o ano atual e a última data de modificação
    function setFooterInfo() {
        const yearElement = document.getElementById("year");
        const lastModifiedElement = document.getElementById("last-modified");

        if (yearElement) {
            const currentYear = new Date().getFullYear();
            yearElement.textContent = `© ${currentYear} Câmara de Comércio de Maringá. Todos os direitos reservados.`;
        }

        if (lastModifiedElement) {
            const lastModifiedDate = new Date(document.lastModified);
            const formattedDate = lastModifiedDate.toLocaleString("pt-BR", {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric'
            });
            lastModifiedElement.textContent = `Última modificação: ${formattedDate}`;
        }
    }

    // Chamar a função para definir as informações do rodapé
    setFooterInfo();
});

document.addEventListener("DOMContentLoaded", async () => {
    async function fetchWeather() {
        const apiKey = '114e56158e95aa755cff019549bdaf60'; // Substitua com sua API Key
        const city = 'Maringá,BR'; // Cidade para consulta

        try {
            // Consulta ao clima atual
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&lang=pt_br&units=metric`);
            if (!response.ok) throw new Error("Erro ao carregar o clima atual");

            const data = await response.json();
            document.getElementById("current-temp").textContent = `${Math.round(data.main.temp)}°C`;
            document.getElementById("current-condition").textContent = data.weather[0].description;

            // Consulta à previsão de 7 dias
            const { lat, lon } = data.coord;
            const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&lang=pt_br&units=metric`);
            if (!forecastResponse.ok) throw new Error("Erro ao carregar a previsão do tempo");

            const forecastData = await forecastResponse.json();
            document.getElementById("forecast-today").textContent = `Hoje: ${Math.round(forecastData.list[0].main.temp)}°C - ${forecastData.list[0].weather[0].description}`;

            let forecastWeek = '';
            for (let i = 0; i < 5; i++) {
                const day = forecastData.list[i * 8]; // Pega previsões diárias a cada 24h (~8 blocos de 3h)
                forecastWeek += `Dia ${i + 1}: ${Math.round(day.main.temp)}°C - ${day.weather[0].description}\n`;
            }
            document.getElementById("forecast-week").textContent = forecastWeek;

        } catch (error) {
            console.error("Erro ao buscar o clima:", error);
        }
    }

    // Chamar a função para carregar o clima
    fetchWeather();
});

document.addEventListener("DOMContentLoaded", function () {
    const directory = document.getElementById("directory");

    if (!directory) {
        console.error("Elemento #directory não encontrado!");
        return;
    }

    directory.innerHTML = "<p>Carregando empresas...</p>";

    fetch("data/members.json")
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro HTTP! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Dados carregados:", data); // LOG PARA VERIFICAR SE O JSON ESTÁ CARREGANDO
            directory.innerHTML = ""; 

            data.forEach(empresa => {
                console.log("Criando card para:", empresa.nome); // LOG PARA VERIFICAR SE OS CARDS ESTÃO SENDO CRIADOS

                let card = document.createElement("div");
                card.classList.add("card", `nivel-${empresa.nivel}`);

                card.innerHTML = `
                    <img src="images/${empresa.imagem}" alt="${empresa.nome}" onerror="this.onerror=null;this.src='images/default.png';">
                    <h2>${empresa.nome}</h2>
                    <p><strong>Endereço:</strong> ${empresa.endereco}</p>
                    <p><strong>Telefone:</strong> ${empresa.telefone}</p>
                    <p><strong>Descrição:</strong> ${empresa.descricao}</p>
                    <a href="${empresa.site}" target="_blank">Visitar Site</a>
                `;

                directory.appendChild(card);
            });
        })
        .catch(error => {
            directory.innerHTML = "<p>Erro ao carregar os dados.</p>";
            console.error("Erro ao carregar o JSON:", error);
        });
});


document.addEventListener("DOMContentLoaded", function () {
    const gridViewBtn = document.getElementById("gridView");
    const listViewBtn = document.getElementById("listView");
    const directory = document.getElementById("directory");

    // Alterna para a visualização em grade
    gridViewBtn.addEventListener("click", () => {
        directory.classList.remove("list-view");
        gridViewBtn.classList.add("active");
        listViewBtn.classList.remove("active");
    });

    // Alterna para a visualização em lista
    listViewBtn.addEventListener("click", () => {
        directory.classList.add("list-view");
        listViewBtn.classList.add("active");
        gridViewBtn.classList.remove("active");
    });
});

// Modal functionality
const modals = document.querySelectorAll('.modal');
const modalTriggers = document.querySelectorAll('.modal-trigger');
const closeButtons = document.querySelectorAll('.close');

modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', (event) => {
        const target = document.querySelector(trigger.dataset.target);
        
        // Pega o card e posiciona o modal abaixo dele
        const card = trigger.closest('.card');
        
        // Define a posição do modal
        target.style.display = 'block';
        target.style.left = card.offsetLeft + 'px';  // Alinha à esquerda do card
        target.style.top = card.offsetTop + card.offsetHeight + 10 + 'px'; // Coloca logo abaixo do card
    });
});

closeButtons.forEach(button => {
    button.addEventListener('click', () => {
        button.closest('.modal').style.display = 'none';
    });
});

document.addEventListener("DOMContentLoaded", function () {
    // Carregar os dados de itens de interesse do arquivo JSON
    fetch('data/data.json')
        .then(response => response.json())
        .then(data => {
            const container = document.querySelector('.cards-container3');
            data.forEach((item, index) => {
                const card = document.createElement('div');
                card.classList.add('card');
                card.innerHTML = `
                    <h2>${item.title}</h2>
                    <figure>
                        <img src="images/${item.image}" alt="${item.title}">
                    </figure>
                    <address>${item.address}</address>
                    <p>${item.description}</p>
                    <button>Saiba mais</button>
                `;
                container.appendChild(card);
            });
        })
        .catch(error => {
            console.error("Erro ao carregar os dados dos itens de interesse:", error);
        });

    // Armazenar e mostrar a última visita usando localStorage
    const lastVisitMessage = document.getElementById('last-visit-message');
    const lastVisit = localStorage.getItem('lastVisit');
    const now = Date.now();

    if (!lastVisit) {
        lastVisitMessage.innerText = 'Bem-vindo! Informe-nos se tiver alguma dúvida.';
    } else {
        const daysDiff = Math.floor((now - lastVisit) / (1000 * 3600 * 24));
        if (daysDiff < 1) {
            lastVisitMessage.innerText = 'Voltei logo! Incrível!';
        } else {
            lastVisitMessage.innerText = `Sua última visita foi há ${daysDiff} ${daysDiff === 1 ? 'dia' : 'dias'}.`;
        }
    }

    localStorage.setItem('lastVisit', now);

    // Exibir a data de modificação e o ano
    document.getElementById('last-modified').textContent = `Última modificação: ${document.lastModified}`;
    document.getElementById('year').textContent = new Date().getFullYear();
});
// Menu Hambúrguer
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
});
