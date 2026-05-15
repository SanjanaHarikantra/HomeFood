import "../styles/Login.css";
import { useEffect, useMemo, useState } from "react";
import { sendOtp, verifyOtp, type BackendUser } from "../lib/backend";

interface LoginProps {
  onSuccess: (user: BackendUser) => void;
}

type Step = "phone" | "otp";

const DEMO_OTP = "1234";
const ENTRY_MODE_KEY = "dabba_entry_mode";
const getSelectedRole = (): "customer" | "chef" => {
  const entryMode = window.localStorage.getItem(ENTRY_MODE_KEY);
  return entryMode === "chef" ? "chef" : "customer";
};

const getNextRoute = () => {
  const entryMode = window.localStorage.getItem(ENTRY_MODE_KEY);
  if (entryMode === "homemade") return "#order-home-made-food";
  if (entryMode === "chef") return "#chef-welcome";
  return "#home";
};

const makeDemoUser = (phone: string): BackendUser => ({
  id: Number(phone.slice(-6)) || 1,
  name: getSelectedRole() === "chef" ? "Home Chef" : "Customer",
  phone,
  role: getSelectedRole(),
  chef_id: getSelectedRole() === "chef" ? (Number(phone.slice(-6)) || 1) + 1000 : null,
});

const Login = ({ onSuccess }: LoginProps) => {
  const [step, setStep] = useState<Step>("phone");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [autoRead, setAutoRead] = useState(true);
  const [resendTimer, setResendTimer] = useState(0);
  const [demoMode, setDemoMode] = useState(false);

  const maskedMobile = useMemo(() => {
    if (mobile.length < 4) return mobile;
    return `${mobile.slice(0, 2)}****${mobile.slice(-2)}`;
  }, [mobile]);

  const handleSendOtp = async () => {
    if (!/^\d{10}$/.test(mobile)) {
      setError("Please enter a 10-digit mobile number.");
      return;
    }

    if (demoMode) {
      setStep("otp");
      setResendTimer(30);
      setInfo(`Demo mode active. Use OTP: ${DEMO_OTP}`);
      setError("");
      return;
    }

    try {
      setError("");
      const response = await sendOtp(mobile);
      setStep("otp");
      setResendTimer(30);
      setInfo(`Demo OTP for local testing: ${response.otp}`);
      setDemoMode(false);
    } catch (err) {
      setDemoMode(true);
      setStep("otp");
      setResendTimer(30);
      setInfo(`Backend unavailable. Use demo OTP: ${DEMO_OTP}`);
      setError("");
    }
  };

  const handleVerifyOtp = async () => {
    if (!/^\d{4,6}$/.test(otp)) {
      setError("Please enter a 4-6 digit OTP.");
      return;
    }

    try {
      setError("");
      const user = await verifyOtp(mobile, otp, getSelectedRole());
      window.localStorage.setItem("dabba_user", JSON.stringify(user));
      onSuccess(user);
      window.location.hash = getNextRoute();
    } catch (err) {
      if (!demoMode && otp !== DEMO_OTP) {
        setDemoMode(true);
      }
      if (demoMode || otp === DEMO_OTP) {
        const user = makeDemoUser(mobile);
        window.localStorage.setItem("dabba_user", JSON.stringify(user));
        onSuccess(user);
        window.location.hash = getNextRoute();
        return;
      }
      setDemoMode(true);
      setError(err instanceof Error ? err.message : "Failed to verify OTP.");
      setInfo(`Backend unavailable. Use demo OTP: ${DEMO_OTP}`);
    }
  };

  useEffect(() => {
    if (step !== "otp" || resendTimer <= 0) return;
    const timer = window.setInterval(() => {
      setResendTimer((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [step, resendTimer]);

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    await handleSendOtp();
  };

  const startHomemadeFlow = async () => {
    window.localStorage.setItem(ENTRY_MODE_KEY, "homemade");
    await handleSendOtp();
  };

  const startDefaultFlow = async () => {
    window.localStorage.removeItem(ENTRY_MODE_KEY);
    await handleSendOtp();
  };

  const startChefFlow = async () => {
    window.localStorage.setItem(ENTRY_MODE_KEY, "chef");
    await handleSendOtp();
  };

  return (
    <section className="login">
      <div className="login__card">
        <header className="login__header">
          <p className="login__eyebrow">DabbaWala</p>
          <h2>
            {step === "phone" && "Enter your mobile number"}
            {step === "otp" && "Verify OTP"}
          </h2>
          <p className="login__sub">
            {step === "phone" && "Secure login using OTP"}
            {step === "otp" && `OTP sent to: ${maskedMobile}`}
          </p>
          {info && <p className="login__sub">{info}</p>}
        </header>

        {step === "phone" && (
          <div className="login__form">
            <label className="login__label" htmlFor="mobile">
              Mobile Number
            </label>
            <input
              id="mobile"
              type="tel"
              inputMode="numeric"
              placeholder="Example: 9876543210"
              value={mobile}
              onChange={(event) => {
                if (error) setError("");
                setMobile(event.target.value.replace(/[^\d]/g, "").slice(0, 10));
              }}
            />
            {error && <p className="login__error">{error}</p>}
            <button className="login__action" type="button" onClick={handleSendOtp}>
              Send OTP
            </button>
            <button className="login__ghost" type="button" onClick={startHomemadeFlow}>
              Continue as Order Homemade Food
            </button>
            <button className="login__ghost" type="button" onClick={startDefaultFlow}>
              Continue as Customer
            </button>
            <button className="login__ghost" type="button" onClick={startChefFlow}>
              Continue as Home Chef
            </button>
          </div>
        )}

        {step === "otp" && (
          <div className="login__form">
            <label className="login__label" htmlFor="otp">
              Enter OTP
            </label>
            <input
              id="otp"
              type="tel"
              inputMode="numeric"
              placeholder="4-6 digit OTP"
              value={otp}
              onChange={(event) => {
                if (error) setError("");
                setOtp(event.target.value.replace(/[^\d]/g, "").slice(0, 6));
              }}
            />
            <label className="login__switch">
              <input
                type="checkbox"
                checked={autoRead}
                onChange={(event) => setAutoRead(event.target.checked)}
              />
              Auto-read OTP
            </label>
            {error && <p className="login__error">{error}</p>}
            <div className="login__otp-row">
              <button
                className="login__ghost"
                type="button"
                onClick={handleResendOtp}
                disabled={resendTimer > 0}
              >
                Resend OTP {resendTimer > 0 ? `(${resendTimer}s)` : ""}
              </button>
              <span className="login__otp-hint">
                {autoRead ? "Auto-read enabled" : "Auto-read off"}
              </span>
            </div>
            <div className="login__actions">
              <button className="login__ghost" type="button" onClick={() => setStep("phone")}>
                Change number
              </button>
              <button className="login__action" type="button" onClick={handleVerifyOtp}>
                Verify OTP
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Login;
