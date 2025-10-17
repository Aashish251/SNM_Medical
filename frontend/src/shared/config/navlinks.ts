import { NavLink } from "@shared/types/NavLinksType";

const reportsNav: NavLink = {
    href: "/reports",
    text: "Reports",
    children: [
        { href: "/reports/daily", text: "Daily Report" },
        { href: "/reports/registration", text: "Registration Report" },
        { href: "/reports/master", text: "Master Report" },
    ],
};

export const navLinksByPage: Record<string, NavLink[]> = {
    "/": [
        { href: "/", text: "Home" },
        { href: "/contact", text: "Contact" },
        // { href: "/about", text: "About" },
        { href: "/login", text: "Login" },
        
    ],
    "/about": [
        { href: "/", text: "Home" },
        { href: "/update-profile", text: "Update Profile" },
        { href: "/master-search", text: "Master Search" },
        { href: "/duty-chart", text: "Duty Chart" },
        reportsNav, // dropdown here
        { href: "/login", text: "Login" },
    ],
    "/contact": [
        { href: "/", text: "Home" },
        { href: "/update-profile", text: "Update Profile" },
        { href: "/master-search", text: "Master Search" },
        { href: "/duty-chart", text: "Duty Chart" },
        reportsNav, // dropdown here
        // { href: "/about", text: "About Us" },
        { href: "/contact", text: "Contact Us" },
        { href: "/login", text: "Login" },
    ],
    "/duty-chart": [
        { href: "/", text: "Home" },
        { href: "/update-profile", text: "Update Profile" },
        { href: "/master-search", text: "Master Search" },
        { href: "/duty-chart", text: "Duty Chart" },
        reportsNav,
        { href: "/login", text: "Login" },
    ],
    "/login": [
        { href: "/", text: "Home" },
        { href: "/gallery", text: "Gallery" },
        { href: "/login", text: "Login" },
    ],
    "/register": [
        { href: "/", text: "Home" },
        { href: "/login", text: "Login" },
    ],
};
