document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll("nav a");
    const searchBox = document.querySelector("#search");
    const foodList = document.querySelector(".food-list");
    const foodItemTemplate = document.querySelector("#food-item-template");
    const selectedFoodsList = document.querySelector("#selected-foods-list");
    const totalHC = document.querySelector("#total-hc");
    const totalCalories = document.querySelector("#total-calories");
    const totalLipids = document.querySelector("#total-lipids");
    const totalProteins = document.querySelector("#total-proteins");

    // Inicializa o Select2 nos elementos select
    $('#doencas').select2({
        placeholder: "Selecione as doenças",
        allowClear: true
    });

    $('#alergenios').select2({
        placeholder: "Selecione os alérgenos",
        allowClear: true,
        templateResult: formatState,
        templateSelection: formatState
    });

    $('#input-refeicao').select2({
        placeholder: "Selecione a refeição",
        minimumResultsForSearch: Infinity // Remove a barra de pesquisa
    });

    function formatState(state) {
        if (!state.id) {
            return state.text;
        }
        const baseUrl = "path/to/your/images"; // Substitua pelo caminho correto das suas imagens
        const $state = $(
            `<span><img src="${baseUrl}/AL_${state.element.value}.png" class="img-flag" /> ${state.text}</span>`
        );
        return $state;
    }

    // Dados dos alimentos
    const foodData = [
        { name: "Maçã", imgSrc: "apple.png", details: "HC: 55g | kcal: 21 Prot: 231g | Lip: 10g" },
        { name: "Tomate", imgSrc: "tomato.png", details: "HC: 3g | kcal: 18 Prot: 1g | Lip: 0g" },
        { name: "Arroz", imgSrc: "arroz.png", details: "HC: 28g | kcal: 130 Prot: 2.7g | Lip: 0.3g" },
        { name: "Batata", imgSrc: "potato.png", details: "HC: 17g | kcal: 77 Prot: 2g | Lip: 0.1g" },
        { name: "Frango assado", imgSrc: "frangoassado.png", details: "HC: 17g | kcal: 77 Prot: 2g | Lip: 0.1g" }
        // Adicione mais itens de alimentos aqui
    ];

    let selectedFoods = {};

    // Função para adicionar um item de alimento
    function addFoodItem(food) {
        const foodItem = foodItemTemplate.content.cloneNode(true);
        foodItem.querySelector("h2").textContent = food.name;
        foodItem.querySelector("img").src = food.imgSrc;
        foodItem.querySelector("img").alt = food.name;
        foodItem.querySelector(".details p").textContent = food.details;

        // Cria e adiciona o contador de quantidade
        const countDisplay = document.createElement("div");
        countDisplay.className = "count";
        countDisplay.textContent = "0";
        foodItem.querySelector(".food-item").appendChild(countDisplay);

        let count = 0;

        // Adiciona eventos de clique para aumentar a quantidade
        foodItem.querySelector(".food-item").addEventListener("click", (e) => {
            if (e.button === 0) {
                const isMinusButton = e.target.classList.contains("minus");
                const isPlusButton = e.target.classList.contains("plus");
                const isMassInput = e.target.classList.contains("mass-input");

                if (!isMinusButton && !isPlusButton && !isMassInput) {
                    count++;
                    countDisplay.textContent = count;
                    updateSelectedFoods(food.name, count);
                }
            }
        });

        // Adiciona evento de clique com o botão direito para alternar a classe ativa
        foodItem.querySelector(".food-item").addEventListener("contextmenu", (e) => {
            e.preventDefault();
            const foodItemElement = e.currentTarget;
            foodItemElement.classList.toggle("active");
            const detailsElement = foodItemElement.querySelector(".details");
            detailsElement.style.display = foodItemElement.classList.contains("active") ? "block" : "none";
        });
        

        const minusBtn = foodItem.querySelector(".minus");
        const plusBtn = foodItem.querySelector(".plus");

        // Adiciona eventos de clique para diminuir a quantidade
        minusBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (count > 0) {
                count--;
                countDisplay.textContent = count;
                updateSelectedFoods(food.name, count);
            }
        });

        // Adiciona eventos de clique para aumentar a quantidade
        plusBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            count++;
            countDisplay.textContent = count;
            updateSelectedFoods(food.name, count);
        });

        foodList.appendChild(foodItem);
    }

    // Função para atualizar os alimentos selecionados
    function updateSelectedFoods(name, count) {
        if (count > 0) {
            selectedFoods[name] = count;
        } else {
            delete selectedFoods[name];
        }
        renderSelectedFoods();
        calculateTotals();
    }

    // Função para renderizar os alimentos selecionados
    function renderSelectedFoods() {
        selectedFoodsList.innerHTML = "";
        for (const [name, count] of Object.entries(selectedFoods)) {
            const li = document.createElement("li");
            li.textContent = `${name} ${count}x`;
            selectedFoodsList.appendChild(li);
        }
    }

    // Função para calcular os totais
    function calculateTotals() {
        let totalHCValue = 0;
        let totalCaloriesValue = 0;
        let totalLipidsValue = 0;
        let totalProteinsValue = 0;

        for (const [name, count] of Object.entries(selectedFoods)) {
            const food = foodData.find(f => f.name === name);
            const details = food.details.match(/(\d+\.?\d*)/g);
            totalHCValue += parseFloat(details[0]) * count;
            totalCaloriesValue += parseFloat(details[1]) * count;
            totalLipidsValue += parseFloat(details[2]) * count;
            totalProteinsValue += parseFloat(details[3]) * count;
        }

        totalHC.textContent = `${totalHCValue}g`;
        totalCalories.textContent = `${totalCaloriesValue}kcal`;
        totalLipids.textContent = `${totalLipidsValue}g`;
        totalProteins.textContent = `${totalProteinsValue}g`;
    }

    // Adiciona todos os itens de alimentos
    foodData.forEach(addFoodItem);

    // Adiciona eventos de clique para os links de navegação
    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const target = link.getAttribute("href").substring(1);

            sections.forEach(section => {
                if (section.id === target) {
                    section.style.display = "block";
                } else {
                    section.style.display = "none";
                }
            });
        });
    });

    // Adiciona evento de input para a caixa de pesquisa
    searchBox.addEventListener("input", (e) => {
        const searchValue = e.target.value.toLowerCase();
        const foodItems = document.querySelectorAll(".food-item");
        foodItems.forEach(item => {
            const foodName = item.querySelector("h2").textContent.toLowerCase();
            if (foodName.includes(searchValue)) {
                item.style.display = "block";
            } else {
                item.style.display = "none";
            }
        });
    });
});

