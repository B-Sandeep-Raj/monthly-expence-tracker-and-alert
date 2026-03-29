import React, { useState } from "react"
import "./Navbar.css"

function Navbar({ activeTab, onTabChange }) {
  const [isOpen, setIsOpen] = useState(false)

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "📊",
      description: "View Overview"
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: "📈",
      description: "Deep Insights"
    },
    {
      id: "settings",
      label: "Settings",
      icon: "⚙️",
      description: "Configure"
    }
  ]

  const handleNavClick = (tabId) => {
    onTabChange(tabId)
    setIsOpen(false)
  }

  return (
    <nav className="navbar-pro">
      <div className="navbar-container">
        {/* Logo Section */}
        <div className="navbar-logo">
          <div className="logo-icon">💰</div>
          <div className="logo-text">
            <div className="logo-title">Financial Warner</div>
            <div className="logo-subtitle">Smart Finance</div>
          </div>
        </div>

        {/* Hamburger Menu (Mobile) */}
        <button
          className={`hamburger ${isOpen ? "active" : ""}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Navigation Links */}
        <div className={`navbar-menu ${isOpen ? "active" : ""}`}>
          <div className="menu-items">
            {menuItems.map((item) => (
              <button
                key={item.id}
                className={`menu-item ${activeTab === item.id ? "active" : ""}`}
                onClick={() => handleNavClick(item.id)}
              >
                <div className="menu-item-content">
                  <span className="menu-icon">{item.icon}</span>
                  <div className="menu-text">
                    <div className="menu-label">{item.label}</div>
                    <div className="menu-description">{item.description}</div>
                  </div>
                </div>
                {activeTab === item.id && <div className="active-indicator"></div>}
              </button>
            ))}
          </div>

          {/* Bottom Stats */}
          <div className="navbar-stats">
            <div className="stat-badge">
              <span className="stat-icon">🎯</span>
              <span className="stat-text">v1.0.0</span>
            </div>
          </div>
        </div>

        {/* Right Section - Status Indicator */}
        <div className="navbar-right">
          <div className="status-indicator">
            <div className="status-dot"></div>
            <span>Live</span>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
