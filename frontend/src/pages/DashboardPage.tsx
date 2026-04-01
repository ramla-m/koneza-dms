import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Avatar, Tag } from "antd";
import {
  DashboardOutlined, TeamOutlined, UserOutlined, LogoutOutlined,
  FileTextOutlined, ClockCircleOutlined, CheckCircleOutlined,
} from "@ant-design/icons";
import { clearCredentials } from "../store/authSlice";
import { RootState } from "../store";
import UserManagementPage from "./UserManagementPage";

type Page = "dashboard" | "users";

// ── Stat card ──────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div style={{
      background: "#fff",
      borderRadius: "var(--radius)",
      padding: "22px 24px",
      boxShadow: "var(--shadow)",
      border: "1px solid var(--border)",
      display: "flex", alignItems: "center", gap: 16,
      transition: "transform 0.15s ease, box-shadow 0.15s ease",
      cursor: "default",
    }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
        (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-md)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow)";
      }}
    >
      <div style={{
        width: 48, height: 48, borderRadius: 12,
        background: color, display: "flex", alignItems: "center",
        justifyContent: "center", fontSize: 20, flexShrink: 0,
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", lineHeight: 1.2 }}>{value}</div>
        <div style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 500, marginTop: 2 }}>{label}</div>
      </div>
    </div>
  );
}

