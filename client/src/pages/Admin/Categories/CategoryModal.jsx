import { motion } from "framer-motion";
import { FiX } from "react-icons/fi";

export const CategoryModal = ({
  editing,
  form,
  error,
  onChange,
  onClose,
  onSubmit,
}) => (
  <motion.div
    className="modal-overlay"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={onClose}
  >
    <motion.form
      className="modal-content"
      initial={{ scale: 0.9, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.9, opacity: 0, y: 20 }}
      onClick={(event) => event.stopPropagation()}
      onSubmit={onSubmit}
    >
      <div className="modal-header">
        <h2>{editing ? "Update Category" : "New Category"}</h2>
        <button type="button" className="btn-close" onClick={onClose}>
          <FiX />
        </button>
      </div>
      <div className="form-group">
        <label htmlFor="cat-name">Category Name *</label>
        <input
          id="cat-name"
          placeholder="e.g., Electronics, Clothing"
          value={form.name}
          onChange={(event) => onChange("name", event.target.value)}
          required
          autoFocus
        />
      </div>
      <div className="form-group">
        <label htmlFor="cat-desc">Description</label>
        <textarea
          id="cat-desc"
          placeholder="Optional description..."
          rows={3}
          value={form.description}
          onChange={(event) => onChange("description", event.target.value)}
        />
      </div>
      {error && <p className="form-error">{error}</p>}
      <div className="modal-footer">
        <button type="button" className="btn-secondary" onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          {editing ? "Save Changes" : "Create Category"}
        </button>
      </div>
    </motion.form>
  </motion.div>
);
