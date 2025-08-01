using System;
using System.Runtime.InteropServices;
using System.Threading;
using System.Diagnostics;

namespace ThemeSettingsClicker
{
    class Program
    {
        // Import des fonctions Windows API pour la simulation de clic
        [DllImport("user32.dll")]
        static extern bool SetCursorPos(int x, int y);

        [DllImport("user32.dll")]
        static extern void mouse_event(uint dwFlags, uint dx, uint dy, uint dwData, UIntPtr dwExtraInfo);

        [DllImport("user32.dll")]
        static extern IntPtr FindWindow(string lpClassName, string lpWindowName);

        [DllImport("user32.dll")]
        static extern bool SetForegroundWindow(IntPtr hWnd);

        // Constantes pour les événements de souris
        private const uint MOUSEEVENTF_LEFTDOWN = 0x0002;
        private const uint MOUSEEVENTF_LEFTUP = 0x0004;
        private const uint MOUSEEVENTF_MOVE = 0x0001;

        static void Main(string[] args)
        {
            Console.WriteLine("🎨 Ouverture des paramètres de thèmes Windows...");
            
            try
            {
                // Méthode 1: Ouvrir les paramètres de thèmes
                Process.Start("ms-settings:themes");
                Console.WriteLine("✅ Paramètres de thèmes Windows ouverts!");
                
                // Attendre que la fenêtre se charge
                Thread.Sleep(3000);
                
                // Méthode 2: Simuler le clic sur "Paramètres des icônes du Bureau"
                Console.WriteLine("🖱️ Tentative de simulation du clic sur 'Paramètres des icônes du Bureau'...");
                
                // Coordonnées approximatives du bouton "Paramètres des icônes du Bureau"
                // Ces coordonnées peuvent varier selon la résolution et la taille de la fenêtre
                int x = 400;
                int y = 300;
                
                // Déplacer le curseur
                SetCursorPos(x, y);
                Thread.Sleep(500);
                
                // Simuler le clic
                mouse_event(MOUSEEVENTF_LEFTDOWN, 0, 0, 0, UIntPtr.Zero);
                Thread.Sleep(100);
                mouse_event(MOUSEEVENTF_LEFTUP, 0, 0, 0, UIntPtr.Zero);
                
                Console.WriteLine("✅ Clic simulé sur 'Paramètres des icônes du Bureau'!");
                Console.WriteLine("💡 Si le clic n'a pas fonctionné, veuillez cliquer manuellement.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Erreur: {ex.Message}");
                Console.WriteLine("💡 Veuillez ouvrir manuellement les paramètres de thèmes Windows.");
            }
            
            Console.WriteLine("Appuyez sur une touche pour fermer...");
            Console.ReadKey();
        }
    }
} 