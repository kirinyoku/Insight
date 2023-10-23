# Insight

Built with the Next.js 13.5 app router, tRPC, TypeScript, Prisma & Tailwind.

> **Warning**
> This application is a work in progress, with ongoing improvements and enhancement

## About this project

Insight is a web service for natural language chat with your PDFs, making it faster and easier to find information, summarize, and explore related topics.

![Project Preview](https://raw.githubusercontent.com/kirinyoku/Insight/main/public/preview.webp)

## Features

- Next.js 13 `/app` dir
- Routing, Layouts
- Metadata files
- Server and Client Components
- API Routes and Middlewares
- Data Fetching, Caching and Mutation using **tRPC**
- Internationalization using **next-intl**
- Authentication using **Kinde**
- ORM using **Prisma**
- Database on **PlanetScale**
- UI Components built using **shadcn/ui**
- Rendering PDF files with **react-pdf**.
- Embedding PDFs and messages using the **OpenAI GPT API**.
- Styled using **Tailwind CSS**
- Validations using **Zod**
- Written in **TypeScript**

## Getting started

To install and run the project:

1. Clone the repository: `git clone https://github.com/kirinyoku/Insight.git`
2. Install the dependencies: `npm install`
3. Create and fill in the .env file. The example .env file is located in the root dir in the file **.env.example**.
4. Generate Prisma Client with the following command: `prisma generate`
5. Start the development server: `npm run dev`
6. Open the application in your browser at _http://localhost:3000_.

## License

This project is open-source and was created for educational purposes. It is not monetized and encourages you to use and share it with others. It is licensed under the [MIT](https://choosealicense.cm/licenses/mit/) License, which imposes minimal restrictions on usage and distribution.
