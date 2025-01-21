import { useLocation } from "react-router-dom";

export default function useQueryURL() {
  return new URLSearchParams(useLocation().search);
}
