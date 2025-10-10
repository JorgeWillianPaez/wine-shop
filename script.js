// Estado Global da Aplicação
let produtos = [];
let carrinho = [];
let produtoEditando = null;

// Produtos de exemplo para inicialização
const produtosIniciais = [
  {
    id: 1,
    nome: "Cabernet Sauvignon Reserva",
    preco: 89.9,
    tipo: "tinto",
    pais: "Brasil",
    regiao: "Serra Gaúcha",
    ano: 2020,
    graduacao: 13.5,
    volume: 750,
    descricao:
      "Vinho tinto encorpado com notas de frutas vermelhas e especiarias.",
    imagem:
      "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=600&fit=crop&auto=format",
  },
  {
    id: 2,
    nome: "Chardonnay Premium",
    preco: 75.5,
    tipo: "branco",
    pais: "Chile",
    regiao: "Vale Central",
    ano: 2021,
    graduacao: 12.5,
    volume: 750,
    descricao:
      "Vinho branco elegante com aromas cítricos e toques de carvalho.",
    imagem:
      "https://images.unsplash.com/photo-1474722883778-792e7990302f?w=400&h=600&fit=crop&auto=format",
  },
  {
    id: 3,
    nome: "Malbec Argentino",
    preco: 95.0,
    tipo: "tinto",
    pais: "Argentina",
    regiao: "Mendoza",
    ano: 2019,
    graduacao: 14.0,
    volume: 750,
    descricao: "Vinho tinto intenso com sabores de ameixa e chocolate.",
    imagem:
      "https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=400&h=600&fit=crop&auto=format",
  },
  {
    id: 5,
    nome: "Rosé Provençal",
    preco: 82.0,
    tipo: "rosé",
    pais: "França",
    regiao: "Provence",
    ano: 2022,
    graduacao: 12.0,
    volume: 750,
    descricao: "Rosé seco e refrescante com notas de frutas vermelhas.",
    imagem:
      "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&h=600&fit=crop&auto=format",
  },
  {
    id: 7,
    nome: "Sauvignon Blanc",
    preco: 68.0,
    tipo: "branco",
    pais: "Nova Zelândia",
    regiao: "Marlborough",
    ano: 2023,
    graduacao: 12.5,
    volume: 750,
    descricao: "Branco fresco e mineral com notas herbáceas e cítricas.",
    imagem:
      "https://images.unsplash.com/photo-1571613316887-6f8d5cbf7ef7?w=400&h=600&fit=crop&auto=format",
  },
];

// Inicialização
document.addEventListener("DOMContentLoaded", function () {
  inicializarApp();
});

function inicializarApp() {
  carregarDados();
  configurarEventListeners();

  // Inicializar página específica
  const currentPage = window.location.pathname.split("/").pop();
  switch (currentPage) {
    case "index.html":
    case "":
      inicializarHome();
      break;
    case "carrinho.html":
      inicializarCarrinho();
      break;
    case "admin.html":
      inicializarAdmin();
      break;
  }

  atualizarContadorCarrinho();
}

function carregarDados() {
  // Forçar atualização dos produtos com imagens (versão 2.2)
  const versaoAtual = "2.2";
  const versaoSalva = localStorage.getItem("wineshop_versao");

  if (versaoSalva !== versaoAtual) {
    // Atualizar produtos com as novas imagens
    produtos = produtosIniciais;
    localStorage.setItem("wineshop_versao", versaoAtual);
    salvarProdutos();
  } else {
    // Carregar produtos do localStorage
    const produtosSalvos = localStorage.getItem("wineshop_produtos");
    if (produtosSalvos) {
      produtos = JSON.parse(produtosSalvos);
    } else {
      produtos = produtosIniciais;
      salvarProdutos();
    }
  }

  // Carregar carrinho do localStorage
  const carrinhoSalvo = localStorage.getItem("wineshop_carrinho");
  if (carrinhoSalvo) {
    carrinho = JSON.parse(carrinhoSalvo);
  }
}

function salvarProdutos() {
  localStorage.setItem("wineshop_produtos", JSON.stringify(produtos));
}

function salvarCarrinho() {
  localStorage.setItem("wineshop_carrinho", JSON.stringify(carrinho));
  atualizarContadorCarrinho();
}

