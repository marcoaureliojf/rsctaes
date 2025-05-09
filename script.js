document.addEventListener('DOMContentLoaded', function() {
    // Tab switching
    const calculatorTab = document.getElementById('calculator-tab');
    const infoTab = document.getElementById('info-tab');
    const calculatorContent = document.getElementById('calculator-content');
    const infoContent = document.getElementById('info-content');
    const currentYearSpan = document.getElementById('current-year');

    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    if (calculatorTab && infoTab && calculatorContent && infoContent) {
        calculatorTab.addEventListener('click', function() {
            calculatorTab.classList.add('text-indigo-600', 'border-indigo-600', 'bg-indigo-50');
            calculatorTab.classList.remove('text-gray-500');
            infoTab.classList.remove('text-indigo-600', 'border-indigo-600', 'bg-indigo-50');
            infoTab.classList.add('text-gray-500');
            calculatorContent.classList.remove('hidden');
            infoContent.classList.add('hidden');
        });

        infoTab.addEventListener('click', function() {
            infoTab.classList.add('text-indigo-600', 'border-indigo-600', 'bg-indigo-50');
            infoTab.classList.remove('text-gray-500');
            calculatorTab.classList.remove('text-indigo-600', 'border-indigo-600', 'bg-indigo-50');
            calculatorTab.classList.add('text-gray-500');
            infoContent.classList.remove('hidden');
            calculatorContent.classList.add('hidden');
            populateInfoTable(); // Popular a tabela de informações ao clicar na aba
        });
    }

    // Competence selection
    const competenceSelect = document.getElementById('competence');
    const quantityContainer = document.getElementById('quantity-container');
    const monthsContainer = document.getElementById('months-container');
    const quantityInput = document.getElementById('quantity');
    const monthsInput = document.getElementById('months');

    if (competenceSelect && quantityContainer && monthsContainer && quantityInput && monthsInput) {
        competenceSelect.addEventListener('change', function() {
            const selectedValue = this.value;
            const selectedCompetenceData = competenceData[selectedValue];
            
            quantityContainer.classList.add('hidden');
            monthsContainer.classList.add('hidden');
            
            if (selectedCompetenceData) {
                if (selectedCompetenceData.requiresMonths) {
                    monthsContainer.classList.remove('hidden');
                    monthsContainer.querySelector('label').textContent = `Meses (${selectedCompetenceData.unit})`;
                } else {
                    quantityContainer.classList.remove('hidden');
                    // Ajustar o label do campo de quantidade para refletir a unidade
                    let unitLabel = selectedCompetenceData.unit.charAt(0).toUpperCase() + selectedCompetenceData.unit.slice(1);
                    if (selectedCompetenceData.unit === 'bloco de 10h') unitLabel = 'Blocos de 10h';
                    else if (selectedCompetenceData.unit === 'ano' || selectedCompetenceData.unit === 'ano de mandato') unitLabel = 'Anos';
                    
                    quantityContainer.querySelector('label').textContent = `Quantidade (${unitLabel})`;
                }
            }
        });
    }

    // Data storage
    let items = [];
    let totalScore = 0;

    // Competence data
    const competenceData = {
        // Itens Originais
        '1': { name: 'Atuação como fiscal de contratos, convênios e acordos', unit: 'mês', pointsPerUnit: 0.1, requiresMonths: true },
        '2': { name: 'Atuação como gestor de contratos, convênios e acordos', unit: 'mês', pointsPerUnit: 0.2, requiresMonths: true },
        '3': { name: 'Atuação em comissões de corregedoria ou correição', unit: 'portaria', pointsPerUnit: 2.5, requiresMonths: false },
        '4': { name: 'Atuação em processo licitatório de aquisição e contratação', unit: 'processo', pointsPerUnit: 1, requiresMonths: false },
        '5': { name: 'Desenvolvimento de soluções práticas que tenham impacto institucional', unit: 'solução', pointsPerUnit: 5, requiresMonths: false },
        '6': { name: 'Elaboração de editais', unit: 'edital', pointsPerUnit: 0.1, requiresMonths: false },
        '7': { name: 'Elaboração de notas técnicas, chamadas públicas, pareceres técnicos, etc.', unit: 'documento', pointsPerUnit: 1, requiresMonths: false },
        '8': { name: 'Elogio profissional', unit: 'portaria', pointsPerUnit: 1, requiresMonths: false },
        '9': { name: 'Participação como membro de comissão organizadora de processo seletivo', unit: 'edital', pointsPerUnit: 1, requiresMonths: false },
        '10': { name: 'Participação como membro de comissão responsável por processo seletivo', unit: 'edital', pointsPerUnit: 1, requiresMonths: false },
        '11': { name: 'Participação como membro de comissões de políticas públicas inclusivas', unit: 'participação', pointsPerUnit: 1, requiresMonths: false },
        // Novos Itens dos CSVs
        '12': { name: 'Participação como membro titular em comissões, comitês e grupos de trabalho no âmbito da administração pública', unit: 'portaria/declaração', pointsPerUnit: 1, requiresMonths: false },
        '13': { name: 'Participação como membro em comissões, comitês, grupos de trabalho e grupo de estudos em organizações privadas, entidades profissionais ou organizações da sociedade civil', unit: 'declaração/documento', pointsPerUnit: 1, requiresMonths: false },
        '14': { name: 'Participação como membro suplente em comissões, comitês, grupos de trabalho e grupo de estudos previstos no âmbito da administração pública', unit: 'portaria/declaração', pointsPerUnit: 0.5, requiresMonths: false },
        '15': { name: 'Participação em brigadas voluntárias de combate a incêndio e pânico', unit: 'mês', pointsPerUnit: 0.05, requiresMonths: true },
        '16': { name: 'Participação em ações voluntárias', unit: 'evento', pointsPerUnit: 1, requiresMonths: false },
        '17': { name: 'Participação em comissões de saúde e segurança no trabalho', unit: 'mandato/designação', pointsPerUnit: 1, requiresMonths: false },
        '18': { name: 'Participação em conselhos superiores e órgãos colegiados das IFE', unit: 'mandato/designação', pointsPerUnit: 2.5, requiresMonths: false },
        '19': { name: 'Participação, no exercício do cargo, em Consultorias e Assessoria Técnica Especializada', unit: 'consultoria', pointsPerUnit: 1, requiresMonths: false },
        '20': { name: 'Participação em programas e políticas públicas externos à instituição', unit: 'programa/política', pointsPerUnit: 1, requiresMonths: false },
        '21': { name: 'Participação na coordenação/supervisão e fiscalização de concurso público ou exames públicos', unit: 'edital', pointsPerUnit: 0.5, requiresMonths: false },
        '22': { name: 'Participação na logística de preparação e realização de concurso público ou exames públicos', unit: 'edital', pointsPerUnit: 0.5, requiresMonths: false },
        '23': { name: 'Tempo de efetivo exercício na carreira', unit: 'mês', pointsPerUnit: 0.1, requiresMonths: true },
        '24': { name: 'Tempo de serviço e/ou vínculo empregatício em outras instituições públicas e/ou privadas', unit: 'mês', pointsPerUnit: 0.05, requiresMonths: true },
        '25': { name: 'Trabalho desenvolvido em órgãos estatais e/ou paraestatais, escolas de governo, agências reguladoras, organismo internacionais', unit: 'ano completo', pointsPerUnit: 0.5, requiresMonths: false },
        '26': { name: 'Trabalho desenvolvido no âmbito do Ministério da Educação e sua entidades vinculadas (cessão e/ou colaboração técnica)', unit: 'mês', pointsPerUnit: 0.05, requiresMonths: true },
        '27': { name: 'Participação como membro da gestão e/ou do conselho fiscal, ou comissão sindical e associações vinculadas às IFE', unit: 'mandato', pointsPerUnit: 2.5, requiresMonths: false },
        '28': { name: 'Participação como membro em comissões permanentes e/ou assessorias instituídas por lei', unit: 'mandato', pointsPerUnit: 2.5, requiresMonths: false },
        '29': { name: 'Participação como membro de comissão de consulta/eleitoral', unit: 'consulta/eleição', pointsPerUnit: 1, requiresMonths: false },
        '30': { name: 'Participação como membro em conselho profissional', unit: 'mandato', pointsPerUnit: 0.5, requiresMonths: false },
        '31': { name: 'Participação como membro suplente da Comissão Interna de Supervisão da carreira (CIS) e outras comissões correlatas', unit: 'ano de mandato', pointsPerUnit: 0.25, requiresMonths: false },
        '32': { name: 'Participação como membro titular da Comissão Interna de Supervisão da carreira (CIS) e outras comissões correlatas', unit: 'ano de mandato', pointsPerUnit: 0.5, requiresMonths: false },
        '33': { name: 'Participação na organização de eventos pedagógicos, educacionais, científicos, tecnológicos, esportivos, sociais, filantrópicos ou culturais', unit: 'certificado/declaração', pointsPerUnit: 1, requiresMonths: false },
        '34': { name: 'Representação institucional em conselhos e/ou órgãos municipais, estaduais e federais, organizações sociais, assistenciais e/ou sem fins lucrativos', unit: 'portaria/declaração', pointsPerUnit: 1, requiresMonths: false },
        '35': { name: 'Coordenação/presidência de comissões, comitês, grupos de trabalho ou grupo de estudo na administração pública', unit: 'portaria/declaração', pointsPerUnit: 2.5, requiresMonths: false },
        '36': { name: 'Exercício em Cargo de Direção (CD) ou equivalente', unit: 'mês', pointsPerUnit: 0.25, requiresMonths: true },
        '37': { name: 'Exercício em Função Gratificada (FG) ou equivalente', unit: 'mês', pointsPerUnit: 0.1, requiresMonths: true },
        '38': { name: 'Responsável por setor, unidade ou equipe', unit: 'mês', pointsPerUnit: 0.1, requiresMonths: true },
        '39': { name: 'Substituição de função (CD) ou equivalente', unit: 'bloco de 30 dias', pointsPerUnit: 0.25, requiresMonths: false }, // Usuário insere número de blocos de 30 dias
        '40': { name: 'Substituição de função (FG) ou equivalente', unit: 'bloco de 30 dias', pointsPerUnit: 0.1, requiresMonths: false }, // Usuário insere número de blocos de 30 dias
        '41': { name: 'Certificação de proficiência ou curso em LIBRAS e/ou língua estrangeira', unit: 'certificação', pointsPerUnit: 5, requiresMonths: false },
        '42': { name: 'Certificação Profissional na área de atuação', unit: 'certificação', pointsPerUnit: 1, requiresMonths: false },
        '43': { name: 'Participação em capacitações como instrutor ou conteudista em curso de formação, de desenvolvimento ou de treinamento', unit: 'curso', pointsPerUnit: 1, requiresMonths: false },
        '44': { name: 'Participação em capacitações como tutor, monitor, orientador ou mentor em curso de formação, de desenvolvimento ou de treinamento', unit: 'participação', pointsPerUnit: 0.5, requiresMonths: false },
        '45': { name: 'Participação em capacitações, incluindo disciplinas isoladas em cursos de graduação e pós-graduação', unit: 'bloco de 10h', pointsPerUnit: 0.2, requiresMonths: false }, // 0.2 pontos a cada 10h
        '46': { name: 'Títulos de educação formal que excedam o nível exigido para o ingresso no cargo', unit: 'diploma/certificado', pointsPerUnit: 5, requiresMonths: false },
        '47': { name: 'Autoria de obras artísticas e cultural registradas', unit: 'obra', pointsPerUnit: 2.5, requiresMonths: false },
        '48': { name: 'Autor de projeto aprovado em edital de pesquisa e/ou extensão', unit: 'edital/projeto', pointsPerUnit: 2.5, requiresMonths: false },
        '49': { name: 'Captação de recursos em projetos de desenvolvimento institucional e/ou ensino e/ou pesquisa e/ou extensão e/ou inovação e/ou gestão e/ou assistência', unit: 'edital/projeto', pointsPerUnit: 2.5, requiresMonths: false },
        '50': { name: 'Carta Patente', unit: 'patente', pointsPerUnit: 5, requiresMonths: false },
        '51': { name: 'Contratos de transferência de tecnologia e licenciamento', unit: 'contrato', pointsPerUnit: 5, requiresMonths: false },
        '52': { name: 'Coordenação de acordos ou convênios de cooperação', unit: 'acordo/convênio', pointsPerUnit: 2.5, requiresMonths: false },
        '53': { name: 'Coordenação de elaboração de Projetos Pedagógicos de novos Cursos', unit: 'projeto', pointsPerUnit: 2.5, requiresMonths: false },
        '55': { name: 'Desenvolvimento de software e sistemas digitais', unit: 'registro', pointsPerUnit: 5, requiresMonths: false },
        '58': { name: 'Edição, organização, revisão, tradução e avaliação/parecer em publicações', unit: 'livro/periódico', pointsPerUnit: 1, requiresMonths: false },
        '59': { name: 'Liderança ou vice-liderança de grupo de pesquisa registrado', unit: 'grupo de pesquisa', pointsPerUnit: 2.5, requiresMonths: false },
        '60': { name: 'Atuação de servidor como avaliador em eventos acadêmicos, científicos, culturais, esportivos e técnicos', unit: 'evento', pointsPerUnit: 1, requiresMonths: false },
        '61': { name: 'Atividade de avaliação do projeto de ensino e/ou pesquisa e/ou extensão e/ou inovação', unit: 'projeto', pointsPerUnit: 1, requiresMonths: false },
        '62': { name: 'Participação como coordenador de implantação de unidades de ensino', unit: 'unidade de ensino', pointsPerUnit: 2.5, requiresMonths: false },
        '63': { name: 'Participação como coordenador em projetos de desenvolvimento institucional e/ou ensino e/ou pesquisa e/ou extensão e/ou inovação e/ou assistência', unit: 'projeto', pointsPerUnit: 2.5, requiresMonths: false },
        '64': { name: 'Participação como mediador, palestrante, apresentador ou artista em eventos diversos', unit: 'evento', pointsPerUnit: 1, requiresMonths: false },
        '65': { name: 'Participação como membro de equipe de implantação de unidades de ensino', unit: 'unidade implantada', pointsPerUnit: 1, requiresMonths: false },
        '66': { name: 'Participação como ouvinte ou assistente em eventos diversos', unit: 'evento', pointsPerUnit: 0.1, requiresMonths: false },
        '67': { name: 'Participação em comissão de elaboração/reformulação de projetos pedagógicos de cursos', unit: 'projeto', pointsPerUnit: 0.5, requiresMonths: false },
        '68': { name: 'Participação em conselhos editoriais', unit: 'livro/periódico', pointsPerUnit: 2.5, requiresMonths: false },
        '69': { name: 'Participação em coordenação de elaboração/reformulação de projetos pedagógicos de cursos', unit: 'projeto', pointsPerUnit: 1, requiresMonths: false },
        '70': { name: 'Participação em grupo de pesquisa registrado', unit: 'projeto', pointsPerUnit: 1, requiresMonths: false }, // CSV diz "Por projeto" como unidade
        '71': { name: 'Participação em projeto de implantação/implementação de ambientes de ensino/aprendizagem, laboratórios, etc.', unit: 'projeto', pointsPerUnit: 1, requiresMonths: false },
        '72': { name: 'Participação em projetos de desenvolvimento institucional e/ou ensino e/ou pesquisa e/ou extensão e/ou inovação e/ou assistência', unit: 'projeto', pointsPerUnit: 1, requiresMonths: false },
        '73': { name: 'Participação na organização de congresso, simpósio, conferência, etc.', unit: 'evento', pointsPerUnit: 1, requiresMonths: false },
        '74': { name: 'Participação no desenvolvimento de protótipos, depósitos e/ou registros de propriedade intelectual', unit: 'projeto', pointsPerUnit: 2.5, requiresMonths: false },
        '75': { name: 'Prêmio de mérito profissional ou acadêmico, comendas e homenagens', unit: 'premiação', pointsPerUnit: 2.5, requiresMonths: false },
        '77': { name: 'Publicação de artigos, trabalho completo e capítulo de livro (com ISBN e Conselho Editorial)', unit: 'publicação', pointsPerUnit: 1.5, requiresMonths: false },
        '78': { name: 'Publicação de livro (com ISBN e Conselho Editorial)', unit: 'publicação', pointsPerUnit: 2.5, requiresMonths: false },
        '79': { name: 'Avaliador de curso pelo INEP ou pelo MEC', unit: 'avaliação', pointsPerUnit: 2.5, requiresMonths: false },
        '80': { name: 'Elaboração, revisão e/ou correção de provas de exame de seleção, vestibular ou concursos', unit: 'edital', pointsPerUnit: 1, requiresMonths: false },
        '81': { name: 'Participação como jurado na área de atuação', unit: 'evento', pointsPerUnit: 0.5, requiresMonths: false },
        '82': { name: 'Participação como orientador das monitorias de disciplinas e nas unidades de produção e laboratórios', unit: 'orientação', pointsPerUnit: 0.5, requiresMonths: false },
        '83': { name: 'Participação como orientador de bolsistas de apoio técnico', unit: 'orientação', pointsPerUnit: 0.5, requiresMonths: false },
        '84': { name: 'Participação como orientador/supervisor de estágios supervisionados', unit: 'orientação/supervisão', pointsPerUnit: 0.5, requiresMonths: false },
        '85': { name: 'Participação como preceptor em residências acadêmicas', unit: 'precepção', pointsPerUnit: 1, requiresMonths: false },
        '86': { name: 'Participação como tutor de servidor em estágio probatório', unit: 'tutoria', pointsPerUnit: 0.5, requiresMonths: false },
        '87': { name: 'Participação no apoio a atividades de preceptoria em residências médica e multiprofissional', unit: 'declaração semestral', pointsPerUnit: 0.1, requiresMonths: false },
    };

    // Element selectors
    const addBtn = document.getElementById('add-btn');
    const detailsContainer = document.getElementById('details-container');
    const itemsTableBody = document.getElementById('items-table-body');
    const totalScoreElement = document.getElementById('total-score');
    const resetBtn = document.getElementById('reset-btn');
    const printBtn = document.getElementById('print-btn');

    // Add item
    if (addBtn && competenceSelect && quantityInput && monthsInput && competenceData) {
        addBtn.addEventListener('click', function() {
            const selectedCompetenceValue = competenceSelect.value;
            
            if (!selectedCompetenceValue) {
                alert('Por favor, selecione uma competência.');
                return;
            }
            
            const competence = competenceData[selectedCompetenceValue];
            if (!competence) { 
                alert('Dados da competência não encontrados.');
                return;
            }

            let quantityValue, points, description;
            
            if (competence.requiresMonths) {
                quantityValue = parseInt(monthsInput.value);
                if (isNaN(quantityValue) || quantityValue < 1) {
                    alert('Por favor, insira um número de meses válido (maior ou igual a 1).');
                    monthsInput.focus();
                    return;
                }
                points = quantityValue * competence.pointsPerUnit;
                description = `${quantityValue} ${competence.unit}${quantityValue > 1 ? (competence.unit === 'mês' ? 'es' : 's') : ''}`;
            } else {
                quantityValue = parseInt(quantityInput.value);
                 if (isNaN(quantityValue) || quantityValue < 1) {
                    alert('Por favor, insira uma quantidade válida (maior ou igual a 1).');
                    quantityInput.focus();
                    return;
                }
                points = quantityValue * competence.pointsPerUnit;
                // Pluralização da unidade de forma mais genérica
                let pluralUnit = competence.unit;
                if (quantityValue > 1) {
                    if (competence.unit.endsWith('s') || competence.unit.endsWith('z') || competence.unit.endsWith('r')) {
                        pluralUnit += 'es';
                    } else if (competence.unit.endsWith('ão')) {
                         pluralUnit = competence.unit.slice(0, -2) + 'ões';
                    } else if (competence.unit.endsWith('al') || competence.unit.endsWith('el') || competence.unit.endsWith('ol') || competence.unit.endsWith('ul')) {
                        pluralUnit = competence.unit.slice(0, -1) + 'is';
                    } else {
                        pluralUnit += 's';
                    }
                }
                description = `${quantityValue} ${quantityValue > 1 ? pluralUnit : competence.unit}`;
            }
            
            const item = {
                id: Date.now(),
                competenceId: selectedCompetenceValue,
                name: competence.name,
                quantity: quantityValue,
                unit: competence.unit, // Armazena a unidade base
                points: points,
                description: description // Descrição já formatada com plural
            };
            
            items.push(item);
            totalScore += points;
            
            updateUI();
            
            competenceSelect.value = '';
            if (quantityContainer) quantityContainer.classList.add('hidden');
            if (monthsContainer) monthsContainer.classList.add('hidden');
            quantityInput.value = '1';
            monthsInput.value = '1';
        });
    }

    // Remove item function
    function removeItem(id) {
        const itemIndex = items.findIndex(item => item.id === id);
        if (itemIndex !== -1) {
            totalScore -= items[itemIndex].points;
            items.splice(itemIndex, 1);
            updateUI();
        }
    }
    window.removeItem = removeItem; 

    // Update UI
    function updateUI() {
        if (totalScoreElement) {
            totalScoreElement.textContent = totalScore.toFixed(2).replace('.', ','); // Exibir com vírgula
        }
        
        if (detailsContainer) {
            if (items.length === 0) {
                detailsContainer.innerHTML = '<p class="text-gray-500 text-sm italic">Nenhuma competência adicionada ainda</p>';
            } else {
                detailsContainer.innerHTML = '';
                items.forEach(item => {
                    const detailElement = document.createElement('div');
                    detailElement.className = 'flex justify-between items-center mb-2 fade-in';
                    detailElement.innerHTML = `
                        <span class="text-sm text-gray-700">${item.name}</span>
                        <span class="text-sm font-medium text-indigo-600">+${item.points.toFixed(2).replace('.', ',')}</span>
                    `;
                    detailsContainer.appendChild(detailElement);
                });
            }
        }
        
        if (itemsTableBody) {
            if (items.length === 0) {
                itemsTableBody.innerHTML = `
                    <tr>
                        <td colspan="4" class="py-4 px-4 text-center text-gray-500">Nenhum item adicionado</td>
                    </tr>
                `;
            } else {
                itemsTableBody.innerHTML = '';
                items.forEach(item => {
                    const row = document.createElement('tr');
                    row.className = 'fade-in';
                    row.innerHTML = `
                        <td class="py-3 px-4">${item.name}</td>
                        <td class="py-3 px-4">${item.description}</td>
                        <td class="py-3 px-4 text-right">${item.points.toFixed(2).replace('.', ',')}</td>
                        <td class="py-3 px-4 text-right">
                            <button onclick="removeItem(${item.id})" class="text-red-500 hover:text-red-700" aria-label="Remover item ${item.name}">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </td>
                    `;
                    itemsTableBody.appendChild(row);
                });
            }
        }
    }

    // Reset
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            items = [];
            totalScore = 0;
            updateUI();
            if (competenceSelect) competenceSelect.value = '';
            if (quantityContainer) quantityContainer.classList.add('hidden');
            if (monthsContainer) monthsContainer.classList.add('hidden');
            if (quantityInput) quantityInput.value = '1';
            if (monthsInput) monthsInput.value = '1';
        });
    }
    
    function populateInfoTable() {
        const container = document.getElementById('info-table-container');
        if (!container) return;

        let tableHTML = `
            <table class="min-w-full bg-white rounded-lg overflow-hidden">
                <thead class="bg-indigo-600 text-white">
                    <tr>
                        <th class="py-3 px-4 text-left">No.</th>
                        <th class="py-3 px-4 text-left">Competência</th>
                        <th class="py-3 px-4 text-left">Unidade de Medida</th>
                        <th class="py-3 px-4 text-right">Pontos por Unidade</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
        `;

        const sortedCompetenceKeys = Object.keys(competenceData).sort((a, b) => parseInt(a) - parseInt(b));

        for (const key of sortedCompetenceKeys) {
            const competence = competenceData[key];
            let unitDescription = competence.unit;
            if (competence.requiresMonths) {
                unitDescription = `Tempo (${competence.unit})`;
            } else if (competence.unit === 'bloco de 10h') {
                unitDescription = `Por Carga horária (a cada 10 horas)`;
            } else if (competence.unit === 'ano completo' || competence.unit === 'ano de mandato') {
                unitDescription = `Tempo (${competence.unit})`;
            } else if (competence.unit === 'bloco de 30 dias') {
                unitDescription = `Tempo (a cada 30 dias)`;
            }
             else {
                unitDescription = `Por ${competence.unit}`;
            }


            tableHTML += `
                <tr>
                    <td class="py-3 px-4">${key}</td>
                    <td class="py-3 px-4">${competence.name}</td>
                    <td class="py-3 px-4">${unitDescription}</td>
                    <td class="py-3 px-4 text-right">${competence.pointsPerUnit.toString().replace('.', ',')}</td>
                </tr>
            `;
        }

        tableHTML += `
                </tbody>
            </table>
        `;
        container.innerHTML = tableHTML;
    }


    // Print
    if (printBtn) {
        printBtn.addEventListener('click', function() {
            const printContent = `
                <div style="padding: 20px; font-family: Arial, sans-serif; color: #333;">
                    <style>
                        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 0.9em; }
                        th { background-color: #4f46e5; color: white; }
                        h1, h2 { color: #4f46e5; }
                        .total-score-value { font-weight: bold; color: #4f46e5; font-size: 1.2em; }
                        @page { size: A4; margin: 20mm; }
                        body { margin: 0; }
                    </style>
                    <h1 style="text-align: center; font-size: 20px; margin-bottom: 20px;">Relatório de Pontuação de Competências</h1>
                    
                    <div style="margin-bottom: 20px;">
                        <h2 style="font-size: 16px; border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-bottom: 10px;">Resumo</h2>
                        <p style="font-size: 14px;"><strong>Pontuação Total:</strong> <span class="total-score-value">${totalScore.toFixed(2).replace('.', ',')} pontos</span></p>
                    </div>
                    
                    ${items.length > 0 ? `
                    <div style="margin-bottom: 20px;">
                        <h2 style="font-size: 16px; border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-bottom: 10px;">Itens Adicionados</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>Competência</th>
                                    <th>Detalhes</th>
                                    <th style="text-align: right;">Pontos</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${items.map(item => `
                                    <tr>
                                        <td>${item.name}</td>
                                        <td>${item.description}</td>
                                        <td style="text-align: right;">${item.points.toFixed(2).replace('.', ',')}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                    ` : '<p style="text-align: center; color: #666;">Nenhum item adicionado para exibir no relatório.</p>'}
                    
                    <div style="margin-top: 30px; font-size: 10px; color: #666; text-align: center; border-top: 1px solid #eee; padding-top: 10px;">
                        <p>Gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</p>
                        <p>Calculadora de Saberes e Competências</p>
                    </div>
                </div>
            `;
            
            const printWindow = window.open('', '_blank');
            if (printWindow) {
                printWindow.document.write(`
                    <html>
                        <head>
                            <title>Relatório de Pontuação - Calculadora de Saberes e Competências</title>
                            <style>
                                @media print {
                                    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                                }
                            </style>
                        </head>
                        <body>
                            ${printContent}
                            <script>
                                window.onload = function() {
                                    setTimeout(function() { 
                                        window.print();
                                        window.onafterprint = function() {
                                            // Alguns navegadores (ex: Chrome) fecham automaticamente após o print
                                            // Para outros, podemos tentar fechar.
                                            // window.close(); 
                                        }
                                        // Timeout para garantir que, se onafterprint não funcionar ou o usuário cancelar, a janela não fique aberta para sempre
                                        // setTimeout(function() { if (!window.closed) { window.close(); } }, 5000);
                                    }, 500);
                                };
                            <\/script>
                        </body>
                    </html>
                `);
                printWindow.document.close();
            } else {
                alert('Não foi possível abrir a janela de impressão. Verifique se seu navegador está bloqueando pop-ups.');
            }
        });
    }
    updateUI();
});