// Calculo da Insulina:
function calcularInsulina() {
    const glicemia = document.getElementById('input-glicemia').value;
    const indice = document.getElementById('input-indice').value;
    const refeicao = document.getElementById('input-refeicao').value;
    const hcPequenoAlmoco = document.getElementById('hc_pequeno_almoco').value;
    const hcLancheManha = document.getElementById('hc_lanche_manha').value;
    const hcAlmoco = document.getElementById('hc_almoco').value;
    const hcLancheTarde = document.getElementById('hc_lanche_tarde').value;
    const hcJantar = document.getElementById('hc_jantar').value;
    const hcOutro = document.getElementById('hc_outro').value;

    let hcPorUnidade = 0;

    switch (refeicao) {
        case 'pequeno_almoco':
            hcPorUnidade = hcPequenoAlmoco;
            break;
        case 'lanche_manha':
            hcPorUnidade = hcLancheManha;
            break;
        case 'almoco':
            hcPorUnidade = hcAlmoco;
            break;
        case 'lanche_tarde':
            hcPorUnidade = hcLancheTarde;
            break;
        case 'jantar':
            hcPorUnidade = hcJantar;
            break;
        case 'outro':
            hcPorUnidade = hcOutro;
            break;
        case 'correcao':
            hcPorUnidade = 0; // Correção não usa HC por unidade de insulina
            break;
        default:
            hcPorUnidade = 0;
    }

    // Obtém o valor total de HC da refeição selecionada
    const totalHCValue = parseFloat(document.getElementById('total-hc').textContent);

    let result = 0;

    if (glicemia && indice) {
        if (refeicao === 'correcao') {
            result = (glicemia - 100) / indice;
        } else if (hcPorUnidade) {
            result = (glicemia - 100) / indice + totalHCValue / hcPorUnidade;
        }
        document.getElementById('result').innerText = result.toFixed(2);
    } else {
        document.getElementById('result').innerText = '0';
    }
}


// Função para mostrar/ocultar a seção de cálculo de insulina
function toggleInsulinaSection() {
    const doencas = Array.from(document.getElementById('doencas').selectedOptions).map(option => option.value);
    const insulinaSection = document.getElementById('insulina-section');
    const diabetesSection = document.getElementById('diabetes-section');
    if (doencas.includes('diabetes_tipo_1')) {
        insulinaSection.style.display = 'block';
        diabetesSection.style.display = 'block';
    } else {
        insulinaSection.style.display = 'none';
        diabetesSection.style.display = 'none';
    }
}

// Função para mostrar/ocultar o campo de input para "Outro"
function toggleOutroInput() {
    const refeicao = document.getElementById('input-refeicao').value;
    const hcOutroInput = document.getElementById('hc_outro');
    if (refeicao === 'outro') {
        hcOutroInput.style.display = 'block';
    } else {
        hcOutroInput.style.display = 'none';
    }
}
