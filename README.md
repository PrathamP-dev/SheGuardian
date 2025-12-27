# SheGuardian – Women’s Safety Application

**SheGuardian** is a cross-platform women’s safety application designed for **Android and iOS**, providing rapid emergency assistance through real-time alerts, live location tracking, and automated escalation mechanisms. The system prioritizes reliability, low-latency communication, and accessibility, even in low-connectivity environments.

The project focuses on reducing emergency response time by combining GPS-based geo-indexing, community-driven volunteer response, and direct integration with emergency services.

---

## 📌 Patent Information

**Patent Published**  
**Title:** *Safety Alert System for Women (SheGuardian)*  
**Patent Application Number:** **202511096159**  
**Authority:** Controller General of Patents, Designs & Trade Marks (CGPDTM), India  

The patented system introduces a scalable architecture for real-time emergency detection, geo-indexed alert dissemination, and multi-channel notification to ensure delivery reliability during critical situations.

---

## 🔍 Core Capabilities

- One-tap SOS alert triggering with automated escalation
- Real-time GPS-based live location tracking
- Geo-indexed alert routing using **Haversine Distance** and **Geohash**
- Dual notification delivery via **Firebase Cloud Messaging (FCM)** and **SMS**
- Community-driven volunteer response model
- Direct integration with emergency helplines and law enforcement
- Historical safety data aggregation for analysis and policy planning

---

## 🧠 System Design Overview

- **Location Processing:** Continuous GPS tracking with geo-indexed radius matching
- **Alert Distribution:** Priority-based alert propagation to nearby responders
- **Reliability Layer:** Redundant notification channels (FCM + SMS)
- **Scalability:** Designed to support high-concurrency alert scenarios
- **Fault Tolerance:** Alert delivery maintained during partial network failures

---

## 🛠️ Technology Stack

- **Platforms:** Android, iOS (cross-platform architecture)
- **Backend Services:** Cloud-based APIs
- **Notifications:** Firebase Cloud Messaging (FCM), SMS Gateway
- **Geospatial Processing:** Haversine Formula, Geohash Encoding
- **Data Storage:** Cloud-hosted database solutions

---

## 📈 Impact

- Enables faster emergency response through automated alerting
- Reduces dependency on manual intervention during critical incidents
- Provides a scalable framework adaptable to urban and rural environments
- Designed for real-world deployment under variable network conditions

---

## 👨‍💻 Author

**Pratham P. Sharma**  
Software Engineer | Cloud & Systems Enthusiast  

---

## 📄 License

This project is licensed under the **MIT License**.  
See the `LICENSE` file for details.
