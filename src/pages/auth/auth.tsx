import { useState } from "react";
import { motion } from "framer-motion";

import { PageSEO, Button, appearDown } from "@/shared/ui";
import { useAuth } from "@/services/auth";

import styles from "./styles.module.scss";

function AuthPage() {
  const [name, setName] = useState("");
  const { play, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    await play(trimmed);
  };

  return (
    <div className={styles.root}>
      <PageSEO.Helmet
        type="website"
        title="Play"
        description="Enter your player name and start playing."
        keywords="play, player, name, start"
        noIndex={true}
      />

      <motion.div
        {...appearDown({ distance: 25 })}
        className={styles.container}
      >
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            value={name}
            placeholder="Type name"
            maxLength={20}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
            autoComplete="off"
            autoFocus
            required
          />
          <Button type="submit" disabled={isLoading || !name.trim()}>
            PLAY
          </Button>
        </form>
      </motion.div>
    </div>
  );
}

export default AuthPage;
