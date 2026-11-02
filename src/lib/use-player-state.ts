"use client";
import { useEffect, useState } from "react";
import { getStoredUserState, type UserState } from "./user-store";
export function usePlayerState() {
  const [state, setState] = useState<UserState | null>(null);
  useEffect(() => {
    const sync = () => setState(getStoredUserState());
    sync();
    window.addEventListener("gta6_user_state_change", sync);
    return () => window.removeEventListener("gta6_user_state_change", sync);
  }, []);
  return state;
}
