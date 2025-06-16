
# Odonto Legal Mobile

Aplicativo móvel oficial do sistema Odonto Legal, desenvolvido em **React Native (Expo)**.

## 📱 Funcionalidades Principais

- **Login com autenticação JWT**
- **Listagem de Casos Periciais**
- **Cadastro de Novos Casos**
  - Seleção de perito principal
  - Adição de participantes
  - Upload de evidências (fotos da câmera ou arquivos do dispositivo)
- **Alteração de Status de Casos**
  - Finalizar
  - Arquivar
- **Listagem de Relatórios (Dossiês)**
  - Filtro por título, status, perito ou data
  - Visualização de PDFs de relatórios gerados
- **Dashboard com Resumo de Dados**
  - Contagem de usuários, casos ativos, arquivados e relatórios
  - Gráficos de barras e pizza (dados vindos da API)

## 📂 Estrutura de Pastas

```
- App.tsx                  # Entry point da aplicação
- /src
  ├── /components          # Telas da aplicação (Login, CasesList, RegisterCase, Dashboard, ReportsList)
  ├── /context             # AuthContext para controle de autenticação
  ├── /navigation          # Drawer Navigator (menu lateral)
  ├── /services            # Chamadas de API (AuthService, CasesService, UsersService, DashboardService, ReportsService)
```

## ⚙️ Tecnologias e Bibliotecas

- **React Native + Expo**
- **React Navigation (Stack + Drawer)**
- **Axios** (requisições HTTP)
- **Expo Image Picker e Document Picker**
- **React Native AsyncStorage** (armazenamento local de token)
- **Expo FileSystem** (upload de arquivos)

## 🚀 Rodando o Projeto

1. Instalar dependências:

```bash
npm install
```

2. Iniciar o app no Expo:

```bash
npx expo start
```

3. Rodar no emulador ou dispositivo físico via Expo Go.

## 📦 Gerar APK

```bash
npx expo export --platform android
npx eas build --platform android
```

> (Caso esteja usando EAS Build, siga as configurações de build do Expo)

## 🔐 Backend

O app consome APIs de um backend **Node.js + Prisma**, que deve estar rodando e configurado para:
- Autenticação
- Casos
- Relatórios
- Upload de evidências

## ✅ Requisitos de Backend

- Endpoint `/auth/login`
- Endpoint `/cases`
- Endpoint `/users/selectable`
- Endpoint `/dashboard/summary`
- Endpoint `/reports`

## ✉️ Contato

Projeto desenvolvido por Gleybe Cavalcanti para o sistema Odonto Legal.

---
