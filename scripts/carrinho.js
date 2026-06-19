class CarrinhoManager {
  constructor() {
    this.carrinho = this.carregarDoLocalStorage() || [];
    this.currentStep = 0;
    this.dadosEntrega = {};
    this.dadosPagamento = {};
    this.init();
  }

  init() {
    this.renderCarrinho();
    this.setupEventListeners();
    this.renderSteps();
  }

  carregarDoLocalStorage() {
    try {
      const dados = localStorage.getItem("carrinhoBlackStyle");
      return dados ? JSON.parse(dados) : [];
    } catch (e) {
      console.error("Erro ao carregar carrinho:", e);
      return [];
    }
  }

  salvarNoLocalStorage() {
    try {
      localStorage.setItem("carrinhoBlackStyle", JSON.stringify(this.carrinho));
    } catch (e) {
      console.error("Erro ao salvar carrinho:", e);
    }
  }

  adicionarProduto(produto) {
    const produtoExistente = this.carrinho.find((p) => p.id === produto.id);
    if (produtoExistente) {
      produtoExistente.quantidade = (produtoExistente.quantidade || 1) + 1;
    } else {
      this.carrinho.push({ ...produto, quantidade: 1 });
    }
    this.salvarNoLocalStorage();
    this.renderCarrinho();
  }

  removerProduto(produtoId) {
    this.carrinho = this.carrinho.filter((p) => p.id !== produtoId);
    this.salvarNoLocalStorage();
    this.renderCarrinho();
  }

  atualizarQuantidade(produtoId, quantidade) {
    const produto = this.carrinho.find((p) => p.id === produtoId);
    if (produto) {
      if (quantidade > 0) {
        produto.quantidade = quantidade;
      } else {
        this.removerProduto(produtoId);
      }
      this.salvarNoLocalStorage();
      this.renderCarrinho();
    }
  }

  calcularTotal() {
    return this.carrinho.reduce((total, p) => {
      const preco = parseFloat(String(p.preco).replace("R$", "").replace(",", "."));
      return total + preco * (p.quantidade || 1);
    }, 0);
  }

  renderCarrinho() {
    const carrinhoSection = document.getElementById("carrinho");
    if (!carrinhoSection) return;

    if (this.carrinho.length === 0) {
      carrinhoSection.innerHTML =
        '<h2>Carrinho</h2><p style="color: var(--muted); text-align: center; padding: 2rem;">Seu carrinho está vazio</p>';
      return;
    }

    let html = "<h2>Carrinho</h2>";
    html += '<div style="margin-bottom: 2rem;">';

    this.carrinho.forEach((produto) => {
      const preco = parseFloat(String(produto.preco).replace("R$", "").replace(",", "."));
      const subtotal = preco * (produto.quantidade || 1);
      html += `
        <div class="item">
          <img src="${produto.imagem}" alt="${produto.nome}" />
          <div class="item-info">
            <h4>${produto.nome}</h4>
            <p>R$ ${preco.toFixed(2).replace(".", ",")}</p>
            <div style="margin-top: 0.5rem;">
              <label style="color: var(--muted); font-size: 0.9rem;">Quantidade:</label>
              <div style="display: flex; gap: 0.5rem; align-items: center; margin-top: 0.3rem;">
                <button onclick="carrinho.atualizarQuantidade('${produto.id}', ${(produto.quantidade || 1) - 1})" 
                  style="background: rgba(212, 175, 55, 0.2); color: var(--gold); border: none; padding: 0.3rem 0.6rem; border-radius: 4px; cursor: pointer;">-</button>
                <input type="number" value="${produto.quantidade || 1}" min="1" 
                  onchange="carrinho.atualizarQuantidade('${produto.id}', parseInt(this.value))"
                  style="width: 50px; padding: 0.3rem; background: rgba(17, 17, 17, 0.8); border: 1px solid rgba(212, 175, 55, 0.2); border-radius: 4px; color: var(--white); text-align: center;" />
                <button onclick="carrinho.atualizarQuantidade('${produto.id}', ${(produto.quantidade || 1) + 1})" 
                  style="background: rgba(212, 175, 55, 0.2); color: var(--gold); border: none; padding: 0.3rem 0.6rem; border-radius: 4px; cursor: pointer;">+</button>
              </div>
            </div>
          </div>
          <div style="text-align: right;">
            <p style="color: var(--gold); font-size: 1.1rem; margin-bottom: 0.5rem;">Subtotal: R$ ${subtotal.toFixed(2).replace(".", ",")}</p>
            <button class="btn-remove" onclick="carrinho.removerProduto('${produto.id}')">
              <i class="fa-solid fa-trash"></i> Remover
            </button>
          </div>
        </div>
      `;
    });

    html += "</div>";

    // Resumo
    const total = this.calcularTotal();
    html += `
      <div class="checkout-summary">
        <p><strong>Subtotal:</strong> <span>R$ ${total.toFixed(2).replace(".", ",")}</span></p>
        <p><strong>Frete:</strong> <span>R$ 0,00</span></p>
        <p><strong>Total:</strong> <span>R$ ${total.toFixed(2).replace(".", ",")}</span></p>
      </div>
    `;

    html +=
      '<button class="btn" onclick="carrinho.proximoStep()">Continuar com Entrega</button>';

    carrinhoSection.innerHTML = html;
  }

  setupEventListeners() {
    // Entrega
    const entregaForm = document.getElementById("entrega");
    if (entregaForm) {
      const inputs = entregaForm.querySelectorAll("input");
      inputs.forEach((input) => {
        input.addEventListener("change", (e) => {
          this.dadosEntrega[e.target.name] = e.target.value;
        });
      });
    }

    // Pagamento
    const pagamentoForm = document.getElementById("pagamento");
    if (pagamentoForm) {
      const inputs = pagamentoForm.querySelectorAll("input");
      inputs.forEach((input) => {
        input.addEventListener("change", (e) => {
          this.dadosPagamento[e.target.name] = e.target.value;
        });
      });
    }
  }

  renderSteps() {
    const entregaSection = document.getElementById("entrega");
    if (!entregaSection) return;

    entregaSection.innerHTML = `
      <h2>Endereço de Entrega</h2>
      <input type="text" name="endereco" placeholder="Endereço completo" required />
      <input type="text" name="cidade" placeholder="Cidade" required />
      <input type="text" name="cep" placeholder="CEP" required />
      <input type="text" name="numero" placeholder="Número" required />
      <input type="text" name="complemento" placeholder="Complemento (opcional)" />
      <div style="margin-top: 1.5rem; display: flex; gap: 1rem;">
        <button class="btn-secondary" onclick="carrinho.passoAnterior()">Voltar</button>
        <button class="btn" onclick="carrinho.validarEntrega()">Continuar com Pagamento</button>
      </div>
    `;

    const pagamentoSection = document.getElementById("pagamento");
    if (pagamentoSection) {
      pagamentoSection.innerHTML = `
        <h2>Dados de Pagamento</h2>
        <input type="text" name="cartao" placeholder="Número do Cartão" maxlength="19" required />
        <input type="text" name="titular" placeholder="Nome no Cartão" required />
        <div style="display: flex; gap: 1rem;">
          <input type="text" name="validade" placeholder="MM/AA" maxlength="5" style="flex: 0.5;" required />
          <input type="text" name="cvv" placeholder="CVV" maxlength="4" style="flex: 0.5;" required />
        </div>
        <div style="margin-top: 1.5rem; display: flex; gap: 1rem;">
          <button class="btn-secondary" onclick="carrinho.passoAnterior()">Voltar</button>
          <button class="btn" onclick="carrinho.finalizarCompra()">Finalizar Compra</button>
        </div>
      `;
    }

    // Confirmação
  }

  renderConfirmacao() {
    const confirmacaoSection = document.getElementById("confirmacao");
    if (!confirmacaoSection) return;

    const total = this.calcularTotal();
    let produtosHtml = "";
    this.carrinho.forEach((p) => {
      const preco = parseFloat(String(p.preco).replace("R$", "").replace(",", "."));
      const subtotal = preco * (p.quantidade || 1);
      produtosHtml += `
        <div style="padding: 0.8rem 0; border-bottom: 1px solid rgba(212, 175, 55, 0.1); display: flex; justify-content: space-between;">
          <span>${p.nome} (x${p.quantidade || 1})</span>
          <span style="color: var(--gold);">R$ ${subtotal.toFixed(2).replace(".", ",")}</span>
        </div>
      `;
    });

    //exibição dados entrega e pagamento
    const enderecoCompleto = `${this.dadosEntrega.endereco || "Não informado"}${this.dadosEntrega.numero ? ", Nº " + this.dadosEntrega.numero : ""}${this.dadosEntrega.complemento ? " - " + this.dadosEntrega.complemento : ""}`;
    const cidade = this.dadosEntrega.cidade || "Não informado";
    const cep = this.dadosEntrega.cep || "Não informado";

    const cartaoRaw = String(this.dadosPagamento.cartao || "");
    const cartaoMascarado = cartaoRaw.length >= 4 ? `**** **** **** ${cartaoRaw.slice(-4)}` : (this.dadosPagamento.cartao ? this.dadosPagamento.cartao : "Não informado");
    const titular = this.dadosPagamento.titular || "Não informado";
    const validade = this.dadosPagamento.validade || "Não informado";

    confirmacaoSection.innerHTML = `
      <h2>Resumo da Compra</h2>
      <div class="checkout-summary">
        <h3 style="color: var(--gold); margin-bottom: 1rem;">Produtos</h3>
        ${produtosHtml}
        <div style="padding: 1rem 0; margin-top: 1rem; border-top: 2px solid rgba(212, 175, 55, 0.2); display: flex; justify-content: space-between; font-size: 1.2rem; color: var(--gold);">
          <strong>Total:</strong>
          <strong>R$ ${total.toFixed(2).replace(".", ",")}</strong>
        </div>
      </div>
      <div class="checkout-summary">
        <h3 style="color: var(--gold); margin-bottom: 1rem;">Entrega</h3>
        <p><strong>Endereço:</strong> ${enderecoCompleto}</p>
        <p><strong>Cidade:</strong> ${cidade}</p>
        <p><strong>CEP:</strong> ${cep}</p>
      </div>
      <div class="checkout-summary">
        <h3 style="color: var(--gold); margin-bottom: 1rem;">Pagamento</h3>
        <p><strong>Cartão:</strong> ${cartaoMascarado}</p>
        <p><strong>Titular:</strong> ${titular}</p>
        <p><strong>Validade:</strong> ${validade}</p>
      </div>
      <div class="success">
        <i class="fa-solid fa-circle-check" style="color: var(--gold); font-size: 3rem; margin-bottom: 1rem; display: block;"></i>
        <strong style="font-size: 1.5rem;">Compra Realizada com Sucesso!</strong>
        <p style="margin-top: 1rem; color: var(--muted);">Você receberá um email com os detalhes da sua compra.</p>
        <a href="produtos.html" class="btn" style="margin-top: 1rem; text-decoration: none;">Continuar Comprando</a>
      </div>
    `;
  }

  validarEntrega() {
    const inputs = document.querySelectorAll("#entrega input[required]");
    let valido = true;
    inputs.forEach((input) => {
      if (!input.value.trim()) {
        input.style.borderColor = "#ff6b6b";
        valido = false;
      } else {
        input.style.borderColor = "rgba(212, 175, 55, 0.2)";
        this.dadosEntrega[input.name] = input.value;
      }
    });

    if (valido) {
      this.proximoStep();
    }
  }

  validarPagamento() {
    const inputs = document.querySelectorAll("#pagamento input[required]");
    let valido = true;
    inputs.forEach((input) => {
      if (!input.value.trim()) {
        input.style.borderColor = "#ff6b6b";
        valido = false;
      } else {
        input.style.borderColor = "rgba(212, 175, 55, 0.2)";
        this.dadosPagamento[input.name] = input.value;
      }
    });

    return valido;
  }

  // steps

  proximoStep() {
    const sections = document.querySelectorAll(".section");
    const steps = document.querySelectorAll(".step");

    if (this.currentStep < sections.length - 1) {
      sections[this.currentStep].classList.remove("active");
      steps[this.currentStep].classList.remove("active");
      this.currentStep++;
      sections[this.currentStep].classList.add("active");
      steps[this.currentStep].classList.add("active");
      if (this.currentStep === 3) {
        this.renderConfirmacao();
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  passoAnterior() {
    const sections = document.querySelectorAll(".section");
    const steps = document.querySelectorAll(".step");

    if (this.currentStep > 0) {
      sections[this.currentStep].classList.remove("active");
      steps[this.currentStep].classList.remove("active");
      this.currentStep--;
      sections[this.currentStep].classList.add("active");
      steps[this.currentStep].classList.add("active");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  finalizarCompra() {
    if (this.validarPagamento()) {
      this.proximoStep();
      this.carrinho = [];
      this.salvarNoLocalStorage();
    }
  }
}

// Instanciar o gerenciador
const carrinho = new CarrinhoManager();