function configurarEventListeners() {
  // Event listeners globais

  // Fechar modais
  document.addEventListener("click", function (e) {
    if (
      e.target.classList.contains("modal") ||
      e.target.classList.contains("close")
    ) {
      fecharModal();
    }
  });

  // Filtros de produtos (apenas na home)
  const filterBtns = document.querySelectorAll(".filter-btn");
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      filterBtns.forEach((b) => b.classList.remove("active"));
      this.classList.add("active");
      const filtro = this.dataset.filter;
      filtrarProdutos(filtro);
    });
  });
}

// FUNÇÕES DA HOME
function inicializarHome() {
  carregarProdutos();
}

function carregarProdutos() {
  const grid = document.getElementById("produtos-grid");
  if (!grid) return;

  grid.innerHTML = "";

  produtos.forEach((produto) => {
    const produtoCard = criarCardProduto(produto);
    grid.appendChild(produtoCard);
  });
}

function criarCardProduto(produto) {
  const card = document.createElement("div");
  card.className = "produto-card";
  card.dataset.tipo = produto.tipo;

  const imagemHtml = produto.imagem
    ? `<img src="${produto.imagem}" alt="${produto.nome}" onerror="this.parentElement.classList.add('no-image'); this.style.display='none';">`
    : '<i class="fas fa-wine-bottle"></i>';

  card.innerHTML = `
        <div class="produto-image ${!produto.imagem ? "no-image" : ""}">
            ${imagemHtml}
        </div>
        <div class="produto-info">
            <h3>${produto.nome}</h3>
            <div class="produto-meta">
                <span class="produto-tipo">${produto.tipo}</span>
                <span>${produto.pais} - ${produto.ano}</span>
            </div>
            <div class="produto-preco">R$ ${produto.preco
              .toFixed(2)
              .replace(".", ",")}</div>
            <button class="btn-add-cart" onclick="adicionarAoCarrinho(${
              produto.id
            })">
                <i class="fas fa-cart-plus"></i>
                Adicionar ao Carrinho
            </button>
        </div>
    `;

  // Adicionar click para abrir modal
  card.addEventListener("click", function (e) {
    if (!e.target.closest(".btn-add-cart")) {
      abrirModalProduto(produto);
    }
  });

  return card;
}

