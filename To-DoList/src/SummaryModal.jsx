const SummaryModal = ({ type, todos, pendingCount, completedCount, onClose }) => {
  if (!type) return null;

  const data = {
    total: {
      title: "Total Tasks",
      count: todos.length,
      icon: "T",
      text: "This section shows all the tasks you have created in your Todo application.",
      color: "#2563eb",
      bg: "#eff6ff"
    },
    pending: {
      title: "Pending Tasks",
      count: pendingCount,
      icon: "P",
      text: "These tasks are still pending. Complete them when your work is finished.",
      color: "#ea580c",
      bg: "#fff7ed"
    },
    completed: {
      title: "Completed Tasks",
      count: completedCount,
      icon: "C",
      text: "These tasks have been completed successfully. Great work!",
      color: "#16a34a",
      bg: "#f0fdf4"
    }
  }[type];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        background: "rgba(15, 23, 42, 0.65)"
      }}
      onClick={onClose}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "430px",
          padding: "32px",
          background: "#ffffff",
          borderRadius: "24px",
          boxShadow: "0 25px 70px rgba(0,0,0,0.25)",
          textAlign: "center",
          boxSizing: "border-box"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          style={{
            position: "absolute",
            top: "14px",
            right: "14px",
            border: "1px solid #e2e8f0",
            background: "#f8fafc",
            color: "#475569",
            borderRadius: "8px",
            padding: "7px 10px",
            cursor: "pointer",
            fontWeight: "600"
          }}
        >
          Close
        </button>

        <div
          style={{
            width: "64px",
            height: "64px",
            margin: "0 auto 18px",
            borderRadius: "18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: data.bg,
            color: data.color,
            fontSize: "24px",
            fontWeight: "800"
          }}
        >
          {data.icon}
        </div>

        <h2
          style={{
            margin: "0",
            color: "#0f172a",
            fontSize: "24px"
          }}
        >
          {data.title}
        </h2>

        <div
          style={{
            margin: "18px 0",
            color: data.color,
            fontSize: "48px",
            fontWeight: "800"
          }}
        >
          {data.count}
        </div>

        <p
          style={{
            margin: "0 auto 24px",
            maxWidth: "330px",
            color: "#64748b",
            fontSize: "14px",
            lineHeight: "1.7"
          }}
        >
          {data.text}
        </p>

        <button
          type="button"
          onClick={onClose}
          style={{
            width: "100%",
            padding: "13px",
            border: "none",
            borderRadius: "12px",
            background: "#0f172a",
            color: "#ffffff",
            fontWeight: "700",
            cursor: "pointer"
          }}
        >
          Got it
        </button>
      </div>
    </div>
  );
};

export default SummaryModal;
