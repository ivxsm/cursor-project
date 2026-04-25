import { AnimatePresence, motion } from "framer-motion";

type FeedbackBubbleProps = {
  message: string;
};

export function FeedbackBubble({ message }: FeedbackBubbleProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={message}
        className="feedback-bubble"
        initial={{ opacity: 0, y: 12, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8 }}
      >
        {message}
      </motion.div>
    </AnimatePresence>
  );
}
