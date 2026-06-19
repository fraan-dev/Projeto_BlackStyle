// parte do loguin e cadastro
let loginForm = document.getElementById("loginForm");
let registerForm = document.getElementById("registerForm");

function showRegister() {
  loginForm.classList.remove("active");
  registerForm.classList.add("active");
}

function showLogin() {
  registerForm.classList.remove("active");
  loginForm.classList.add("active");
}

// Validação de email
function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Validação de senha
function validarSenha(senha) {
  return senha.length >= 6;
}

// Formulário de Login
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  
  const email = document.getElementById("loginEmail").value.trim();
  const senha = document.getElementById("loginSenha").value;

  if (!email) {
    alert("⚠️ Por favor, preencha o email");
    return;
  }

  if (!validarEmail(email)) {
    alert("⚠️ Email inválido");
    return;
  }

  if (!senha) {
    alert("⚠️ Por favor, preencha a senha");
    return;
  }

  alert("✅ Login realizado com sucesso!");
  loginForm.reset();
});

// Formulário de Cadastro
registerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  
  const nome = document.getElementById("regNome").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  const senha = document.getElementById("regSenha").value;

  if (!nome || nome.length < 3) {
    alert("⚠️ Nome deve ter pelo menos 3 caracteres");
    return;
  }

  if (!email) {
    alert("⚠️ Por favor, preencha o email");
    return;
  }

  if (!validarEmail(email)) {
    alert("⚠️ Email inválido");
    return;
  }

  if (!validarSenha(senha)) {
    alert("⚠️ Senha deve ter pelo menos 6 caracteres");
    return;
  }

  alert("✅ Cadastro concluído com sucesso!");
  registerForm.reset();
});
