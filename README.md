# Frontend - Dashboard Prototipo

Este projeto é um **protótipo de dashboard simples** desenvolvido com **Vite + Vue 3 + TypeScript**. Ele utiliza **PrimeVue** para componentes UI, **TailwindCSS** para estilização e **Leaflet** para mapas interativos. O gerenciamento de estado global é feito com **Pinia** e o consumo de dados é feito via uma API customizada.

---

## Tecnologias utilizadas

- **Vue 3 + Composition API**
- **TypeScript**
- **Vite**
- **Pinia** (gerenciamento de estado global)
- **PrimeVue** (componentes de UI: DataTable, Dropdown, Card, Listbox, Button)
- **TailwindCSS** (estilização)
- **Leaflet** (mapas interativos)
- Consumo de API customizada para clientes, inspeções e alertas

---

## Requisitos

- Node.js v18+
- npm ou yarn
- Git
- Backend da API rodando localmente (ver [README Backend](../backend/README.md))

---

## Instalação

1. Clone o repositório e entre na pasta do frontend:

```bash
git clone https://github.com/Carlos-Teixeira-Jr/inspecoes-frontend.git
cd frontend

npm install
# ou
yarn install

## Variáveis de ambiente (configuração local)

Para rodar o frontend localmente, você precisa criar um arquivo `.env` na raiz do projeto. Esse arquivo indica a URL da API que o frontend vai consumir.

### Passos:

1. Crie o arquivo `.env`:

```bash
touch .env


# URL da API local
VITE_API_URL=http://localhost:3000
