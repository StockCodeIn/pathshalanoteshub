"use client";

import Link from "next/link";
import { useState, memo, useTransition } from "react";
import Image from "next/image";
import styles from "@/styles/Navbar.module.css";
import { assets } from "@/assets/assets";

const Navbar = memo(function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const toggleMenu = () => {
    startTransition(() => {
      setMenuOpen(!menuOpen);
    });
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        {/* Logo & Brand */}
        <Link href="/" className={styles.brand} aria-label="Pathshala Notes Hub Home">
          <Image
            src={assets.logo}
            alt="Pathshala Notes Hub Logo"
            width={40}
            height={40}
            className={styles.logo}
          />
          <span className={styles.brandName}>Pathshala Notes Hub</span>
        </Link>

        {/* Desktop Links */}
        <div className={`${styles.navLinks} ${menuOpen ? styles.showMenu : ""}`}>
          <Link href="/" className={styles.link}>Home</Link>
          <Link href="/about" className={styles.link}>About</Link>
          <Link href="/contact" className={styles.link}>Contact</Link>
        </div>

        {/* Mobile Toggle Button */}
        <button
          className={styles.menuButton}
          onClick={toggleMenu}
          aria-label="Toggle navigation"
        >
          ☰
        </button>
      </div>
    </nav>
  );
});

export default Navbar;
