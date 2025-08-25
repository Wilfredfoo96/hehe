# 🔐 Association App with Clerk Authentication

A Next.js application featuring a complete authentication system built with Clerk.

## ✨ Features

- **🔐 Complete Authentication System** - Sign up, sign in, and user management
- **🛡️ Route Protection** - Protected routes with automatic redirects
- **👤 User Dashboard** - Personalized dashboard with user information
- **🎨 Modern UI** - Built with Tailwind CSS and responsive design
- **🌙 Dark Mode Support** - Automatic dark/light theme switching
- **📱 Responsive Design** - Works perfectly on all devices

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- Clerk account ([sign up here](https://clerk.com))

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd association-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the project root:
   ```env
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
   CLERK_SECRET_KEY=sk_test_your_secret_key_here
   
   # Clerk URLs (for development)
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
   ```

4. **Get your Clerk API keys**
   - Go to [Clerk Dashboard](https://dashboard.clerk.com)
   - Create a new application
   - Copy your **Publishable Key** and **Secret Key**
   - Replace the placeholder values in `.env.local`

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
association-app/
├── src/
│   ├── app/                    # App Router pages
│   │   ├── dashboard/         # Protected dashboard
│   │   ├── sign-in/          # Sign in page
│   │   ├── sign-up/          # Sign up page
│   │   ├── layout.tsx        # Root layout with ClerkProvider
│   │   └── page.tsx          # Home page
│   ├── components/            # Reusable components
│   │   ├── Header.tsx        # Navigation header
│   │   └── UserProfile.tsx   # User profile display
│   └── middleware.ts         # Clerk authentication middleware
├── .env.local                 # Environment variables (create this)
└── package.json              # Dependencies
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🎯 How to Use

### For Users

1. **Visit the home page** - See authentication options
2. **Sign up** - Create a new account with email/password
3. **Sign in** - Access your existing account
4. **Dashboard** - View your profile and account information
5. **Sign out** - Securely log out of your account

### For Developers

- **Add new protected routes** - Use the `auth()` function in server components
- **Client-side protection** - Use `useAuth()` and `useUser()` hooks
- **Customize authentication** - Modify Clerk appearance and behavior
- **Add social login** - Configure providers in Clerk dashboard

## 🛡️ Security Features

- **Route Protection** - Automatic redirects for unauthenticated users
- **Session Management** - Secure session handling with Clerk
- **Middleware** - Request-level authentication checks
- **Environment Variables** - Secure API key storage

## 🎨 Customization

### Clerk Theme

Modify the `ClerkProvider` in `src/app/layout.tsx`:

```tsx
<ClerkProvider appearance={{
  baseTheme: dark, // or light
  variables: {
    colorPrimary: '#3b82f6',
    colorBackground: '#1f2937',
  }
}}>
```

### Styling

The app uses Tailwind CSS. Customize colors, spacing, and components in:
- `src/app/globals.css` - Global styles
- Component files - Individual component styling

## 🔧 Troubleshooting

### Common Issues

1. **"Clerk is not defined"**
   - Ensure `ClerkProvider` wraps your app in `layout.tsx`

2. **Environment variables not loading**
   - Restart your development server after adding `.env.local`
   - Check that variable names start with `NEXT_PUBLIC_` for client-side access

3. **Middleware not working**
   - Ensure `middleware.ts` is in the root of `src/` directory
   - Check that the matcher pattern is correct

### Debug Mode

Enable Clerk debug mode in your `.env.local`:

```env
NEXT_PUBLIC_CLERK_DEBUG=true
```

## 📚 Resources

- [Clerk Documentation](https://clerk.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Happy coding! 🎉**

For support, check the [Clerk Discord](https://discord.gg/clerk) or create an issue in this repository.
