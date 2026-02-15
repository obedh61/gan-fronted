import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Cada vez que cambia la ruta, sube arriba
    window.scrollTo({
      top: 0,
      behavior: "smooth", // puedes usar "auto" si no quieres animación
    });
  }, [pathname]);

  return null;
}