function filtrarProdutos(tipo) {
  const cards = document.querySelectorAll(".produto-card");
  cards.forEach((card) => {
    if (tipo === "todos" || card.dataset.tipo === tipo) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}

function abrirModalProduto(produto) {
  const modal = document.getElementById("produto-modal");
  const modalBody = document.getElementById("modal-body");

  const imagemHtml = produto.imagem
    ? `<img src="${produto.imagem}" alt="${produto.nome}" class="modal-produto-imagem">`
    : '<div class="modal-produto-imagem-placeholder"><i class="fas fa-wine-bottle"></i></div>';

  modalBody.innerHTML = `
        <div class="modal-produto-container">
            <div class="modal-produto-header">
                <div class="modal-produto-imagem-wrapper">
                    ${imagemHtml}
                </div>
                <div class="modal-produto-info">
                    <h2 class="modal-produto-titulo">${produto.nome}</h2>
                    <div class="modal-produto-detalhes">
                        <div class="detalhe-item">
                            <span class="detalhe-label">Tipo:</span>
                            <span class="detalhe-valor ${produto.tipo}">${
    produto.tipo
  }</span>
                        </div>
                        <div class="detalhe-item">
                            <span class="detalhe-label">País:</span>
                            <span class="detalhe-valor">${produto.pais}</span>
                        </div>
                        <div class="detalhe-item">
                            <span class="detalhe-label">Região:</span>
                            <span class="detalhe-valor">${produto.regiao}</span>
                        </div>
                        <div class="detalhe-item">
                            <span class="detalhe-label">Ano:</span>
                            <span class="detalhe-valor">${produto.ano}</span>
                        </div>
                        <div class="detalhe-item">
                            <span class="detalhe-label">Graduação:</span>
                            <span class="detalhe-valor">${
                              produto.graduacao
                            }%</span>
                        </div>
                        <div class="detalhe-item">
                            <span class="detalhe-label">Volume:</span>
                            <span class="detalhe-valor">${
                              produto.volume
                            }ml</span>
                        </div>
                    </div>
                    <div class="modal-produto-preco">
                        R$ ${produto.preco.toFixed(2).replace(".", ",")}
                    </div>
                    <button class="btn-primary modal-add-cart" onclick="adicionarAoCarrinho(${
                      produto.id
                    }); fecharModal();">
                        <i class="fas fa-cart-plus"></i>
                        Adicionar ao Carrinho
                    </button>
                </div>
            </div>
            <div class="modal-produto-descricao">
                <h3 class="descricao-titulo">Descrição</h3>
                <p class="descricao-texto">${produto.descricao}</p>
            </div>
        </div>
    `;

  modal.style.display = "block";
}

function adicionarAoCarrinho(produtoId) {
  const produto = produtos.find((p) => p.id === produtoId);
  if (!produto) return;

  const itemExistente = carrinho.find((item) => item.id === produtoId);

  if (itemExistente) {
    itemExistente.quantidade++;
  } else {
    carrinho.push({
      ...produto,
      quantidade: 1,
    });
  }

  salvarCarrinho();
  mostrarNotificacao(`${produto.nome} adicionado ao carrinho!`, "success");
}

// FUNÇÕES DO CARRINHO
function inicializarCarrinho() {
  renderizarCarrinho();
  configurarEventListenersCarrinho();
}

function configurarEventListenersCarrinho() {
  const btnFinalizar = document.getElementById("btn-finalizar");
  const btnAplicarCupom = document.getElementById("btn-aplicar-cupom");

  if (btnFinalizar) {
    btnFinalizar.addEventListener("click", finalizarCompra);
  }

  if (btnAplicarCupom) {
    btnAplicarCupom.addEventListener("click", aplicarCupom);
  }
}

function renderizarCarrinho() {
  const carrinhoVazio = document.getElementById("carrinho-vazio");
  const carrinhoLista = document.getElementById("carrinho-lista");

  if (carrinho.length === 0) {
    if (carrinhoVazio) carrinhoVazio.style.display = "block";
    if (carrinhoLista) carrinhoLista.style.display = "none";
    desabilitarFinalizacao();
    return;
  }

  if (carrinhoVazio) carrinhoVazio.style.display = "none";
  if (carrinhoLista) carrinhoLista.style.display = "block";

  carrinhoLista.innerHTML = "";

  carrinho.forEach((item) => {
    const itemElement = criarItemCarrinho(item);
    carrinhoLista.appendChild(itemElement);
  });

  atualizarResumoCarrinho();
  habilitarFinalizacao();
}

function criarItemCarrinho(item) {
  const itemDiv = document.createElement("div");
  itemDiv.className = "carrinho-item";

  const imagemHtml = item.imagem
    ? `<img src="${item.imagem}" alt="${item.nome}">`
    : '<i class="fas fa-wine-bottle"></i>';

  itemDiv.innerHTML = `
        <div class="item-image ${!item.imagem ? "no-image" : ""}">
            ${imagemHtml}
        </div>
        <div class="item-info">
            <h4>${item.nome}</h4>
            <div class="item-meta">${item.tipo} - ${item.pais} (${
    item.ano
  })</div>
        </div>
        <div class="item-quantidade">
            <button class="qty-btn" onclick="alterarQuantidade(${
              item.id
            }, -1)">-</button>
            <input type="number" class="qty-input" value="${
              item.quantidade
            }" min="1" 
                   onchange="alterarQuantidadeInput(${item.id}, this.value)">
            <button class="qty-btn" onclick="alterarQuantidade(${
              item.id
            }, 1)">+</button>
        </div>
        <div class="item-preco">R$ ${(item.preco * item.quantidade)
          .toFixed(2)
          .replace(".", ",")}</div>
        <button class="btn-remove" onclick="removerDoCarrinho(${item.id})">
            <i class="fas fa-trash"></i>
        </button>
    `;

  return itemDiv;
}

function alterarQuantidade(produtoId, delta) {
  const item = carrinho.find((item) => item.id === produtoId);
  if (item) {
    item.quantidade = Math.max(1, item.quantidade + delta);
    salvarCarrinho();
    renderizarCarrinho();
  }
}

function alterarQuantidadeInput(produtoId, novaQuantidade) {
  const quantidade = parseInt(novaQuantidade);
  if (quantidade > 0) {
    const item = carrinho.find((item) => item.id === produtoId);
    if (item) {
      item.quantidade = quantidade;
      salvarCarrinho();
      renderizarCarrinho();
    }
  }
}

function removerDoCarrinho(produtoId) {
  carrinho = carrinho.filter((item) => item.id !== produtoId);
  salvarCarrinho();
  renderizarCarrinho();

  const produto = produtos.find((p) => p.id === produtoId);
  if (produto) {
    mostrarNotificacao(`${produto.nome} removido do carrinho!`, "info");
  }
}

function atualizarResumoCarrinho() {
  const subtotal = carrinho.reduce(
    (total, item) => total + item.preco * item.quantidade,
    0
  );
  const frete = subtotal > 200 ? 0 : 15;
  const total = subtotal + frete;

  const elementSubtotal = document.getElementById("subtotal");
  const elementFrete = document.getElementById("frete");
  const elementTotal = document.getElementById("total");

  if (elementSubtotal)
    elementSubtotal.textContent = `R$ ${subtotal.toFixed(2).replace(".", ",")}`;
  if (elementFrete) {
    elementFrete.textContent =
      frete === 0 ? "GRÁTIS" : `R$ ${frete.toFixed(2).replace(".", ",")}`;
    elementFrete.style.color = frete === 0 ? "#28a745" : "#333";
  }
  if (elementTotal)
    elementTotal.textContent = `R$ ${total.toFixed(2).replace(".", ",")}`;
}

function aplicarCupom() {
  const cupomInput = document.getElementById("cupom-input");
  const cupomMessage = document.getElementById("cupom-message");
  const cupom = cupomInput.value.trim().toUpperCase();

  const cuponsValidos = {
    WELCOME10: { desconto: 0.1, descricao: "10% de desconto" },
    PRIMEIRA20: { desconto: 0.2, descricao: "20% de desconto" },
    FRETEGRATIS: { frete: 0, descricao: "Frete grátis" },
  };

  if (cuponsValidos[cupom]) {
    cupomMessage.textContent = `Cupom aplicado: ${cuponsValidos[cupom].descricao}`;
    cupomMessage.className = "cupom-message success";
    // Aplicar desconto (implementação simplificada)
    setTimeout(() => atualizarResumoCarrinho(), 100);
  } else {
    cupomMessage.textContent = "Cupom inválido!";
    cupomMessage.className = "cupom-message error";
  }
}

function habilitarFinalizacao() {
  const btnFinalizar = document.getElementById("btn-finalizar");
  if (btnFinalizar) {
    btnFinalizar.disabled = false;
  }
}

function desabilitarFinalizacao() {
  const btnFinalizar = document.getElementById("btn-finalizar");
  if (btnFinalizar) {
    btnFinalizar.disabled = true;
  }
}

function finalizarCompra() {
  if (carrinho.length === 0) return;

  // Gerar número do pedido
  const numeroPedido = "WS" + Date.now().toString().slice(-8);

  // Mostrar modal de confirmação
  const modal = document.getElementById("confirmacao-modal");
  const numeroPedidoElement = document.getElementById("numero-pedido");

  if (numeroPedidoElement) {
    numeroPedidoElement.textContent = numeroPedido;
  }

  if (modal) {
    modal.style.display = "block";
  }

  // Limpar carrinho
  carrinho = [];
  salvarCarrinho();

  // Fechar modal automaticamente após 5 segundos
  setTimeout(() => {
    fecharModal();
    window.location.href = "index.html";
  }, 5000);
}

// FUNÇÕES DO ADMIN
function inicializarAdmin() {
  carregarProdutosAdmin();
  configurarEventListenersAdmin();
  atualizarEstatisticas();
}

function configurarEventListenersAdmin() {
  const produtoForm = document.getElementById("produto-form");
  const searchInput = document.getElementById("search-produtos");
  const btnExport = document.getElementById("btn-export");
  const btnCancelar = document.getElementById("btn-cancelar");

  if (produtoForm) {
    produtoForm.addEventListener("submit", salvarProduto);
  }

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      filtrarProdutosAdmin(this.value);
    });
  }

  if (btnExport) {
    btnExport.addEventListener("click", exportarProdutos);
  }

  if (btnCancelar) {
    btnCancelar.addEventListener("click", cancelarEdicao);
  }
}

