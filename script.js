const sectionsDiv = document.getElementById("sections");
let state = {};
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
]; // As 20 seções que o usuário verá

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
    `;

    sectionsDiv.appendChild(div);
  });
}

// Função para exibir a foto que foi tirada ou anexada
function previewImage(event, idx) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const img = document.createElement("img");
      img.src = e.target.result;
      document.getElementById(`preview_${idx}`).innerHTML = "";
      document.getElementById(`preview_${idx}`).appendChild(img);
      state[idx] = file;
    };
    reader.readAsDataURL(file);
  }
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
