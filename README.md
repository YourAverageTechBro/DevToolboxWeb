This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

### 1. Obtain Your Clerk Secret Key or API Key 

- Go to the Clerk [Dashboard](https://dashboard.clerk.com/sign-in).
- Log in with your credentials.
- Navigate to your instance or project settings.
- Look for the section where API keys or secrets are listed. You should find your Secret Key or API Key there.

### 2. Create a .env.local File

- Create the **.env.local** File: In the root directory of your project, create a file named .env.local
- Add Your Keys: Open the **.env.local** file and add your Clerk keys like so:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<your_clerk_publishable_key_here>
CLERK_SECRET_KEY=<your_clerk_secret_key_here>
```
### 3. Run Your Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Self hosting with docker

Although the project is not yet available on Docker Hub, you can self-host it by building the Docker image yourself. Follow these steps to get started:

**Step 1** : install the docker engine ([how to install docker](https://docs.docker.com/engine/install/))

**Step 2** : clone the repository 

**Step 3** : build the container

```bash
docker build . -t devoolboxweb
```
**Step 4** get api key on [Clerk](https://dashboard.clerk.com/sign-in)
**Step 5** : run the docker with needed variables : 

```bash
docker container run \
    --name devoolboxweb \
    -p 3000:3000 \
    -e NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key \
    -e CLERK_SECRET_KEY=your_secret_key \
    devoolboxweb
```

Note : without the vars `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` , the container will throw error code 500.