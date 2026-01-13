const sectionsDiv = document.getElementById("sections");
let state = {}; // Armazena as fotos para cada seção
let sections = [
  "FRENTE SITE",
  "PORTÃO DE ACESSO - FRENTE",
  "MEDIDOR DE ENERGIA DO SITE",
  "POSTE DE ENTRADA",
  "CAIXA DE PASSAGEM EL/FO",
  "CAIXA DE PASSAGEM EL/FO (ABERTA)",
  "CAIXA DE PASSAGEM TX",
  "CAIXA DE PASSAGEM TX (ABERTA)",
  "VISTA DAS VALAS DE ENCAMINHAMENTO",
  "PONTO 1 - MALHA DE ATERRAMENTO",
  "PONTO 2 - MALHA DE ATERRAMENTO",
  "PONTO 3 - MALHA DE ATERRAMENTO",
  "PONTO 4 - MALHA DE ATERRAMENTO",
  "PONTO 5 - MALHA DE ATERRAMENTO",
  "ENVELOPAMENTO DA LINHA DE DUTOS",
  "BASE DE EQUIPAMENTOS",
  "ESTEIRAMENTO HORIZONTAL",
  "ATERRAMENTO - ESTEIRAMENTO HORIZONTAL",
  "FOTO GERAIS - SITE FINALIZADO"
];

const adminPassword = "Nova@123";  // Senha do administrador

// Função para renderizar as seções no frontend
function renderSections() {
  sections.forEach((section, i) => {
    const div = document.createElement("div");
    div.className = "section";

    div.innerHTML = `
      <h3>Seção ${i + 1}: ${section}</h3>
      <textarea name="text_${i}" placeholder="Observação..." required></textarea>
      <input type="file" name="photos_${i}" accept="image/*" capture="camera" onchange="previewImage(event, ${i})"/>
      <div class="preview" id="preview_${i}"></div>
      <div class="contador" id="counter_${i}"></div>
    `;

    sectionsDiv.appendChild(div);
    renderImages(i); // Renderiza as imagens inicialmente
  });
}

// Função para exibir a foto que foi tirada ou anexada
function previewImage(event, idx) {
  const file = event.target.files[0];
  const previewDiv = document.getElementById(`preview_${idx}`);

  if (state[idx] && state[idx].length >= 10) {
    alert('Limite de 10 fotos atingido para esta seção!');
    return; // Não permite adicionar mais de 10 fotos
  }

  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const img = document.createElement("img");
      img.src = e.target.result;
      img.className = 'preview-image'; // Class para controlar o tamanho das imagens
      const removeButton = document.createElement("button");
      removeButton.textContent = "❌ Excluir";
      removeButton.onclick = () => removeImage(idx, img);

      previewDiv.appendChild(img);
      previewDiv.appendChild(removeButton);

      if (!state[idx]) {
        state[idx] = [];
      }
      state[idx].push(file);
      updateCounter(idx);
    };
    reader.readAsDataURL(file);
  }
}

// Função para excluir a foto
function removeImage(idx, imgElement) {
  const imgIndex = Array.from(imgElement.parentNode.children).indexOf(imgElement);
  state[idx].splice(imgIndex, 1); // Remove a foto do estado
  imgElement.parentNode.removeChild(imgElement); // Remove a imagem da visualização
  imgElement.parentNode.removeChild(imgElement.nextSibling); // Remove o botão de exclusão
  updateCounter(idx); // Atualiza o contador de fotos
}

// Função para atualizar o contador de fotos
function updateCounter(idx) {
  const counter = document.getElementById(`counter_${idx}`);
  counter.innerText = `Fotos: ${state[idx] ? state[idx].length : 0} / 10`;
}

// Função de login do admin
function loginAdmin() {
  const password = prompt("Digite a senha de administrador:");

  if (password === adminPassword) {
    document.getElementById("adminPanel").style.display = "block";
    document.getElementById("adminButton").style.display = "none";  // Esconde o botão de login
  } else {
    alert("Senha incorreta!");
  }
}

// Função para salvar as seções e legendas editadas
function saveSections() {
  const newSections = document.getElementById("sectionsText").value.split("\n");
  sections = newSections.length > 0 ? newSections : sections;
  localStorage.setItem("sections", JSON.stringify(sections));  // Salva as seções no localStorage
  renderSections();
  alert("Seções salvas!");
}

// Carregar seções salvas (caso existam)
if (localStorage.getItem("sections")) {
  sections = JSON.parse(localStorage.getItem("sections"));
}

renderSections();  // Renderiza as seções inicialmente

// Função para enviar o formulário com fotos e legendas
document.getElementById("uploadForm").onsubmit = async (e) => {
  e.preventDefault();
  const siteId = document.getElementById("siteId").value;
  const status = document.getElementById("status");

  if (!siteId) {
    alert("O ID do site é obrigatório!");
    return;
  }

  status.innerText = "Enviando fotos...";

  const formData = new FormData();
  formData.append("siteId", siteId);

  for (let i = 0; i < sections.length; i++) {
    if (state[i]) {
      formData.append("photos", state[i]);
      formData.append(`section_${i}`, sections[i]);
    }
  }

  try {
    const res = await fetch('https://meu-backend.vercel.app/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();

    if (data.success) {
      status.innerText = "Relatório enviado com sucesso!";
    } else {
      status.innerText = "Erro no envio!";
    }
  } catch (error) {
    console.error(error);
    status.innerText = "Erro ao enviar o relatório.";
  }
};
