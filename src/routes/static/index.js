import { handleFavicon } from "../../handlers/faviconHandler.js";
import {
  handleFaviconSvg,
  handleFaviconIco,
  handleAppleTouchIcon,
} from "../../handlers/projectFaviconHandler.js";

export const staticRoutes = [
  {
    method: "GET",
    path: "/favicon.svg",
    handler: handleFaviconSvg,
    description: "Favicon SVG",
  },
  {
    method: "GET",
    path: "/favicon.ico",
    handler: handleFaviconIco,
    description: "Favicon ICO",
  },
  {
    method: "GET",
    path: "/apple-touch-icon.png",
    handler: handleAppleTouchIcon,
    description: "Apple Icon",
  },
  {
    method: "GET",
    path: "/favicon",
    handler: handleFavicon,
    description: "网站图标",
  },
];
