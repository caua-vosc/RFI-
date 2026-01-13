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

  // Aqui você adiciona o código para capturar as fotos e enviá-las ao backend

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
