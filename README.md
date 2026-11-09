# Ajay Jadhao - Engineering Portfolio & 3D Circuit Proving Ground

> **Electronics & Telecommunication Engineer**  
> Building real-world systems through Electronics, Robotics, IoT, and Embedded Technology.

---

## ⚡ Overview

A luxury, cinematic, vintage-engineering-inspired portfolio website combining an editorial hero showcase with an interactive, real-time 3D WebGL circuit world built in Three.js.

- **Editorial Hero Section:** Anime/retro-engineering aesthetic with dynamic character sequence animation, mechanical clockwork gears, satellite radar pulse, divergence meter telemetry, and interactive diagonal preview shards.
- **3D Circuit Proving Ground:** Isometric WebGL landscape featuring an autonomous exploration rover driving along an extruded circuit track with dynamic waypoint lab stations representing real hardware engineering projects.
- **Hardware Telemetry HUD:** Real-time proximity radar detection, hardware specification matrices, and full blueprint schematic modal viewers.

---

## 🛠️ Featured Engineering Projects

1. **NEX-SHIELD** — *Women Safety Wearable* (ESP32 dual-core Xtensa 240MHz, GSM/GPRS SIM800L, Neo-6M GPS, Biometric SOS beacon)
2. **Line Following Robot** — *Autonomous Ground Vehicle* (High-precision closed-loop PID 200Hz, IR sensor array, dual N20 gear motors)
3. **Saline Monitoring System** — *Smart Healthcare IoT* (NodeMCU ESP8266, HX711 load cell telemetry, automated pinch valve alert)
4. **Gesture Control Car** — *Human-Machine Interface Vehicle* (RF 433MHz telemetry, MPU6050 6-DOF IMU glove controller)
5. **Self-Balancing Robot** — *Inverted Pendulum Dynamic System* (Dual-axis complementary filter PID, high-torque planetary gear motors)
6. **Smart Energy Grid** — *Renewable Telemetry Station* (Multi-node power distribution, real-time current sensor telemetry)

---

## 🚀 Tech Stack

- **Frontend Core:** React 19, Vite
- **3D Graphics & Physics:** Three.js (WebGL), CatmullRomCurve3 procedural splines, PCF shadow mapping
- **Animation & Transitions:** GSAP (GreenSock), Tailwind CSS
- **Icons & Telemetry:** Lucide React, Web Audio API synthesis sound engine

---

## 📦 Local Development

```bash
# Install dependencies
npm install

# Start local development server (http://localhost:3000)
npm run dev

# Build production bundle
npm run build

# Preview production build
npm run preview
```

---

## 🌐 Deployment

This repository includes automated CI/CD for **GitHub Pages** via `.github/workflows/deploy.yml`. When pushed to GitHub, GitHub Actions will automatically compile the bundle and host it live.
