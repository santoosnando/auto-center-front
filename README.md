# Auto Center Frontend 

Este repositório contém a interface do usuário (Front-end) para o sistema de agendamento do **Auto Center**. A aplicação foi desenvolvida como uma **SPA (Single Page Application)** utilizando tecnologias web fundamentais, focada em veículos de luxo e performance.

# Descrição do Projeto
O Front-end oferece uma experiência fluida e moderna em *Dark Mode*, permitindo ao usuário agendar serviços, consultar status e visualizar métricas de desempenho.

### Destaques do Desenvolvimento:
* **Arquitetura SPA**: Navegação entre telas sem recarregamento de página via JavaScript puro.
* **Design Responsivo**: Uso de Bootstrap 5 aliado a CSS personalizado para uma identidade visual exclusiva.
* **Interatividade**: Gráficos dinâmicos com Chart.js e formulários com seletores dependentes (Marca/Modelo).
* **Execução Direta**: Execução local via `index.html` sem necessidade de servidores de build.


# Instruções de Instalação e Uso

### 1. Pré-requisitos
* Um navegador web.
* O **Back-end (Auto Center API)** deve estar em execução na porta `5000` para que as funcionalidades de agendamento e consulta operem corretamente.

### 2. Configuração Local
1. Clone ou baixe este repositório para a pasta `C:/dev/auto-center-front`.
2. Certifique-se de que a estrutura de pastas contém o diretório `ícones/` com os arquivos SVG necessários.

### 3. Como Executar
Basta localizar o arquivo `index.html` na raiz do projeto e abri-lo com um duplo clique no seu navegador de preferência.


# Estrutura das Telas
* **Home**: Landing page com CTA para agendamentos.
* **Agendar**: Formulário com validação de placa (Brasil/Mercosul) e lógica de modelos de luxo.
* **Consulta**: Painel de gestão com ações de Concluir, Editar, Cancelar e Excluir agendamentos.
* **Dashboard**: Gráfico de rosca indicando o resumo dos status dos serviços.


# Organização do Repositório
```text
auto-center-front/
 index.html              # Estrutura principal da SPA
 style.css               # Estilização personalizada (Dark Mode)
 script.js               # Lógica de integração com API e navegação
 README.md               # Documentação do front-end
 logo trabalho puc.png   # Logotipo oficial
 logo_fav.ico            # Favicon
 ícones/                 # Assets SVG para a interface
