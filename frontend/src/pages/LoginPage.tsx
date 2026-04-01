import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Button, Form, Input } from "antd";
import { login } from "../services/authService";
import { setCredentials } from "../store/authSlice";
import { RootState } from "../store";

interface FormValues { email: string; password: string; }

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (isAuthenticated) { navigate("/dashboard", { replace: true }); return null; }

  const handleSubmit = async (values: FormValues) => {
    setLoading(true); setError(null);
    try {
      const data = await login(values.email, values.password);
      dispatch(setCredentials({ user: data.user, accessToken: data.access }));
      navigate("/dashboard", { replace: true });
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      setError(status === 403 ? "Your account is inactive. Contact your administrator." : "Invalid email or password.");
    } finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      background: "var(--navy)",
      fontFamily: "var(--font)",
    }}>

      {/* Left panel — branding */}
      <div style={{
        flex: "0 0 45%",
        background: "linear-gradient(145deg, #080d1a 0%, #0d1a3a 50%, #0a1628 100%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "48px 52px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Decorative orbs */}
        <div style={{
          position: "absolute", top: -80, left: -80,
          width: 320, height: 320, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(37,99,235,0.18) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: 60, right: -60,
          width: 260, height: 260, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(14,165,233,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        {/* Logo */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 0 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "linear-gradient(135deg, var(--blue) 0%, var(--teal) 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16, fontWeight: 800, color: "#fff",
            }}>K</div>
            <span style={{ color: "#fff", fontSize: 18, fontWeight: 700, letterSpacing: "-0.3px" }}>
              Koneza Systems
            </span>
          </div>
        </div>

        {/* Center copy */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{
            display: "inline-block",
            background: "rgba(37,99,235,0.15)",
            border: "1px solid rgba(37,99,235,0.3)",
            borderRadius: 20, padding: "4px 14px",
            fontSize: 12, fontWeight: 600, color: "var(--teal)",
            letterSpacing: "0.8px", textTransform: "uppercase",
            marginBottom: 20,
          }}>
            Document Management
          </div>
          <h1 style={{
            color: "#fff", fontSize: 42, fontWeight: 800,
            lineHeight: 1.15, margin: "0 0 16px",
            letterSpacing: "-1px",
          }}>
            One platform.<br />
            <span style={{
              background: "linear-gradient(90deg, var(--blue-light), var(--teal))",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>All your docs.</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 15, lineHeight: 1.7, margin: 0, maxWidth: 340 }}>
            Manage documents, control access, and collaborate with your team in one secure place.
          </p>
        </div>

        {/* Bottom tag */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <p style={{ color: "rgba(255,255,255,0.2)", fontSize: 12, margin: 0, fontFamily: "var(--font-mono)" }}>
            © 2026 Koneza Systems · v1.0
          </p>
        </div>
      </div>

      {/* Right panel — form */}
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f8fafc",
        padding: "48px 40px",
      }}>
        <div style={{ width: "100%", maxWidth: 400 }}>

          <div style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: 26, fontWeight: 800, color: "var(--text-primary)", margin: "0 0 6px", letterSpacing: "-0.5px" }}>
              Sign in to your account
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: 14, margin: 0 }}>
              Enter your credentials to continue
            </p>
          </div>

          <Form<FormValues>
            layout="vertical"
            onFinish={handleSubmit}
            onValuesChange={() => setError(null)}
            requiredMark={false}
            size="large"
          >
            <Form.Item
              label={<span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>Email address</span>}
              name="email"
              rules={[{ required: true, message: "Email is required." }]}
              style={{ marginBottom: 16 }}
            >
              <Input
                type="email"
                placeholder="you@koneza.com"
                style={{ borderRadius: 10, height: 48, fontSize: 14 }}
              />
            </Form.Item>

            <Form.Item
              label={<span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>Password</span>}
              name="password"
              rules={[{ required: true, message: "Password is required." }]}
              style={{ marginBottom: 20 }}
            >
              <Input.Password
                placeholder="••••••••"
                style={{ borderRadius: 10, height: 48, fontSize: 14 }}
              />
            </Form.Item>

            {error && (
              <Form.Item style={{ marginBottom: 16 }}>
                <Alert
                  message={error} type="error" showIcon closable
                  onClose={() => setError(null)}
                  style={{ borderRadius: 10, fontSize: 13 }}
                />
              </Form.Item>
            )}

            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                disabled={loading}
                block
                style={{
                  height: 50, borderRadius: 10, fontSize: 15, fontWeight: 700,
                  background: "linear-gradient(135deg, var(--blue) 0%, #1d4ed8 100%)",
                  border: "none", boxShadow: "0 4px 14px rgba(37,99,235,0.35)",
                }}
              >
                Sign in
              </Button>
            </Form.Item>
          </Form>

        </div>
      </div>
    </div>
  );
}
