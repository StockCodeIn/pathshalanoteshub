"use client";

import Link from 'next/link';
import { memo, useState } from 'react';
import Image from 'next/image';
import styles from '@/styles/Navbar.module.css';
import { assets } from '@/assets/assets';

const Navbar = memo(function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/" className={styles.brand}>
          <Image src={assets.logo} alt="Logo" width={40} height={40} className={styles.logo} />
          PathshalaNotesHub
        </Link>
        <div className={styles.homeLink}>
          <Link href="/" className={styles.link}>
            Home
          </Link>
        </div>
        <button className={styles.menuToggle} onClick={toggleMenu}>
          ☰
        </button>
        <div className={`${styles.links} ${isMenuOpen ? styles.show : ''}`}>
          <Link href="/about" className={styles.link}>
            About
          </Link>
          <Link href="/contact" className={styles.link}>
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
});

export default Navbar;