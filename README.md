# 🚑 Smartwatch Emergency Health Prototyp

Ein interaktiver High-Fidelity-Prototyp für ein Smartwatch-Interface im medizinischen Notfalleinsatz. Entwickelt mit React und Tailwind CSS, um das Apple Watch "Ultra" Look & Feel zu simulieren.

## 🌟 Features

- **Pairing-Simulation:** Bluetooth-Kopplungs-Interface mit Radar-Animation.
- **Triage-Dashboard:** Echtzeit-Anzeige kritischer Vitalwerte (Herzfrequenz, SpO2, Blutdruck, Temp).
- **Interaktive Detail-Ansichten:**
  - 💓 **Live-EKG:** Canvas-basierte Simulation einer PQRST-Welle (Tachykardie).
  - 🌬️ **SpO2-Verlauf:** SVG-Graph mit Hypoxie-Warnung (animiert).
  - 🌡️ **Fieberkurve:** Geglättetes Liniendiagramm der letzten 24h.
  - 🩸 **Blutdruck-Trend:** Modernes Range-Bar-Diagramm.
- **Notfall-ID:** Schneller Zugriff auf Allergien, Medikation und Blutgruppe.
- **Mobile-First UX:** Optimierte Touch-Targets nach HCI-Richtlinien.

## 🛠 Tech Stack

- **Framework:** React (Vite)
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Grafik:** HTML5 Canvas (EKG) & SVG

## 🚀 Installation & Start

1. **Repository klonen:**
   ```bash
   git clone <DEINE-REPO-URL>
   cd smartwatch-proto
   ```

2. **Abhängigkeiten installieren:**
   ```bash
   npm install
   ```

3. **Entwicklungsserver starten:**
   ```bash
   npm run dev
   ```

