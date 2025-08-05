import Link from "next/link";

const navLinks = [
  { href: "/", label: "الرئيسية" },
  { href: "/episodes", label: "الحلقات" },
  { href: "/freelance", label: "المعلمين" },
  { href: "/about", label: "من نحن" },
  { href: "/contact", label: "تواصل معنا" },
];

const NavigationLinks = ({ isAuthenticated, isStudent, className = "" }) => {
  if (isAuthenticated && !isStudent) return null;

  return (
    <div className={className}>
      {navLinks.map((link) => (
        <Link
          key={link.href}
          className="text-slate-700 hover:text-islamic-blue px-5 py-3 text-sm font-semibold transition-all duration-300 rounded-xl hover:bg-blue-50/70 relative group shadow-sm hover:shadow-md"
          href={link.href}
        >
          {link.label}
          <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-islamic-blue to-blue-600 group-hover:w-8 transition-all duration-300 rounded-full"></span>
        </Link>
      ))}
    </div>
  );
};

export default NavigationLinks;
