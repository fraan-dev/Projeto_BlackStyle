// Função global para adicionar produtos ao carrinho
window.adicionarAoCarrinho = function (produto) {
  // Garantir que o produto tem os campos necessários
  const produtoFormatado = {
    id: produto.id || `produto-${Date.now()}`,
    nome: produto.nome,
    preco: typeof produto.preco === 'string' ? produto.preco : `R$ ${produto.preco}`,
    imagem: produto.imagem,
    quantidade: produto.quantidade || 1
  };

  // Carregar carrinho existente
  let carrinho = JSON.parse(localStorage.getItem("carrinhoBlackStyle")) || [];

  // Verificar se produto já existe
  const existente = carrinho.find(p => p.id === produtoFormatado.id);
  if (existente) {
    existente.quantidade++;
  } else {
    carrinho.push(produtoFormatado);
  }

  // Salvar no localStorage
  localStorage.setItem("carrinhoBlackStyle", JSON.stringify(carrinho));
  alert(`${produtoFormatado.nome} adicionado ao carrinho! 🛒`);
};
