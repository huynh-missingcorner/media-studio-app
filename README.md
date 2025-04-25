# Media Studio App

A modern React application for generating various types of media (images, videos, audio, music) using AI technologies.

## 🌟 Features

- **Multi-media Generation**: Create images, videos, audio, and music with AI
- **Customizable Settings**: Fine-tune generation parameters for each media type
- **Real-time Preview**: View generation results in real-time with loading indicators
- **User Authentication**: Secure login and registration system
- **Project Management**: Organize your media generations into projects
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Mode Support**: Toggle between light and dark themes
- **Download Options**: Easy download of generated media

## 🚀 Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS with Shadcn UI components
- **State Management**: Zustand
- **Routing**: React Router v6
- **Form Handling**: React Hook Form with Zod validation
- **HTTP Client**: Axios
- **Real-time Updates**: Socket.IO

## 📋 Prerequisites

- Node.js (v16 or higher)
- pnpm (recommended) or npm/yarn

## 🔧 Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/media-studio-app.git
cd media-studio-app
```

2. Install dependencies

```bash
pnpm install
```

3. Set up environment variables

Create a `.env` file in the root directory:

```
VITE_API_URL=http://localhost:3000
```

You can customize the API URL to point to your backend server.

4. Start the development server

```bash
pnpm dev
```

5. Open your browser and navigate to http://localhost:8501

## 🏗️ Build for Production

```bash
pnpm build
```

To preview the production build:

```bash
pnpm serve
```

## 🧪 Testing

Run the test suite:

```bash
pnpm test
```

Watch mode for development:

```bash
pnpm test:watch
```

With UI:

```bash
pnpm test:ui
```

## ⚙️ Environment Configuration

The application uses the following environment variables:

| Variable     | Description            | Default               |
| ------------ | ---------------------- | --------------------- |
| VITE_API_URL | URL of the backend API | http://localhost:3000 |

For production deployment, make sure to set these variables in your deployment environment or in a `.env.production` file:

```
VITE_API_URL=https://your-production-api.com
```

## 📁 Project Structure

```
/src
  /assets            # Static assets like fonts
  /components
    /custom          # Project-specific components
      /auth          # Authentication components
      /dashboard     # Dashboard components
      /icons         # Custom icons
      /layout        # Layout components (headers, footers)
      /media         # Media generation components
      /profile       # User profile components
      /projects      # Project management components
    /ui              # Shadcn UI components
  /contexts          # React contexts
  /hooks             # Custom React hooks
  /interfaces        # TypeScript interfaces
  /lib               # Utility functions
  /pages             # Page components
    /app             # Main app pages
    /auth            # Authentication pages
  /services          # API services
  /stores            # Zustand state stores
  /types             # TypeScript type definitions
```

## 🧩 Key Components

- **MediaTypeNavbar**: Navigation for selecting media types
- **PromptInput**: Text input for generation prompts with settings
- **MediaPreview**: Display area for generated media with download options
- **DashboardLayout**: Main application layout with navigation

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the terms of the license included in the repository.

## 📞 Contact

For questions or feedback, please open an issue in the repository.
