# 🏆 Bidder: An Intelligent Auction Platform
### *Where Predictive Intelligence Meets High-Velocity Bidding.*
**Official Submission for the CodeBidz Hackathon**

---

## 🛰️ The Intelligent Bidder Experience
*The core of our platform is engineered for the modern bidder—fusing real-time speed with tactical data visualization.*

* **Smart War Room:** A cinematic, glassmorphic dashboard featuring zero-latency live auction feeds.
* **Bid Strategy Intelligence (BSI):**
    * **Auction Intensity Meter:** Real-time heat mapping of bid frequency and competitor volatility.
    * **Winning Probability Engine:** An algorithmic estimate of success based on current bid density and remaining time.
* **Instant Liquidity Recovery:** Automated escrow logic that restores your credits the millisecond you are outbid.
* **Reactive Notifications:** Instant UI alerts for outbids, wins, and auction closures.

---

## 🛠️ Admin Command Center
*Total ecosystem orchestration and liquidity management.*

* **Asset Management:** Real-time creation, editing, and deployment of auction listings.
* **Credit Minting & Distribution:** Granular control over bidder balances and global credit allocation.
* **Live Oversight Hub:** A high-level monitor to observe all active bidding wars and system health.

---

## 📸 Visual Showcase

<table style="width: 100%; table-layout: fixed;">
  <tr>
    <td align="center"><b>Intelligent Bidder Panel</b></td>
    <td align="center"><b>Strategy & Intensity Meters</b></td>
  </tr>
  <tr>
    <td><img src="https://github.com/user-attachments/assets/65f28bdd-4281-4256-8f3a-c6954f32d344" width="100%" /></td>
    <td><img width="1456" height="835" alt="Screenshot 2026-03-17 at 5 55 05 AM" src="https://github.com/user-attachments/assets/c8f414d3-3167-432e-aeef-dd6787e5bdeb" /></td>
  </tr>
  <tr>
    <td align="center"><b>Admin Control Hub</b></td>
    <td align="center"><b>Live Bidding Stream</b></td>
  </tr>
  <tr>
    <td><img src="https://github.com/user-attachments/assets/003eb41e-7133-45d9-a975-aabd2e836754" width="100%" /></td>
    <td><img src="https://github.com/user-attachments/assets/97f3190b-d206-4dbb-909e-641e0ecc00ce" width="100%" /></td>
  </tr>
</table>

## 🧬 Technical Architecture

| Layer | Technology | Implementation |
| :--- | :--- | :--- |
| **Frontend** | `React.js` / `Next.js` | High-velocity SPA with Server-Side Rendering. |
| **Animations** | `Framer Motion` | Fluid, cinematic transitions and reactive UI feedback. |
| **Styling** | `Tailwind CSS` | Custom-themed Glassmorphism and Neon accents. |
| **Real-time** | `Socket.io` | Bi-directional event streaming for millisecond bid updates. |
| **Backend** | `Node.js` / `Express` | Scalable micro-architecture for complex bid processing. |
| **Database** | `MongoDB` | Non-relational schema for high-speed metadata retrieval. |

---
## 🌟 Features

### Bidder Panel
- Secure registration and login.
- Browse active auctions with live countdown timers.
- Place bids using assigned credits.
- Receive notifications when outbid or when an auction is won.
- Track credit balance and personal bidding history.

### Admin Panel
- Create and manage auction listings with title, description, image, start & end time, and minimum bid.
- Assign and manage bidding credits for registered bidders.
- Monitor live bids in real time.
- Close auctions and automatically declare winners.
- View bidding reports, auction history, and user activity insights.

### Credits System
- Admin assigns a fixed number of credits to each bidder.
- Credits are used to place bids and deducted when winning.
- Non-winning bids return credits to the bidder’s balance.

### Unique Feature: Bid Strategy Intelligence System
- **Auction Intensity Meter:** Displays real-time competitiveness of an auction.
- **Winning Probability Indicator:** Estimates the chance of winning based on current bids and timing.
- Helps bidders make informed decisions during peak activity.

---

## ⚠️ Known Limitations
- Currently supports only a fixed number of credits per bidder.
- Notifications rely on Firebase Cloud Messaging and may have slight delays.
- Real-time bidding may experience minor latency in large-scale deployments.
- No integration with real payment gateways for credits yet.

---

## 🔗 Live Deployment Link
https://bidder-eight.vercel.app/

---

<div align="center">
   Made With ❤️ By Kris
</div>