function salvarProduto(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const produto = {
    nome: formData.get("nome"),
    preco: parseFloat(formData.get("preco")),
    tipo: formData.get("tipo"),
    pais: formData.get("pais"),
    regiao: formData.get("regiao"),
    ano: parseInt(formData.get("ano")),
    graduacao: parseFloat(formData.get("graduacao")),
    volume: parseInt(formData.get("volume")),
    descricao: formData.get("descricao"),
    imagem: formData.get("imagem"),
  };

  if (produtoEditando) {
    // Editando produto existente
    const index = produtos.findIndex((p) => p.id === produtoEditando.id);
    produtos[index] = { ...produto, id: produtoEditando.id };
    mostrarNotificacao("Produto atualizado com sucesso!", "success");
    cancelarEdicao();
  } else {
    // Criando novo produto
    produto.id = Date.now();
    produtos.push(produto);
    mostrarNotificacao("Produto adicionado com sucesso!", "success");
  }

  salvarProdutos();
  carregarProdutosAdmin();
  atualizarEstatisticas();
  e.target.reset();
}

function carregarProdutosAdmin() {
  const lista = document.getElementById("produtos-lista");
  if (!lista) return;

  lista.innerHTML = "";

  produtos.forEach((produto) => {
    const item = criarItemProdutoAdmin(produto);
    lista.appendChild(item);
  });
}

