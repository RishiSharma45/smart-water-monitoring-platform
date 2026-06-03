const getLevelClass = (level) => {
  if (level < 20) return "critical";
  if (level < 50) return "warning";
  return "healthy";
};

function TankLevelBar({ level }) {
  const normalized = Math.min(Math.max(Number(level) || 0, 0), 100);

  return (
    <div className="level-wrap" aria-label={`Water level ${normalized}%`}>
      <div className="level-track">
        <div
          className={`level-fill ${getLevelClass(normalized)}`}
          style={{ width: `${normalized}%` }}
        />
      </div>
      <span>{normalized}%</span>
    </div>
  );
}

export default TankLevelBar;
