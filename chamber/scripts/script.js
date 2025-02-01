document.addEventListener("DOMContentLoaded", () => {
    const businessList = document.getElementById("business-list");
    const gridButton = document.getElementById("grid");
    const listButton = document.getElementById("list");

    // Função para carregar os membros (empresas)
    async function fetchMembers() {
        try {
            const response = await fetch("data/members.json");
            if (!response.ok) {
                throw new Error("Erro ao carregar o arquivo JSON");
            }
            const members = await response.json();
            displayMembers(members);
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
                <p><strong>Nível:</strong> ${["Membro", "Prata", "Ouro"][member.nivel - 1]}</p>
                <p>${member.descricao}</p>
            `;
            businessList.appendChild(card);
        });
    }

    // Alternar entre grade e lista
    if (gridButton && listButton) {
        gridButton.addEventListener("click", () => {
            businessList.classList.remove("list-view");
            businessList.classList.add("grid-view");
        });

        listButton.addEventListener("click", () => {
            businessList.classList.remove("grid-view");
            businessList.classList.add("list-view");
        });
    }

    // Carregar os membros
    fetchMembers();

    // Função para carregar o clima de Maringá usando a API OpenWeatherMap
    async function fetchWeather() {
        const apiKey = 'SUA_API_KEY'; // Substitua com sua chave de API do OpenWeatherMap
        const city = 'Maringá,BR'; // Cidade para consulta

        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&lang=pt_br&units=metric`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            // Atualizar informações do clima
            if (data && data.main) {
                document.getElementById("current-temp").textContent = `${Math.round(data.main.temp)}°C`;
                document.getElementById("current-condition").textContent = data.weather[0].description;
            }

            // Função para previsão do tempo para o dia e a semana
            const forecastUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&exclude=current,minutely,hourly&appid=${apiKey}&lang=pt_br&units=metric`;

            const forecastResponse = await fetch(forecastUrl);
            const forecastData = await forecastResponse.json();

            // Previsão do dia
            document.getElementById("forecast-today").textContent = `Hoje: ${Math.round(forecastData.daily[0].temp.day)}°C - ${forecastData.daily[0].weather[0].description}`;

            // Previsão da semana
            let forecastWeek = '';
            for (let i = 1; i <= 5; i++) {
                forecastWeek += `Dia ${i}: ${Math.round(forecastData.daily[i].temp.day)}°C - ${forecastData.daily[i].weather[0].description}\n`;
            }
            document.getElementById("forecast-week").textContent = forecastWeek;

        } catch (error) {
            console.error("Erro ao carregar o clima:", error);
        }
    }

    // Carregar clima de Maringá
    fetchWeather();

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