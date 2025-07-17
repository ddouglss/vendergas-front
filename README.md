

  <h1>💨 Vender Gás – Sistema de Gestão de Distribuição</h1>
  <p>Sistema completo de gestão para distribuidoras de gás, com controle de usuários, empresas, clientes, produtos e pedidos.</p>
  <p>Desenvolvido com <strong>React 19 + Vite</strong>, totalmente responsivo, com autenticação JWT e controle de permissões.</p>
  <p><strong>Deploy:</strong> <a href="https://vendergas.vercel.app" target="_blank">https://vendergas.vercel.app</a></p>

<h2>🚀 Funcionalidades</h2>
  <ul>
    <li>Tela de cadastro de usuário</li>
    <li>Tela de autenticação</li>
    <li>Tela de cadastro e gerenciamento de empresas</li>
    <li>Tela de cadastro e gerenciamento de produtos</li>
    <li>Tela de cadastro e gerenciamento de clientes</li>
    <li>Tela para lançamento de pedidos</li>
    <li>Tela para gerenciamento dos pedidos</li>
  </ul>

<h2>📁 Estrutura do Projeto</h2>
  <pre><code>
src/
├── components/ 
├── context/
├── layout/
├── pages/
│   ├── Auth/
│   ├── Empresas/
│   ├── Produtos/
│   ├── Clientes/
│   └── Pedidos/
├── routes/
├── services/
├── styles/
├── App.jsx
├── main.jsx
└── index.css
  </code></pre>

<h2>⚙️ Tecnologias Utilizadas</h2>
<h3>Front-end</h3>
  <ul>
    <li>React 19 + Vite</li>
    <li>React Router DOM 7</li>
    <li>Axios</li>
    <li>React Hook Form + Yup</li>
    <li>JWT Decode</li>
    <li>Redux Toolkit</li>
    <li>Radix UI Dropdown Menu</li>
    <li>Lucide React</li>
    <li>React Bootstrap + Bootstrap 5</li>
    <li>DayJS</li>
    <li>React Pro Sidebar</li>
  </ul>

<h3>Lint & Qualidade</h3>
  <ul>
    <li>ESLint</li>
    <li>eslint-plugin-react-hooks</li>
    <li>Suporte a @types para React</li>
  </ul>

<h2>🧑‍💻 Como rodar localmente</h2>
<h3>1. Clone o projeto</h3>
  <pre><code>git clone https://github.com/seu-usuario/vendergas-front.git
cd vendergas-front</code></pre>

<h3>2. Instale as dependências</h3>
  <pre><code>npm install</code></pre>

<h3>3. Crie o arquivo .env</h3>
  <pre><code>VITE_API_BASE_URL=https://vendergas.up.railway.app/api</code></pre>

<h3>4. Execute o projeto</h3>
  <pre><code>npm run dev</code></pre>

  <p>Acesse: <a href="http://localhost:5173" target="_blank">http://localhost:5173</a></p>

<h2>🔐 Controle de Acesso</h2>
  <table>
    <thead>
      <tr>
        <th>Papel</th>
        <th>Acesso</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>superadmin</td>
        <td>Acesso total a todas as empresas e dados</td>
      </tr>
      <tr>
        <td>admin</td>
        <td>Acesso total à empresa associada</td>
      </tr>
      <tr>
        <td>user</td>
        <td>Acesso restrito aos recursos liberados</td>
      </tr>
    </tbody>
  </table>

<h2>📦 Scripts Disponíveis</h2>
  <pre><code>
npm run dev       # Desenvolvimento
npm run build     # Build de produção
npm run preview   # Preview da build
npm run lint      # Lint do projeto
  </code></pre>

<h2>📄 Licença</h2>
  <p>Distribuído sob a licença MIT.</p>

  <p><em>Desenvolvido por Douglas Souza </em> 16-07-2025</p>

</body>

