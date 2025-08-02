import React from "react";
import { BackgroundGradient } from "./background-gradient";
import { Monitor } from "lucide-react";

export default function BackgroundGradientDemo() {
  return (
    <div>
      <BackgroundGradient className="bg-white dark:bg-zinc-900 p-4 sm:p-10 rounded-[22px] max-w-sm">
        <div className="flex justify-center items-center bg-gradient-to-br from-blue-500 to-purple-600 mb-4 rounded-lg w-full h-32">
          <Monitor size={64} className="text-white" />
        </div>
        <p className="mt-4 mb-2 text-black dark:text-neutral-200 text-base sm:text-xl">
          VestyWinBox Analytics
        </p>

        <p className="text-neutral-600 dark:text-neutral-400 text-sm">
          Système d'analyse avancé pour la surveillance des performances 
          et la gestion optimale de votre environnement Windows.
        </p>
        <button className="flex items-center space-x-1 bg-black dark:bg-zinc-800 mt-4 py-1 pr-1 pl-4 rounded-full font-bold text-white text-xs">
          <span>Voir les stats </span>
          <span className="bg-zinc-700 px-2 py-0 rounded-full text-[0.6rem] text-white">
            Live
          </span>
        </button>
      </BackgroundGradient>
    </div>
  );
} 