function criarItemProdutoAdmin(produto) {
  const item = document.createElement("div");
  item.className = "produto-admin-item";
  item.dataset.nome = produto.nome.toLowerCase();
  item.dataset.tipo = produto.tipo.toLowerCase();

  item.innerHTML = `
        <div class="produto-admin-info">
            <div>
                <strong>${produto.nome}</strong><br>
                <small>${produto.tipo} - ${produto.pais}</small>
            </div>
            <div>R$ ${produto.preco.toFixed(2).replace(".", ",")}</div>
            <div>${produto.ano}</div>
            <div>${produto.graduacao}%</div>
        </div>
        <div class="produto-admin-actions">
            <button class="btn-edit" onclick="editarProduto(${
              produto.id
            })" title="Editar">
                <i class="fas fa-edit"></i>
            </button>
            <button class="btn-delete" onclick="confirmarExclusao(${
              produto.id
            })" title="Excluir">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;

  return item;
}

function editarProduto(produtoId) {
  const produto = produtos.find((p) => p.id === produtoId);
  if (!produto) return;

  produtoEditando = produto;

  // Preencher formulário
  document.getElementById("nome").value = produto.nome;
  document.getElementById("preco").value = produto.preco;
  document.getElementById("tipo").value = produto.tipo;
  document.getElementById("pais").value = produto.pais;
  document.getElementById("regiao").value = produto.regiao;
  document.getElementById("ano").value = produto.ano;
  document.getElementById("graduacao").value = produto.graduacao;
  document.getElementById("volume").value = produto.volume;
  document.getElementById("descricao").value = produto.descricao;
  document.getElementById("imagem").value = produto.imagem || "";

  // Alterar texto do botão
  const btnText = document.getElementById("btn-text");
  const btnCancelar = document.getElementById("btn-cancelar");

  if (btnText) btnText.textContent = "Atualizar Produto";
  if (btnCancelar) btnCancelar.style.display = "inline-flex";

  // Scroll para o formulário
  document
    .querySelector(".produto-form")
    .scrollIntoView({ behavior: "smooth" });
}

function cancelarEdicao() {
  produtoEditando = null;

  const btnText = document.getElementById("btn-text");
  const btnCancelar = document.getElementById("btn-cancelar");
  const form = document.getElementById("produto-form");

  if (btnText) btnText.textContent = "Adicionar Produto";
  if (btnCancelar) btnCancelar.style.display = "none";
  if (form) form.reset();
}

function confirmarExclusao(produtoId) {
  const produto = produtos.find((p) => p.id === produtoId);
  if (!produto) return;

  const modal = document.getElementById("delete-modal");
  const produtoNome = document.getElementById("produto-nome-delete");
  const btnConfirmar = document.getElementById("confirmar-delete");

  if (produtoNome) produtoNome.textContent = produto.nome;
  if (modal) modal.style.display = "block";

  // Remover listeners antigos e adicionar novo
  if (btnConfirmar) {
    const novoBtn = btnConfirmar.cloneNode(true);
    btnConfirmar.parentNode.replaceChild(novoBtn, btnConfirmar);
    novoBtn.addEventListener("click", () => excluirProduto(produtoId));
  }
}

function excluirProduto(produtoId) {
  const produto = produtos.find((p) => p.id === produtoId);
  produtos = produtos.filter((p) => p.id !== produtoId);

  // Remover do carrinho também
  carrinho = carrinho.filter((item) => item.id !== produtoId);

  salvarProdutos();
  salvarCarrinho();
  carregarProdutosAdmin();
  atualizarEstatisticas();
  fecharModal();

  if (produto) {
    mostrarNotificacao(`${produto.nome} excluído com sucesso!`, "success");
  }
}

function filtrarProdutosAdmin(termo) {
  const items = document.querySelectorAll(".produto-admin-item");
  const termoBusca = termo.toLowerCase();

  items.forEach((item) => {
    const nome = item.dataset.nome;
    const tipo = item.dataset.tipo;

    if (nome.includes(termoBusca) || tipo.includes(termoBusca)) {
      item.style.display = "flex";
    } else {
      item.style.display = "none";
    }
  });
}

function exportarProdutos() {
  const dataStr = JSON.stringify(produtos, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(dataBlob);
  link.download = "produtos_wineshop.json";
  link.click();

  mostrarNotificacao("Produtos exportados com sucesso!", "success");
}

function atualizarEstatisticas() {
  const totalProdutos = document.getElementById("total-produtos");
  const valorMedio = document.getElementById("valor-medio");
  const tipoPopular = document.getElementById("tipo-popular");
  const paisPopular = document.getElementById("pais-popular");

  if (produtos.length === 0) {
    if (totalProdutos) totalProdutos.textContent = "0";
    if (valorMedio) valorMedio.textContent = "R$ 0,00";
    if (tipoPopular) tipoPopular.textContent = "-";
    if (paisPopular) paisPopular.textContent = "-";
    return;
  }

  // Total de produtos
  if (totalProdutos) totalProdutos.textContent = produtos.length;

  // Valor médio
  const precoMedio =
    produtos.reduce((sum, p) => sum + p.preco, 0) / produtos.length;
  if (valorMedio)
    valorMedio.textContent = `R$ ${precoMedio.toFixed(2).replace(".", ",")}`;

  // Tipo mais popular
  const tipos = {};
  produtos.forEach((p) => {
    tipos[p.tipo] = (tipos[p.tipo] || 0) + 1;
  });
  const tipoMaisPopular = Object.keys(tipos).reduce((a, b) =>
    tipos[a] > tipos[b] ? a : b
  );
  if (tipoPopular) tipoPopular.textContent = tipoMaisPopular;

  // País mais popular
  const paises = {};
  produtos.forEach((p) => {
    paises[p.pais] = (paises[p.pais] || 0) + 1;
  });
  const paisMaisPopular = Object.keys(paises).reduce((a, b) =>
    paises[a] > paises[b] ? a : b
  );
  if (paisPopular) paisPopular.textContent = paisMaisPopular;
}

// FUNÇÕES UTILITÁRIAS
function atualizarContadorCarrinho() {
  const contador = document.getElementById("cart-count");
  if (contador) {
    const totalItens = carrinho.reduce(
      (total, item) => total + item.quantidade,
      0
    );
    contador.textContent = totalItens;
  }
}

function fecharModal() {
  const modals = document.querySelectorAll(".modal");
  modals.forEach((modal) => {
    modal.style.display = "none";
  });
}

function mostrarNotificacao(mensagem, tipo = "info") {
  // Criar elemento de notificação
  const notificacao = document.createElement("div");
  notificacao.className = `notificacao notificacao-${tipo}`;
  notificacao.innerHTML = `
        <div class="notificacao-content">
            <i class="fas ${getIconeNotificacao(tipo)}"></i>
            <span>${mensagem}</span>
        </div>
    `;

  // Adicionar estilos inline
  Object.assign(notificacao.style, {
    position: "fixed",
    top: "100px",
    right: "20px",
    padding: "1rem 1.5rem",
    borderRadius: "8px",
    color: "white",
    zIndex: "2001",
    opacity: "0",
    transform: "translateX(100%)",
    transition: "all 0.3s ease",
    maxWidth: "400px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
  });

  // Definir cor de fundo baseada no tipo
  const cores = {
    success: "#28a745",
    error: "#dc3545",
    info: "#17a2b8",
    warning: "#ffc107",
  };
  notificacao.style.background = cores[tipo] || cores.info;

  document.body.appendChild(notificacao);

  // Animar entrada
  setTimeout(() => {
    notificacao.style.opacity = "1";
    notificacao.style.transform = "translateX(0)";
  }, 100);

  // Remover após 3 segundos
  setTimeout(() => {
    notificacao.style.opacity = "0";
    notificacao.style.transform = "translateX(100%)";
    setTimeout(() => {
      if (notificacao.parentNode) {
        notificacao.parentNode.removeChild(notificacao);
      }
    }, 300);
  }, 3000);
}

function getIconeNotificacao(tipo) {
  const icones = {
    success: "fa-check-circle",
    error: "fa-times-circle",
    info: "fa-info-circle",
    warning: "fa-exclamation-triangle",
  };
  return icones[tipo] || icones.info;
}

// Função para formatar moeda
function formatarMoeda(valor) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
}

// Função para gerar ID único
function gerarId() {
  return Date.now() + Math.random().toString(36).substr(2, 9);
}
