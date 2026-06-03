This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

Run the backend API server in one terminal:

```bash
npm run backend
```

Run the Next.js development server in another terminal:

```bash
npm run dev
```

Or start both together with:

```bash
npm run dev:all
```

If you need to use a different API port, set `NEXT_PUBLIC_API_PORT` before starting the frontend.

```bash
NEXT_PUBLIC_API_PORT=5000 npm run dev
```

## Contact API
- POST `/contact` — accept JSON `{ name, email, subject, message }` and stores submissions in a local SQLite database.
- GET `/contacts` — list stored contact submissions.

Data is persisted to `data/app.db` so contact records survive backend restarts during local development.

Admin page
- Visit `/admin` to see stored contact submissions and verify persistence.
- Use the demo admin login at `/login` with credentials `admin / admin123`.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
