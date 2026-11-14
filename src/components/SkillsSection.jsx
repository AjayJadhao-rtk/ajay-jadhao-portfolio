import React, { useState } from 'react';
import { ExternalLink, Sparkles, ChevronRight } from 'lucide-react';
import { audioEngine } from '../utils/audioSystem';

/**
 * Custom Technical & Vintage Icons matching the exact aesthetic
 * of "Skill section reference image.png"
 */
const TechnicalIcons = {
  // Embedded & Hardware
  Cpu: () => (
    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="9" y="9" width="6" height="6" />
      <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 15h3M1 9h3M1 15h3" />
    </svg>
  ),
  Microchip: () => (
    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6L6 18M6 6l12 12" />
      <circle cx="12" cy="12" r="9" />
    </svg>
  ),
  Circuit: () => (
    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="3" />
      <circle cx="7" cy="7" r="2" fill="currentColor" />
      <circle cx="17" cy="17" r="2" fill="currentColor" />
      <path d="M7 9v6a2 2 0 0 0 2 2h6" />
    </svg>
  ),
  Sensor: () => (
    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  ),
  DigitalGate: () => (
    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M3 12h6m6 0h6M12 3v6m0 6v6" />
    </svg>
  ),
  Multimeter: () => (
    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="3" width="14" height="18" rx="3" />
      <circle cx="12" cy="10" r="3" />
      <path d="M12 10l2-2M8 17h8" />
    </svg>
  ),
  Display: () => (
    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="13" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  ),
  GpioBus: () => (
    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="5" cy="6" r="2" />
      <circle cx="12" cy="6" r="2" />
      <circle cx="19" cy="6" r="2" />
      <circle cx="5" cy="18" r="2" />
      <circle cx="12" cy="18" r="2" />
      <circle cx="19" cy="18" r="2" />
    </svg>
  ),

  // Robotics & Wireless
  RobotArm: () => (
    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="18" r="3" />
      <path d="M8.5 16.5l6-6M14 11l4-4 2 2-4 4" />
      <path d="M18 5l2-2" />
    </svg>
  ),
  RadioTower: () => (
    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 22h16M12 2v20M8 8a6 6 0 0 1 8 0M6 12a10 10 0 0 1 12 0" />
    </svg>
  ),
  Wifi: () => (
    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01" />
    </svg>
  ),
  Bluetooth: () => (
    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6.5 6.5l11 11L12 23V1l5.5 5.5-11 11" />
    </svg>
  ),
  GpsPin: () => (
    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  ),
  Lidar: () => (
    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3a9 9 0 0 1 9 9M12 7a5 5 0 0 1 5 5M3 12a9 9 0 0 1 9-9" />
    </svg>
  ),
  MotorDriver: () => (
    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v8M8 12h8" />
    </svg>
  ),
  Gamepad: () => (
    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="20" height="12" rx="4" />
      <path d="M6 12h4M8 10v4M16 12h.01M18 10h.01" />
    </svg>
  ),

  // IoT & Embedded
  CloudNode: () => (
    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9z" />
    </svg>
  ),
  Esp32: () => (
    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M8 8h8v8H8zM12 2v2M12 20v2M2 12h2M20 12h2" />
    </svg>
  ),
  RaspberryPi: () => (
    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="9" r="2.5" />
      <circle cx="16" cy="9" r="2.5" />
      <circle cx="6" cy="15" r="2.5" />
      <circle cx="18" cy="15" r="2.5" />
      <circle cx="12" cy="13" r="2.5" />
      <circle cx="12" cy="18" r="2.5" />
      <path d="M12 3v3M10 4l2 2 2-2" />
    </svg>
  ),
  SerialBus: () => (
    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6h16M4 12h16M4 18h16" />
      <circle cx="8" cy="6" r="1" fill="currentColor" />
      <circle cx="14" cy="12" r="1" fill="currentColor" />
      <circle cx="10" cy="18" r="1" fill="currentColor" />
    </svg>
  ),

  // Software & Web
  CBadge: () => (
    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm4.5 12.8a5 5 0 0 1-4.5 2.2c-2.8 0-5-2.2-5-5s2.2-5 5-5c1.8 0 3.3.9 4.3 2.2l-1.6 1.3c-.6-.9-1.6-1.5-2.7-1.5-1.7 0-3 1.3-3 3s1.3 3 3 3c1.1 0 2.1-.6 2.7-1.5l1.8 1.3z" />
    </svg>
  ),
  CppBadge: () => (
    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm-1 12.8a4 4 0 0 1-3.5 1.7c-2.2 0-4-1.8-4-4s1.8-4 4-4c1.4 0 2.6.7 3.4 1.7l-1.3 1c-.5-.7-1.3-1.2-2.1-1.2-1.4 0-2.5 1.1-2.5 2.5s1.1 2.5 2.5 2.5c.8 0 1.6-.5 2.1-1.2l1.4 1zm5-2.8h-1.5v1.5h-1V12H12v-1h1.5V9.5h1V11h1.5v1zm4 0h-1.5v1.5h-1V12H16v-1h1.5V9.5h1V11h1.5v1z" />
    </svg>
  ),
  Html5: () => (
    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
      <path d="M4 2l1.6 18 6.4 2 6.4-2L20 2H4zm13.1 5.3l-.2 2.3H9.8l.2 2.5h6.6l-.6 6.3-4 1.2-4-1.2-.3-3.3h2.3l.1 1.7 1.9.5 1.9-.5.2-2.3H7.5L7 5.3h10.1z" />
    </svg>
  ),
  Css3: () => (
    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
      <path d="M4 2l1.6 18 6.4 2 6.4-2L20 2H4zm12.9 6.8l-.3 3.3-4.6 1.4v2.4l3.1-.9.2-2H13V11h4.6l.4-4.5H7.3l.2 2.3h7.4z" />
    </svg>
  ),
  JavaScript: () => (
    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
      <rect x="2" y="2" width="20" height="20" rx="3" fill="#0E1F21" />
      <text x="7" y="16.5" fill="#E9DDC7" fontSize="10" fontWeight="bold" fontFamily="sans-serif">JS</text>
    </svg>
  ),
  ReactAtom: () => (
    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(0 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
    </svg>
  ),
  GitHub: () => (
    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  ),

  // UI/UX & Design
  FigmaLogo: () => (
    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 2h4v5H8a2.5 2.5 0 0 1 0-5zM12 2h4a2.5 2.5 0 0 1 0 5h-4V2zM8 7h4v5H8a2.5 2.5 0 0 1 0-5zM12 7h4a2.5 2.5 0 0 1 0 5h-4V7zM8 12h4v5a2.5 2.5 0 0 1-2.5 2.5A2.5 2.5 0 0 1 7 17a2.5 2.5 0 0 1 1-5z" />
    </svg>
  ),
  DesignCompass: () => (
    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  ),
  Wireframe: () => (
    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M9 21V9" />
    </svg>
  ),
  PenTool: () => (
    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 19l7-7 3 3-7 7-3-3z" />
      <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
      <circle cx="11" cy="11" r="2" />
    </svg>
  ),
  Layers: () => (
    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  ),
  Presentation: () => (
    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  ),
  FilmReel: () => (
    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="3" />
      <circle cx="12" cy="6" r="1" fill="currentColor" />
      <circle cx="12" cy="18" r="1" fill="currentColor" />
      <circle cx="6" cy="12" r="1" fill="currentColor" />
      <circle cx="18" cy="12" r="1" fill="currentColor" />
    </svg>
  ),

  // 3D & CAD
  Box3D: () => (
    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  ),
  CadTool: () => (
    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="9" y1="21" x2="9" y2="9" />
      <circle cx="15" cy="15" r="2" />
    </svg>
  ),
};

export default function SkillsSection({ onOpen3DWorld }) {
  const [hoveredSkill, setHoveredSkill] = useState(null);

  const FIGMA_PROJECT_URL = "https://www.figma.com/design/998ew7eGo5JNZVyIvjnCHG/Untitled?node-id=0-1&t=0B5KIEru0l8EEztt-1";

  // Data structure for the 6 modular cards exactly as in reference image
  const skillCategories = [
    {
      id: "01",
      number: "01 —",
      title: "EMBEDDED SYSTEMS & ELECTRONICS",
      artSrc: "/assets/Skill section/art_1_pcb.png",
      column1: [
        { name: "Embedded C/C++ Programming", icon: TechnicalIcons.Cpu },
        { name: "Microcontroller Programming", icon: TechnicalIcons.Microchip },
        { name: "Digital Electronics", icon: TechnicalIcons.DigitalGate },
        { name: "Circuit Prototyping", icon: TechnicalIcons.Circuit },
        { name: "Sensor Interfacing", icon: TechnicalIcons.Sensor },
      ],
      column2: [
        { name: "Hardware–Software Integration", icon: TechnicalIcons.Cpu },
        { name: "GPIO and Peripheral Interfacing", icon: TechnicalIcons.GpioBus },
        { name: "OLED and LCD Interfacing", icon: TechnicalIcons.Display },
        { name: "Electronics Troubleshooting", icon: TechnicalIcons.Multimeter },
      ]
    },
    {
      id: "02",
      number: "02 —",
      title: "ROBOTICS & WIRELESS COMMUNICATION",
      artSrc: "/assets/Skill section/art_2_rover.png",
      column1: [
        { name: "Robotics Development", icon: TechnicalIcons.RobotArm },
        { name: "Mobile Robot Prototyping", icon: TechnicalIcons.RadioTower },
        { name: "Line-Following Robot Development", icon: TechnicalIcons.Circuit },
        { name: "RC Robot Development", icon: TechnicalIcons.Gamepad },
        { name: "Motor Driver Interfacing", icon: TechnicalIcons.MotorDriver },
      ],
      column2: [
        { name: "Wireless Robot Control", icon: TechnicalIcons.Wifi },
        { name: "LoRa Communication", icon: TechnicalIcons.RadioTower },
        { name: "Bluetooth Communication", icon: TechnicalIcons.Bluetooth },
        { name: "GPS Module Integration (experimentation)", icon: TechnicalIcons.GpsPin },
        { name: "LiDAR Integration (experimentation)", icon: TechnicalIcons.Lidar },
      ]
    },
    {
      id: "03",
      number: "03 —",
      title: "IOT & HARDWARE INTEGRATION",
      artSrc: "/assets/Skill section/art_3_iot.png",
      column1: [
        { name: "IoT Prototyping", icon: TechnicalIcons.CloudNode },
        { name: "Sensor-Based Monitoring Systems", icon: TechnicalIcons.Sensor },
        { name: "Wireless Sensor Integration", icon: TechnicalIcons.Wifi },
        { name: "ESP32-Based Development", icon: TechnicalIcons.Esp32 },
      ],
      column2: [
        { name: "ESP8266-Based Development", icon: TechnicalIcons.Esp32 },
        { name: "Raspberry Pi Integration", icon: TechnicalIcons.RaspberryPi },
        { name: "Hardware Component Integration", icon: TechnicalIcons.Circuit },
        { name: "Embedded Device Communication", icon: TechnicalIcons.SerialBus },
      ]
    },
    {
      id: "04",
      number: "04 —",
      title: "SOFTWARE & WEB DEVELOPMENT",
      artSrc: "/assets/Skill section/art_4_terminal.png",
      column1: [
        { name: "C Programming", icon: TechnicalIcons.CBadge },
        { name: "C++ Programming", icon: TechnicalIcons.CppBadge },
        { name: "HTML", icon: TechnicalIcons.Html5 },
        { name: "CSS", icon: TechnicalIcons.Css3 },
      ],
      column2: [
        { name: "JavaScript", icon: TechnicalIcons.JavaScript },
        { name: "Interactive Web Development", icon: TechnicalIcons.ReactAtom },
        { name: "Git & GitHub", icon: TechnicalIcons.GitHub },
      ]
    },
    {
      id: "05",
      number: "05 —",
      title: "UI/UX & GRAPHIC DESIGN",
      artSrc: "/assets/Skill section/art_5_uiux.png",
      column1: [
        { name: "UI/UX Design", icon: TechnicalIcons.DesignCompass },
        { name: "Interface Design", icon: TechnicalIcons.Wireframe },
        { 
          name: "Figma Design", 
          icon: TechnicalIcons.FigmaLogo, 
          isFigma: true,
          link: FIGMA_PROJECT_URL 
        },
        { name: "Wireframing", icon: TechnicalIcons.Wireframe },
        { name: "Visual Prototyping", icon: TechnicalIcons.DesignCompass },
      ],
      column2: [
        { name: "Graphic Design", icon: TechnicalIcons.PenTool },
        { name: "Poster Design", icon: TechnicalIcons.Layers },
        { name: "Presentation Design", icon: TechnicalIcons.Presentation },
        { name: "Social Media Design", icon: TechnicalIcons.Layers },
        { name: "Visual Storytelling", icon: TechnicalIcons.FilmReel },
      ]
    },
    {
      id: "06",
      number: "06 —",
      title: "3D DESIGN & VISUALIZATION",
      artSrc: "/assets/Skill section/art_6_gear.png",
      column1: [
        { name: "3D Modeling (Blender)", icon: TechnicalIcons.Box3D },
        { name: "Mechanical CAD Modeling (Fusion 360)", icon: TechnicalIcons.CadTool },
        { name: "SVG Asset Integration", icon: TechnicalIcons.Layers },
      ],
      column2: []
    }
  ];

  const handleSkillHover = (name) => {
    setHoveredSkill(name);
    audioEngine.playHover();
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between py-1 sm:py-2 select-none">
      
      {/* ========================================================================= */}
      {/* SKILLS SECTION HEADER AREA                                                */}
      {/* Leaves left open for character framing, aligns with reference image        */}
      {/* ========================================================================= */}
      <div className="w-full flex items-start justify-between relative pl-0 lg:pl-16 xl:pl-28 pr-2 sm:pr-6">
        
        {/* Left Heading & Metadata */}
        <div className="flex flex-col items-start space-y-0.5 sm:space-y-1">
          {/* Eyebrow / Technical Identifier */}
          <div className="flex items-center space-x-2 text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-[#1E3A32] font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#27433B] inline-block animate-pulse" />
            <span>03 / TECHNICAL ARSENAL</span>
          </div>

          {/* Large Serif Title */}
          <h2 className="font-serif italic font-bold text-2xl sm:text-3xl md:text-4xl lg:text-[40px] text-[#0E1F21] tracking-tight leading-none">
            Skills &amp; Expertise
          </h2>

          {/* Subtitle / Philosophy */}
          <p className="text-[11px] sm:text-xs md:text-[13px] font-sans text-[#292B27]/85 max-w-xl font-normal leading-relaxed">
            Bridging hardware, software and creative engineering to build intelligent experiences.
          </p>
        </div>

        {/* Right Blueprint Technical Illustration & Identifier */}
        <div className="hidden md:flex items-center space-x-3 pointer-events-none select-none opacity-85">
          <div className="flex flex-col items-end text-[10px] font-mono tracking-wider text-[#1E3A32]/80 uppercase leading-tight">
            <span className="font-bold">ENGINEERING / 03</span>
            <span className="text-[9px] text-[#5A6966]">A BRIGHTER TOMORROW</span>
          </div>
          <div className="w-16 h-12 lg:w-20 lg:h-14 overflow-hidden relative">
            <img 
              src="/assets/Skill section/clean_header_gear.png" 
              alt="Blueprint Gear"
              className="w-full h-full object-contain object-right"
            />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 6 MODULAR CATEGORY CARDS (2-Column Grid matching Reference Image)        */}
      {/* ========================================================================= */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-2.5 sm:gap-3 xl:gap-3.5 pl-0 lg:pl-16 xl:pl-28 pr-1 sm:pr-4 my-1 sm:my-2 overflow-y-auto max-h-[calc(100vh-165px)] lg:max-h-none scrollbar-thin">
        {skillCategories.map((cat) => (
          <div
            key={cat.id}
            className="group relative flex items-stretch justify-between bg-[#F8F3EA]/95 hover:bg-[#FAF6EF] border border-[#2C3835]/30 rounded-[3px] shadow-[0_2px_8px_rgba(41,43,39,0.06)] hover:shadow-[0_4px_14px_rgba(41,43,39,0.12)] transition-all duration-300 overflow-hidden"
          >
            {/* Left Content Area */}
            <div className="flex-1 flex flex-col justify-between p-2.5 sm:p-3 pr-2 z-10">
              
              {/* Category Header Row: Tag Badge + Title */}
              <div className="flex items-center space-x-2 border-b border-[#2C3835]/15 pb-1 mb-1.5">
                {/* Vintage Green Ribbon Tag */}
                <div className="bg-[#1E3A32] text-[#F4ECE1] px-2 py-0.5 rounded-[2px] font-serif text-[11px] sm:text-xs font-bold tracking-wider select-none shadow-sm">
                  {cat.number}
                </div>
                {/* Category Title */}
                <div className="flex items-center space-x-1">
                  <h3 className="font-serif font-bold text-[11px] sm:text-[12px] md:text-[13px] tracking-wide text-[#0E1F21] uppercase">
                    {cat.title}
                  </h3>
                  <ChevronRight className="w-3.5 h-3.5 text-[#1E3A32]/60 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>

              {/* Skills 2-Column List with Interactive Hovers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2.5 sm:gap-x-4 gap-y-0.5 sm:gap-y-1 text-[#1A2A2D]">
                
                {/* Sub-column 1 */}
                <div className="space-y-0.5 sm:space-y-1">
                  {cat.column1.map((item, idx) => {
                    const IconComponent = item.icon;
                    const isFigmaItem = item.isFigma;

                    if (isFigmaItem) {
                      return (
                        <a
                          key={idx}
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          onMouseEnter={() => handleSkillHover(item.name)}
                          className="relative flex items-center justify-between px-1.5 py-0.5 rounded bg-[#1E3A32]/10 hover:bg-[#1E3A32] text-[#0E1F21] hover:text-[#F4ECE1] border border-[#1E3A32]/30 hover:border-[#1E3A32] transition-all duration-200 cursor-pointer shadow-sm group/figma"
                          title="Open live Figma design system file of this portfolio"
                        >
                          <div className="flex items-center space-x-1.5">
                            <span className="text-[#8B5CF6] group-hover/figma:text-[#A78BFA] transition-colors">
                              <IconComponent />
                            </span>
                            <span className="font-sans font-semibold text-[10px] sm:text-[11px] tracking-tight">
                              {item.name}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1 bg-[#1E3A32] group-hover/figma:bg-[#27433B] text-[#F4ECE1] px-1 py-0.2 rounded text-[8px] font-mono tracking-wider uppercase font-bold animate-pulse">
                            <span>LIVE</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </div>
                        </a>
                      );
                    }

                    return (
                      <div
                        key={idx}
                        onMouseEnter={() => handleSkillHover(item.name)}
                        className="flex items-center space-x-1.5 px-1 py-0.5 rounded hover:bg-[#0E1F21]/[0.06] transition-all duration-150 cursor-default group/item"
                      >
                        <span className="text-[#1E3A32] group-hover/item:text-[#6A8E8B] group-hover/item:scale-110 transition-all duration-150">
                          <IconComponent />
                        </span>
                        <span className="font-sans text-[10px] sm:text-[11px] text-[#292B27] group-hover/item:text-[#0E1F21] group-hover/item:translate-x-0.5 transition-all duration-150 font-normal leading-tight">
                          {item.name}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Sub-column 2 */}
                <div className="space-y-0.5 sm:space-y-1">
                  {cat.column2.map((item, idx) => {
                    const IconComponent = item.icon;
                    return (
                      <div
                        key={idx}
                        onMouseEnter={() => handleSkillHover(item.name)}
                        className="flex items-center space-x-1.5 px-1 py-0.5 rounded hover:bg-[#0E1F21]/[0.06] transition-all duration-150 cursor-default group/item"
                      >
                        <span className="text-[#1E3A32] group-hover/item:text-[#6A8E8B] group-hover/item:scale-110 transition-all duration-150">
                          <IconComponent />
                        </span>
                        <span className="font-sans text-[10px] sm:text-[11px] text-[#292B27] group-hover/item:text-[#0E1F21] group-hover/item:translate-x-0.5 transition-all duration-150 font-normal leading-tight">
                          {item.name}
                        </span>
                      </div>
                    );
                  })}
                </div>

              </div>
            </div>

            {/* Right Chevron Cut Artwork Panel (Matches the exact angled cut in reference image) */}
            <div
              className="relative flex-shrink-0 w-24 sm:w-28 md:w-32 lg:w-36 h-auto self-stretch overflow-hidden bg-[#24332D]"
              style={{
                clipPath: 'polygon(18px 0%, 100% 0%, 100% 100%, 18px 100%, 0% 50%)'
              }}
            >
              <img
                src={cat.artSrc}
                alt={cat.title}
                className="w-full h-full object-cover object-center filter grayscale-[20%] contrast-[110%] group-hover:scale-105 group-hover:filter-none transition-all duration-500"
              />
              {/* Subtle vintage vignette gradient on the artwork */}
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[#1E3A32]/40 pointer-events-none" />
            </div>

          </div>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* BOTTOM QUOTATION / TAGLINE                                               */}
      {/* "SMALL SYSTEMS. BIGGER POSSIBILITIES." from Reference Image               */}
      {/* ========================================================================= */}
      <div className="w-full flex items-center justify-between pl-0 lg:pl-16 xl:pl-28 pr-2 sm:pr-6 pt-1 border-t border-[#2C3835]/20 mt-1">
        <div className="flex items-center space-x-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1E3A32]" />
          <p className="font-mono text-[9px] sm:text-[10px] tracking-[0.2em] uppercase font-bold text-[#1E3A32]">
            &ldquo;SMALL SYSTEMS. BIGGER POSSIBILITIES.&rdquo;
          </p>
        </div>

        <div className="hidden sm:flex items-center space-x-2 text-[9px] font-mono text-[#5A6966]">
          <span>VERIFIED ENGINEERING EXPERTISE</span>
          <span className="text-[#1E3A32]">&bull;</span>
          <span>EST. 2026</span>
        </div>
      </div>

    </div>
  );
}