// ── Nav item ───────────────────────────────────────────────────────────────────
function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: 10,
      width: "100%", padding: "10px 14px", borderRadius: 10,
      border: "none", cursor: "pointer", textAlign: "left",
      background: active ? "rgba(37,99,235,0.15)" : "transparent",
      color: active ? "#fff" : "rgba(255,255,255,0.5)",
      fontFamily: "var(--font)", fontSize: 14, fontWeight: active ? 600 : 400,
      transition: "all 0.15s ease",
      position: "relative",
    }}
      onMouseEnter={e => {
        if (!active) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
        if (!active) (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.8)";
      }}
      onMouseLeave={e => {
        if (!active) (e.currentTarget as HTMLElement).style.background = "transparent";
        if (!active) (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)";
      }}
    >
      {active && (
        <div style={{
          position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)",
          width: 3, height: 20, background: "var(--blue-light)",
          borderRadius: "0 3px 3px 0",
        }} />
      )}
      <span style={{ fontSize: 16, opacity: active ? 1 : 0.7 }}>{icon}</span>
      {label}
    </button>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((s: RootState) => s.auth.user);
  const isAdmin = user?.role === "ADMIN";
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");

  const handleSignOut = () => {
    dispatch(clearCredentials());
    navigate("/login", { replace: true });
  };

  const initials = user
    ? `${user.first_name[0]}${user.last_name[0]}`.toUpperCase()
    : "?";

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "var(--font)" }}>

      {/* ═══ SIDEBAR ══════════════════════════════════════════════════════════ */}
      <div style={{
        width: 240, flexShrink: 0,
        background: "linear-gradient(180deg, var(--navy) 0%, var(--navy-2) 100%)",
        display: "flex", flexDirection: "column",
        height: "100vh", position: "sticky", top: 0,
        borderRight: "1px solid var(--navy-border)",
      }}>

        {/* Logo */}
        <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid var(--navy-border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 9,
              background: "linear-gradient(135deg, var(--blue) 0%, var(--teal) 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, fontWeight: 800, color: "#fff", flexShrink: 0,
            }}>K</div>
            <div>
              <div style={{ color: "#fff", fontSize: 14, fontWeight: 700, lineHeight: 1.2 }}>Koneza DMS</div>
              <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, fontFamily: "var(--font-mono)", letterSpacing: "0.5px" }}>v1.0</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div style={{ flex: 1, padding: "16px 12px", overflowY: "auto" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.2)", letterSpacing: "1.2px", textTransform: "uppercase", padding: "0 8px", marginBottom: 8 }}>
            Navigation
          </div>
          <NavItem
            icon={<DashboardOutlined />}
            label="Dashboard"
            active={currentPage === "dashboard"}
            onClick={() => setCurrentPage("dashboard")}
          />
          {isAdmin && (
            <NavItem
              icon={<TeamOutlined />}
              label="User Management"
              active={currentPage === "users"}
              onClick={() => setCurrentPage("users")}
            />
          )}
        </div>

        {/* User + sign out */}
        <div style={{ borderTop: "1px solid var(--navy-border)", padding: "14px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10, flexShrink: 0,
              background: isAdmin
                ? "linear-gradient(135deg, var(--blue), var(--teal))"
                : "linear-gradient(135deg, #475569, #334155)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 700, color: "#fff",
            }}>
              {initials}
            </div>
            <div style={{ overflow: "hidden", flex: 1 }}>
              <div style={{
                color: "#fff", fontSize: 13, fontWeight: 600,
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              }}>
                {user?.first_name} {user?.last_name}
              </div>
              <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, marginTop: 1 }}>
                {user?.role}
              </div>
            </div>
          </div>

          <button onClick={handleSignOut} style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
            width: "100%", padding: "9px 14px", borderRadius: 9,
            border: "1px solid rgba(239,68,68,0.3)",
            background: "rgba(239,68,68,0.08)", cursor: "pointer",
            color: "#f87171", fontFamily: "var(--font)", fontSize: 13, fontWeight: 600,
            transition: "all 0.15s ease",
          }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.18)";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(239,68,68,0.5)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.08)";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(239,68,68,0.3)";
            }}
          >
            <LogoutOutlined style={{ fontSize: 14 }} />
            Sign out
          </button>
        </div>
      </div>

      {/* ═══ MAIN CONTENT ═════════════════════════════════════════════════════ */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

        {/* Top bar */}
        <div style={{
          background: "#fff", borderBottom: "1px solid var(--border)",
          padding: "0 32px", height: 60,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexShrink: 0,
        }}>
          <div>
            <span style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>
              {currentPage === "dashboard" ? "Dashboard" : "User Management"}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Tag
              color={isAdmin ? "blue" : "default"}
              style={{ fontFamily: "var(--font)", fontWeight: 600, margin: 0, borderRadius: 6 }}
            >
              {user?.role}
            </Tag>
            <Avatar
              size={32}
              icon={<UserOutlined />}
              style={{
                background: isAdmin
                  ? "linear-gradient(135deg, var(--blue), var(--teal))"
                  : "#94a3b8",
                fontSize: 13, fontWeight: 700,
              }}
            >
              {initials}
            </Avatar>
          </div>
        </div>

        {/* Page content */}
        <div style={{ flex: 1, padding: 32, overflowY: "auto" }}>

          {/* ── Dashboard view ── */}
          {currentPage === "dashboard" && (
            <div>
              {/* Welcome banner */}
              <div style={{
                background: "linear-gradient(135deg, var(--navy) 0%, #0d1e42 60%, #0a1a38 100%)",
                borderRadius: 16, padding: "28px 32px",
                marginBottom: 28, position: "relative", overflow: "hidden",
              }}>
                <div style={{
                  position: "absolute", top: -40, right: -40,
                  width: 200, height: 200, borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(37,99,235,0.2) 0%, transparent 70%)",
                  pointerEvents: "none",
                }} />
                <div style={{ position: "relative", zIndex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.4)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 8 }}>
                    Welcome back
                  </div>
                  <h2 style={{ color: "#fff", fontSize: 26, fontWeight: 800, margin: "0 0 6px", letterSpacing: "-0.5px" }}>
                    {user?.first_name} {user?.last_name} 👋
                  </h2>
                  <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, margin: 0 }}>
                    {user?.email} · Member since {user?.date_joined
                      ? new Date(user.date_joined).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })
                      : "—"}
                  </p>
                </div>
              </div>

              {/* Stats row */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 28 }}>
                <StatCard icon={<FileTextOutlined style={{ color: "#2563eb" }} />} label="Documents" value="—" color="rgba(37,99,235,0.1)" />
                <StatCard icon={<CheckCircleOutlined style={{ color: "#10b981" }} />} label="Approved" value="—" color="rgba(16,185,129,0.1)" />
                <StatCard icon={<ClockCircleOutlined style={{ color: "#f59e0b" }} />} label="Pending" value="—" color="rgba(245,158,11,0.1)" />
              </div>

              {/* Info card */}
              <div style={{
                background: "#fff", borderRadius: "var(--radius)",
                border: "1px solid var(--border)", padding: "24px 28px",
                boxShadow: "var(--shadow)",
              }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                    background: isAdmin ? "rgba(37,99,235,0.1)" : "rgba(100,116,139,0.1)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 20,
                  }}>
                    {isAdmin ? <TeamOutlined style={{ color: "var(--blue)" }} /> : <UserOutlined style={{ color: "var(--text-secondary)" }} />}
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>
                      {isAdmin ? "You have admin access" : "Staff account"}
                    </div>
                    <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                      {isAdmin
                        ? "You can manage users and control system access from the User Management section in the sidebar."
                        : "You have access to view and manage documents assigned to you. Contact your admin for additional access."}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── User Management view ── */}
          {currentPage === "users" && isAdmin && <UserManagementPage />}

        </div>
      </div>
    </div>
  );
}
