# 👨‍🍳 ChefGPT

> **Your AI-powered culinary assistant.**
> Turn your ingredients into Michelin-star recipes with the power of AI.

<img src="public/images/chef-claude-icon.png" alt="ChefGPT Logo" width="100" />

## 🚀 Overview

**ChefGPT** is a modern web application that helps users generate creative recipes based on the ingredients they have on hand. Recently migrated to **Next.js** (App Router), ChefGPT features a polished **Dark Mode**, a "Mise-en-place" dashboard, and intelligent chat capabilities that go beyond simple recipe generation.

## ✨ Key Features

- **🤖 Intelligent Recipe Generation**: Powered by OpenAI, generate detailed recipes with steps, macros, and visual descriptions.
- **💬 Culinary Chat Assistant**: Ask follow-up questions about cooking techniques, substitutions, or general food advice.
- **🌗 Dark Mode & Theming**: A premium, developer-centric UI with **Geist Mono** typography and a sleek dark theme.
- **📋 Mise-en-place Dashboard**: A split-screen interface to manage your ingredient inventory ("Kitchen") and shopping list ("To Acquire") alongside the generated recipe.
- **📱 Responsive Design**: Optimized for mobile and desktop cooking environments.

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + CSS Variables
- **AI Integration**: [OpenAI API](https://openai.com/) (GPT-5 / GPT-5.2 Turbo)
- **Font**: [Geist Mono](https://vercel.com/font)

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ installed.
- An OpenAI API Key.

### Installation

1.  **Clone the repository**

    ```bash
    git clone https://github.com/MedLines/ChefGPT
    cd chefgpt
    ```

2.  **Install dependencies**

    ```bash
    npm install
    ```

3.  **Configure Environment Variables**
    Create a `.env` file in the root directory and add your key:

    ```bash
    OPENAI_API_KEY=sk-...
    ```

4.  **Run the Development Server**

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to start cooking!
