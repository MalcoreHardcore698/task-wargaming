import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { ERoutePath } from "@/app/routes/types";
import { Placeholder, Button, fadeIn } from "@/shared/ui";
import PageHeader from "@/features/page-header";
import PageLayout from "@/features/page-layout";

import styles from "./styles.module.scss";

function ShopPage() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(ERoutePath.SKIN_SELECTION);
  };

  return (
    <PageLayout>
      <PageHeader
        title="Shop"
        description="Shop for skins and other items."
        keywords="shop, skins, items"
      />

      <motion.div {...fadeIn()} className={styles.container}>
        <Placeholder
          icon={<span />}
          action={
            <motion.div {...fadeIn()}>
              <Button onClick={handleBack}>Choose Your Skin</Button>
            </motion.div>
          }
          variant="empty"
          title="Shop"
          description="Coming soon"
        />
      </motion.div>
    </PageLayout>
  );
}

export default ShopPage;
