const btnComprar = document.querySelector(".btn-comprar");

btnComprar.addEventListener("click", () => {
  const produto = {
    id: "tenis-black-runner",
    nome: "Tênis Black Runner",
    preco: 499.90,
    imagem: "../img/tenisblack1.webp",
    quantidade: 1
  };

  let carrinho = JSON.parse(localStorage.getItem("blackstyle_carrinho")) || [];

  const existente = carrinho.find(p => p.id === produto.id);
  if (existente) {
    existente.quantidade++;
  } else {
    carrinho.push(produto);
  }

  localStorage.setItem("blackstyle_carrinho", JSON.stringify(carrinho));
  alert("Produto adicionado ao carrinho 🖤");
});

