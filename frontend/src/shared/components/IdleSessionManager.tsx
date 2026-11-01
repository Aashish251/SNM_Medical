import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { refreshToken, signOut } from "@entities/session/model/authSlice";
import { useAppDispatch, useAppSelector } from "@app/store/hooks";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@shared/components/ui/dialog";

const IDLE_LIMIT_MS = 15 * 60 * 1000;
const WARNING_MS = 60 * 1000;
const ACTIVITY_KEY = "snm-last-activity";
const EVENT_KEY = "snm-session-event";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

type SessionEvent = { type: "activity" | "token" | "logout" | "expired"; at: number; token?: string };

function isAuthenticationPage(pathname: string) {
  return /^\/(login|register|signup)(\/|$)/i.test(pathname);
}

export default function IdleSessionManager() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { isSignedIn, token } = useAppSelector((state) => state.auth);
  const [lastActivity, setLastActivity] = useState(() => {
    const saved = Number(localStorage.getItem(ACTIVITY_KEY));
    return Number.isFinite(saved) && saved > 0 ? saved : Date.now();
  });
  const [now, setNow] = useState(Date.now());
  const lastBroadcast = useRef(0);
  const lastHeartbeat = useRef(0);
  const wasSignedIn = useRef(isSignedIn);
  const expired = useRef(false);
  const enabled = isSignedIn && !isAuthenticationPage(pathname);
  const remaining = Math.max(0, IDLE_LIMIT_MS - (now - lastActivity));
  const warningOpen = enabled && remaining > 0 && remaining <= WARNING_MS;

  const publish = useCallback((event: SessionEvent) => {
    try {
      localStorage.setItem(EVENT_KEY, JSON.stringify(event));
    } catch {
      // Storage can be unavailable in private browsing; this tab still works.
    }
    if ("BroadcastChannel" in window) {
      const channel = new BroadcastChannel("snm-session");
      channel.postMessage(event);
      channel.close();
    }
  }, []);

  const setActivity = useCallback((at: number, sync = false) => {
    setLastActivity(at);
    expired.current = false;
    try { localStorage.setItem(ACTIVITY_KEY, String(at)); } catch { /* optional cross-tab storage */ }
    if (sync) publish({ type: "activity", at });
  }, [publish]);

  useEffect(() => {
    if (isSignedIn && !wasSignedIn.current) {
      setActivity(Date.now(), true);
      lastHeartbeat.current = 0;
      expired.current = false;
    }
    wasSignedIn.current = isSignedIn;
  }, [isSignedIn, setActivity]);

  useEffect(() => {
    if (!enabled) return;
    const onActivity = () => {
      const at = Date.now();
      setActivity(at);
      if (at - lastBroadcast.current >= 1000) {
        lastBroadcast.current = at;
        publish({ type: "activity", at });
      }
    };
    const activityEvents: (keyof WindowEventMap)[] = ["pointerdown", "mousemove", "keydown", "scroll", "touchstart"];
    activityEvents.forEach((event) => window.addEventListener(event, onActivity, { passive: true }));
    return () => activityEvents.forEach((event) => window.removeEventListener(event, onActivity));
  }, [enabled, publish, setActivity]);

  useEffect(() => {
    if (!enabled) return;
    const receive = (event: SessionEvent) => {
      if (event.type === "activity") setActivity(event.at);
      if (event.type === "token" && event.token) dispatch(refreshToken(event.token));
      if (event.type === "logout" || event.type === "expired") {
        dispatch(signOut());
        if (event.type === "expired") navigate("/login?reason=timeout", { replace: true });
        else navigate("/login", { replace: true });
      }
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key === ACTIVITY_KEY && event.newValue) {
        const at = Number(event.newValue);
        if (Number.isFinite(at)) setActivity(at);
      }
      if (event.key === EVENT_KEY && event.newValue) {
        try { receive(JSON.parse(event.newValue) as SessionEvent); } catch { /* ignore malformed cross-tab data */ }
      }
    };
    const channel = "BroadcastChannel" in window ? new BroadcastChannel("snm-session") : null;
    if (channel) channel.onmessage = (event: MessageEvent<SessionEvent>) => receive(event.data);
    window.addEventListener("storage", onStorage);
    return () => {
      channel?.close();
      window.removeEventListener("storage", onStorage);
    };
  }, [dispatch, enabled, navigate, setActivity]);

  useEffect(() => {
    if (!enabled) return;
    const timer = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(timer);
  }, [enabled]);

  useEffect(() => {
    if (!enabled || remaining > 0 || expired.current) return;
    expired.current = true;
    dispatch(signOut());
    publish({ type: "expired", at: Date.now() });
    navigate("/login?reason=timeout", { replace: true });
  }, [dispatch, enabled, navigate, publish, remaining]);

  useEffect(() => {
    if (!enabled || !token) return;
    const heartbeat = window.setInterval(async () => {
      const currentTime = Date.now();
      if (currentTime - lastActivity >= 4 * 60 * 1000 || currentTime - lastHeartbeat.current < 4 * 60 * 1000) return;
      lastHeartbeat.current = currentTime;
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/session/refresh`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 401) {
          dispatch(signOut());
          publish({ type: "expired", at: Date.now() });
          navigate("/login?reason=timeout", { replace: true });
          return;
        }
        const refreshedToken = response.headers.get("X-Session-Token");
        if (response.ok && refreshedToken) {
          dispatch(refreshToken(refreshedToken));
          publish({ type: "token", at: Date.now(), token: refreshedToken });
        }
      } catch {
        // Existing API requests also slide the session; a transient heartbeat failure is harmless.
      }
    }, 60 * 1000);
    return () => window.clearInterval(heartbeat);
  }, [dispatch, enabled, lastActivity, navigate, publish, token]);

  const staySignedIn = async () => {
    const at = Date.now();
    setActivity(at, true);
    if (!token) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/session/refresh`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 401) {
        dispatch(signOut());
        publish({ type: "expired", at: Date.now() });
        navigate("/login?reason=timeout", { replace: true });
        return;
      }
      const refreshedToken = response.headers.get("X-Session-Token");
      if (response.ok && refreshedToken) {
        dispatch(refreshToken(refreshedToken));
        publish({ type: "token", at: Date.now(), token: refreshedToken });
      }
    } catch {
      // Local activity timer still resets if the server is temporarily unreachable.
    }
  };

  const logOutNow = () => {
    dispatch(signOut());
    publish({ type: "logout", at: Date.now() });
    navigate("/login", { replace: true });
  };

  const totalSeconds = Math.ceil(remaining / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, "0");

  return (
    <Dialog open={warningOpen} onOpenChange={(open) => { if (!open) void staySignedIn(); }}>
      <DialogContent showCloseButton={false} className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Still there?</DialogTitle>
          <DialogDescription>
            You’ll be logged out due to inactivity in <strong className="text-foreground">{minutes}:{seconds}</strong>.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <button type="button" onClick={logOutNow} className="rounded-md border border-input px-4 py-2 text-sm font-medium hover:bg-accent">Log out now</button>
          <button type="button" onClick={() => void staySignedIn()} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">Stay signed in</button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
