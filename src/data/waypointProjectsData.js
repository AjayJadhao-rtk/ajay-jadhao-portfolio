/**
 * SCALABLE WAYPOINT PROJECTS DATA
 * Adding any new project here automatically:
 * 1. Re-calculates spline track distribution
 * 2. Spawns physical 3D lab station in the WebGL world
 * 3. Binds camera waypoints, HUD triggers, and telemetry
 */

export const WAYPOINT_PROJECTS = [
  {
    id: "nex-shield",
    number: "01",
    stationName: "BIO-TELEMETRY STATION",
    title: "NEX-SHIELD",
    category: "Women Safety Wearable",
    tagline: "Cellular Emergency Beacon with Biometric Distress Detection",
    color: "#E11D48", // Crimson SOS
    stationTheme: "wearable_hub",
    beaconFrequency: "1420.40 MHz",
    telemetryStatus: "SOS READY // GEOLOCATION ACTIVE",
    image: "/assets/crops/nex-shield.jpg",
    specs: [
      { label: "Processor", value: "ESP32 240MHz Dual-Core" },
      { label: "Transceiver", value: "SIM800L GSM + Neo-6M GPS" },
      { label: "Biometrics", value: "MAX30102 Heart Rate Sensor" },
      { label: "Power", value: "LiPo 3.7V / 72h Deep Sleep" },
    ],
    description:
      "A discreet wearable safety device with instant 1-touch silent emergency beacon, live SMS/cellular geolocation tracking, and biometric distress response.",
  },
  {
    id: "line-robot",
    number: "02",
    stationName: "AUTONOMOUS PROVING GROUND",
    title: "Line Following Robot",
    category: "Autonomous Ground Vehicle",
    tagline: "High-Precision PID-Controlled Track Tracing Rover",
    color: "#D97706", // Amber
    stationTheme: "robotics_depot",
    beaconFrequency: "433.92 MHz",
    telemetryStatus: "CLOSED LOOP // PID CALIBRATED",
    image: "/assets/crops/line-robot.jpg",
    specs: [
      { label: "MCU", value: "ATmega328P / Arduino Nano" },
      { label: "Optics", value: "8-Channel TCRT5000 IR Array" },
      { label: "Drive", value: "Twin 12V 600RPM Metal Gear Motors" },
      { label: "Frequency", value: "200Hz Discrete Control Loop" },
    ],
    description:
      "High-speed autonomous ground rover utilizing analog reflectance sensor fusion and closed-loop PID control algorithm for high-speed corridor tracing.",
  },
  {
    id: "saline-monitor",
    number: "03",
    stationName: "CLINICAL TELEMETRY TOWER",
    title: "Saline Monitoring System",
    category: "IoT Healthcare Telemetry",
    tagline: "Intravenous Fluid Depletion Warning & Infusion Telemetry",
    color: "#059669", // Emerald
    stationTheme: "medical_tower",
    beaconFrequency: "2.40 GHz",
    telemetryStatus: "MQTT STREAMING // BUFFER STABLE",
    image: "/assets/crops/saline-monitor.jpg",
    specs: [
      { label: "Load Sensor", value: "Strain Gauge + HX711 24-bit ADC" },
      { label: "Network", value: "ESP8266 Wi-Fi Node" },
      { label: "Protocol", value: "TLS Encrypted MQTT" },
      { label: "Alerts", value: "Audible Buzzer + Push Latency <150ms" },
    ],
    description:
      "Automated clinical telemetry apparatus monitoring remaining IV saline bottle mass, alerting nurses to avoid hazardous air embolisms in patients.",
  },
  {
    id: "gesture-car",
    number: "04",
    stationName: "HMI NEURAL BASE",
    title: "Gesture Control Car",
    category: "HMI & Wearable Robotics",
    tagline: "6-DOF IMU Glove-Controlled Omni Rover",
    color: "#B17B53", // Vintage Copper
    stationTheme: "hmi_satellite",
    beaconFrequency: "2.48 GHz",
    telemetryStatus: "RF PACKETS LOCKED // LATENCY 12ms",
    image: "/assets/crops/gesture-car.jpg",
    specs: [
      { label: "Sensory Glove", value: "MPU-6050 6-Axis Gyro/Accel" },
      { label: "Radio Link", value: "nRF24L01+ with PA/LNA" },
      { label: "Chassis", value: "4WD Skid-Steer Robotic Platform" },
      { label: "Watchdog", value: "Auto-Braking Timeout Failsafe" },
    ],
    description:
      "Intuitive tele-robotic control interface translating human hand pitch and wrist inclination into responsive skid-steering maneuvers.",
  },
  {
    id: "balancing-robot",
    number: "05",
    stationName: "EQUILIBRIUM OBSERVATORY",
    title: "Balancing Robot",
    category: "Inverted Pendulum Robotics",
    tagline: "Dynamic Equilibrium Platform with Kalman Sensor Fusion",
    color: "#2563EB", // Cobalt Blue
    stationTheme: "pendulum_spire",
    beaconFrequency: "915.00 MHz",
    telemetryStatus: "EQUILIBRIUM LOCKED // TILT 0.00°",
    image: "/assets/crops/balancing-robot.jpg",
    specs: [
      { label: "Inertial IMU", value: "MPU-6050 6-Axis DMP" },
      { label: "Motors", value: "NEMA 17 Steppers + TMC2208 Silent" },
      { label: "Filter", value: "Discrete Linear Kalman Filter" },
      { label: "Sample Rate", value: "5ms Interrupt Frequency" },
    ],
    description:
      "Inverted pendulum dynamic stabilization platform that balances on two co-axial wheels by counteracting gravitational torque via Kalman state estimation.",
  },
];
