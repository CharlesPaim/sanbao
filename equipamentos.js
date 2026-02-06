async function loadEquipamentos() {
    const container = document.getElementById('equipamentos-app');

    try {
        const response = await fetch('equipamentos.json');
        const data = await response.json();

        const { ordem_categorias, equipamentos } = data;

        let html = '';
        const filter = container.getAttribute('data-filter');
        const categoriasParaMostrar = filter ? [filter] : ordem_categorias;

        // Iterar pelas categorias na ordem definida
        categoriasParaMostrar.forEach(catNome => {
            const equipamentosDaCategoria = equipamentos.filter(e => e.categoria === catNome);

            if (equipamentosDaCategoria.length > 0) {
                const sectionId = catNome.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '');
                html += `
                    <section class="categoria-section" id="${sectionId}">
                        <h2 class="categoria-title">${catNome}</h2>
                `;

                // Agrupar por Sub Categoria com os nomes lúdicos
                const subCategorias = ["Primeiros Passos no Kung Fu", "Aprimorando a Técnica", "Pronto para o Combate"];

                subCategorias.forEach(subCat => {
                    const itens = equipamentosDaCategoria.filter(e => e.sub_categoria === subCat);

                    if (itens.length > 0) {
                        html += `
                            <div class="subcategoria-group">
                                <h3 class="subcategoria-title">${subCat}</h3>
                                <div class="equipamentos-grid">
                                    ${itens.map(item => {
                            const isMultiLink = Array.isArray(item.link);
                            const cardTag = isMultiLink ? 'div' : 'a';
                            const hrefAttr = isMultiLink ? '' : `href="${item.link}" target="_blank"`;
                            const linkContent = isMultiLink
                                ? `<div class="multi-links">
                                                ${item.link.map((l, i) => `<a href="${l}" target="_blank" class="equipamento-link-btn sm">Opção ${i + 1}</a>`).join('')}
                                               </div>`
                                : `<div class="equipamento-link-btn">Ver Produto</div>`;

                            return `
                                        <${cardTag} ${hrefAttr} class="equipamento-card ${isMultiLink ? 'no-hover-link' : ''}">
                                            <div class="equipamento-img-wrapper">
                                                <img src="${item.imagem}" alt="${item.nome}" class="equipamento-img" onerror="this.src='https://via.placeholder.com/200x200?text=Equipamento'">
                                            </div>
                                            <div class="equipamento-info">
                                                <div class="equipamento-nome">${item.nome}</div>
                                                ${linkContent}
                                            </div>
                                        </${cardTag}>
                                    `}).join('')}
                                </div>
                            </div>
                        `;
                    }
                });

                html += `</section>`;
            }
        });

        container.innerHTML = html;

    } catch (error) {
        console.error('Erro ao carregar equipamentos:', error);
        container.innerHTML = `<p style="text-align: center; color: var(--accent);">Erro ao carregar as indicações de equipamentos.</p>`;
    }
}

// Inicializar
document.addEventListener('DOMContentLoaded', loadEquipamentos);
