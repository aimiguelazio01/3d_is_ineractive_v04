<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1irgtB5fHqFD4kly8alMdacJjfEj-V9YE

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deployment

### Deploying to Vercel

1. **Push to GitHub**: Ensure your latest changes are pushed to a GitHub repository.
2. **Import to Vercel**: Connect your GitHub account to [Vercel](https://vercel.com/) and import this repository.
3. **Environment Variables**: In the Vercel dashboard, add the following environment variable:
   - `GEMINI_API_KEY`: Your Google Gemini API key.
4. **Build Settings**: Vercel should automatically detect Vite. If not, use:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. **Deploy**: Click "Deploy". Your site will be live on a `.vercel.app` domain.

