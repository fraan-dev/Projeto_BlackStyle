// Validação do formulário de contato
let form = document.querySelector("#formContato");

// Validação de email
function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  let nome = form.nome.value.trim();
  let email = form.email.value.trim();
  let assunto = form.assunto.value.trim();
  let mensagem = form.mensagem.value.trim();

  // Validação do nome
  if (!nome) {
    alert("⚠️ Por favor, preencha o campo Nome");
    return;
  }

  if (nome.length < 3) {
    alert("⚠️ Nome deve ter pelo menos 3 caracteres");
    return;
  }

  // Validação do email
  if (!email) {
    alert("⚠️ Por favor, preencha o campo Email");
    return;
  }

  if (!validarEmail(email)) {
    alert("⚠️ Email inválido. Verifique o formato");
    return;
  }

  // Validação da mensagem
  if (!mensagem) {
    alert("⚠️ Por favor, escreva uma mensagem");
    return;
  }

  if (mensagem.length < 10) {
    alert("⚠️ Mensagem deve ter pelo menos 10 caracteres");
    return;
  }

  // Simulação de envio
  alert(`✅ Obrigado, ${nome}! Sua mensagem foi recebida com sucesso. Entraremos em contato em breve. 🖤`);
  form.reset();
});
