const tbody = document.querySelector("tbody");
const descItem = document.querySelector("#desc");
const amount = document.querySelector("#amount");
const type = document.querySelector("#type");
const person = document.querySelector("#person");
const card = document.querySelector("#card");
const month = document.querySelector("#month");
const btnNew = document.querySelector("#btnNew");

// Filtros
const filterType = document.querySelector("#filterType");
const filterMonth = document.querySelector("#filterMonth");
const filterPerson = document.querySelector("#filterPerson");

const incomes = document.querySelector(".incomes");
const expenses = document.querySelector(".expenses");
const total = document.querySelector(".total");

let items = [];

// Adiciona novo item
btnNew.addEventListener("click", () => {
  if (descItem.value.trim() === "" || amount.value.trim() === "" || type.value === "") {
    return alert("Preencha os campos Descrição, Valor e Tipo!");
  }

  const amountValue = parseFloat(amount.value);
  if (isNaN(amountValue) || amountValue <= 0) {
    return alert("O valor deve ser um número positivo.");
  }

  const newItem = {
    desc: descItem.value.trim(),
    amount: amountValue.toFixed(2),
    type: type.value,
    person: person.value || "",  // Campos opcionais
    card: card.value || "",      // Campos opcionais
    month: month.value || ""     // Campos opcionais
  };

  items.push(newItem);

  setItensBD();
  loadItens();

  descItem.value = "";
  amount.value = "";
  type.value = "";
  person.value = "";
  card.value = "";
  month.value = "";

  alert("Item adicionado com sucesso!");
});

// Remove item
function deleteItem(index) {
  if (confirm("Tem certeza de que deseja excluir este item?")) {
    items.splice(index, 1);
    setItensBD();
    loadItens();
    alert("Item excluído com sucesso!");
  }
}

// Insere item na tabela
function insertItem(item, index) {
  const tr = document.createElement("tr");

  tr.innerHTML = `
    <td>${item.desc}</td>
    <td>R$ ${item.amount}</td>
    <td>${item.person}</td>
    <td>${item.card}</td>
    <td>${item.month}</td>
    <td class="columnType">
      ${
  item.type === "Entrada"
    ? '<i class="bx bxs-chevron-up-circle entrada-icon"></i>'
    : '<i class="bx bxs-chevron-down-circle saida-icon"></i>'
}

    </td>
    <td class="columnAction">
      <button onclick="deleteItem(${index})"><i class='bx bx-trash'></i></button>
    </td>
  `;

  tbody.appendChild(tr);
}

// Carrega itens da tabela
function loadItens() {
  items = getItensBD();
  tbody.innerHTML = "";
  const typeFilter = filterType.value;
  const monthFilter = filterMonth.value;
  const personFilter = filterPerson.value;

  const filteredItems = items.filter(item => 
    (typeFilter === "" || item.type === typeFilter) &&
    (monthFilter === "" || item.month === monthFilter) &&
    (personFilter === "" || item.person === personFilter)
  );

  filteredItems.forEach((item, index) => {
    insertItem(item, index);
  });

  getTotals(filteredItems);
}

// Calcula os totais
function getTotals(filteredItems) {
  const amountIncomes = filteredItems
    .filter(item => item.type === "Entrada")
    .reduce((acc, item) => acc + parseFloat(item.amount), 0);

  const amountExpenses = filteredItems
    .filter(item => item.type === "Saída")
    .reduce((acc, item) => acc + parseFloat(item.amount), 0);

  const totalIncomes = amountIncomes.toFixed(2);
  const totalExpenses = amountExpenses.toFixed(2);
  const totalItems = (amountIncomes - amountExpenses).toFixed(2);

  incomes.innerHTML = totalIncomes;
  expenses.innerHTML = totalExpenses;
  total.innerHTML = totalItems;
}

// Funções para armazenamento no localStorage
const getItensBD = () => JSON.parse(localStorage.getItem("db_items")) || [];
const setItensBD = () => localStorage.setItem("db_items", JSON.stringify(items));

// Inicialização
loadItens();

// Adiciona event listeners para os filtros
filterType.addEventListener("change", loadItens);
filterMonth.addEventListener("change", loadItens);
filterPerson.addEventListener("change", loadItens);
