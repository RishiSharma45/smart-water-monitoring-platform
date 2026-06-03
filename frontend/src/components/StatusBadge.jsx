function StatusBadge({ level, children }) {
  return <span className={`status-badge ${level}`}>{children}</span>;
}

export default StatusBadge;
