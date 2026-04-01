import { motion } from "framer-motion";
import { TOKENS } from "../tokens";

export default function TokenModal({ close, select }) {
  return (
    <div className="modal" onClick={close}>
      <motion.div
        className="modal-box"
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <h3>Selectionner un token</h3>

        {Object.keys(TOKENS).map((t) => (
          <div key={t} className="token-item" onClick={() => select(t)}>
            <span dangerouslySetInnerHTML={{ __html: TOKENS[t].logo }} />
            <span style={{ marginLeft: "12px", fontWeight: "600" }}>{t}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
