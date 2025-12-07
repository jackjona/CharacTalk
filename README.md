# CharacTalk

**CharacTalk** is an AI-powered roleplay chat platform where you can interact with dynamic characters and explore endless narratives powered by advanced AI language models.

## Features

- **AI-Powered Roleplay**: Interact with lifelike, evolving AI characters that respond intelligently to your input.
- **Immersive Dialogues**: Experience seamless, dynamic conversations.
- **Endless Possibilities**: Dive into various genres like fantasy and more.
- **PWA Support**: Access the platform seamlessly across devices with Progressive Web App (PWA) support, allowing fora native app-like experience.
- **Text-to-Speech (TTS) Capability**: Engage in voice-based roleplay with built-in TTS features that bring your conversations to life.

## Built Using

- Next.js
- TailwindCSS
- Supabase Database
- Openrouter
- edge-tts

## To Develop Locally

1. Get an Openrouter API key

2. Setup a Supabase database with a table called `biographies`. Populate the database following the [Database Schema](###database-schema).

3. (Optional for TTS capabilities) Setup and run [edge-tts](https://github.com/rany2/edge-tts)

4. Set the env variables in `.env.local.example` and rename the file to `.env.local`

5. Then run the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

### Database Schema

| **Name**           | **Format**                 | **Type**  | **Description**                                                           |
| ------------------ | -------------------------- | --------- | ------------------------------------------------------------------------- |
| **id**             | `bigint`                   | `number`  | Unique identifier for the character.                                      |
| **character_name** | `text`                     | `string`  | Character's full name.                                                    |
| **biography**      | `text`                     | `string`  | A brief biography of the character, detailing background and personality. |
| **created_at**     | `timestamp with time zone` | `string`  | Date and time the character was created.                                  |
| **voice**          | `text`                     | `string`  | Text-to-Speech (TTS) voice associated with the character.                 |
| **character_id**   | `uuid`                     | `string`  | A unique identifier for each character instance.                          |
| **description**    | `text`                     | `string`  | A detailed description of the character's traits and attributes.          |
| **img_url**        | `text`                     | `string`  | URL(s) for the character image(s).                                        |
| **public**         | `boolean`                  | `boolean` | Whether or not the character should be displayed on the homepage.         |
