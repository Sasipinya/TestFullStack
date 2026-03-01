"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

const providers = [
  {
    id: "line",
    name: "LINE",
    color: "#06C755",
    textColor: "#ffffff",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
        <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.070 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
      </svg>
    ),
  },
  {
    id: "google",
    name: "Google",
    color: "#ffffff",
    textColor: "#3c4043",
    border: "#dadce0",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
      </svg>
    ),
  },
  {
    id: "facebook",
    name: "Facebook",
    color: "#1877F2",
    textColor: "#ffffff",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    id: "twitter",
    name: "X (Twitter)",
    color: "#000000",
    textColor: "#ffffff",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
];

export default function LoginPage() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleLogin = async (providerId: string) => {
    setLoading(providerId);
    await signIn(providerId, { callbackUrl: "/" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9f9f9]">
      <div className="w-full max-w-sm mx-4">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="text-5xl font-semibold" style={{ color: "#cc3333" }}>X</span>
            <span className="text-2xl text-gray-300">/</span>
            <span className="text-5xl font-light" style={{ color: "#1a56db" }}>O</span>
          </div>
          <h1 className="text-xl font-medium tracking-wide text-gray-800">OX Arena</h1>
          <p className="text-sm text-gray-400 mt-1">Tic-Tac-Toe vs BOT</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-gray-200 rounded-lg p-8">
          <p className="text-sm text-gray-500 text-center mb-6">
            Sign in to track your score and rank on the leaderboard
          </p>

          <div className="space-y-3">
            {providers.map((provider) => (
              <button
                key={provider.id}
                onClick={() => handleLogin(provider.id)}
                disabled={loading !== null}
                className="w-full flex items-center justify-center gap-3 rounded-md py-2.5 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: provider.color,
                  color: provider.textColor,
                  border: provider.border ? `1px solid ${provider.border}` : "none",
                }}
              >
                {loading === provider.id ? (
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  provider.icon
                )}
                {loading === provider.id ? "Signing in..." : `Sign in with ${provider.name}`}
              </button>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-400 text-center mb-3">Scoring rules</p>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <div className="font-medium text-gray-700">+1 pt</div>
                <div className="text-gray-400">Win</div>
              </div>
              <div>
                <div className="font-medium text-gray-700">+2 pts</div>
                <div className="text-gray-400">3-win streak</div>
              </div>
              <div>
                <div className="font-medium text-gray-700">-1 pt</div>
                <div className="text-gray-400">Loss</div>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          Sasipinya C. — Authorization Code Flow
        </p>
      </div>
    </div>
  );
}
