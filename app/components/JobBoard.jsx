import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

const CATEGORIES = ["All", "Engineering", "Design", "Marketing", "Product"];

export default function JobBoard() {
  const [jobs, setJobs] = useState([]);
  const [category, setCategory] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    company: "", title: "", type: "Full-time",
    location: "", salary: "", category: "Engineering",
  });

  // ── Загрузка вакансий из Supabase ──
  useEffect(() => {
    fetchJobs();

    // Realtime: новые вакансии появляются у всех без перезагрузки
    const channel = supabase
      .channel("jobs-channel")
      .on("postgres_changes", { event: "*", schema: "public", table: "jobs" }, () => {
        fetchJobs();
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("jobs")
      .select("*")

    if (error) {
      showToast("Ошибка загрузки вакансий");
      console.error(error);
    } else {
      setJobs(data || []);
    }
    setLoading(false);
  };

  const filtered = category === "All" ? jobs : jobs.filter(j => j.category === category);

  const setF = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  // ── Публикация вакансии в Supabase ──
  const postJob = async () => {
    if (!form.title || !form.company) return;

    const { error } = await supabase.from("jobs").insert([{
      company: form.company,
      title: form.title,
      type: form.type,
      location: form.location,
      salary: form.salary,
      category: form.category,
    }]);

    if (error) {
      showToast("Ошибка при публикации");
      console.error(error);
    } else {
      setForm({ company: "", title: "", type: "Full-time", location: "", salary: "", category: "Engineering" });
      setShowModal(false);
      showToast("Вакансия опубликована!");
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Форматирование даты
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
    if (diff < 3600) return "Только что";
    if (diff < 86400) return `${Math.floor(diff / 3600)}ч назад`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}д назад`;
    return `${Math.floor(diff / 604800)} нед. назад`;
  };

  return (
    <div>
      <div className="job-board-header">
        <div>
          <div className="page-title">Job<br /><span style={{ color: "var(--accent2)" }}>Board.</span></div>
          <p className="page-sub">{jobs.length} открытых позиций</p>
        </div>
        <button
          className="btn btn-accent"
          style={{ alignSelf: "flex-end", marginBottom: 40 }}
          onClick={() => setShowModal(true)}
        >
          + Опубликовать вакансию
        </button>
      </div>

      <div className="filters">
        {CATEGORIES.map(c => (
          <button
            key={c}
            className={`filter-chip ${category === c ? "active" : ""}`}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="empty">
          <div className="empty-icon">⏳</div>
          <div style={{ fontFamily: "Playfair Display, serif", fontSize: 18 }}>Загрузка...</div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">🔍</div>
          <div style={{ fontFamily: "Playfair Display, serif", fontSize: 18 }}>Вакансий не найдено</div>
        </div>
      ) : (
        <div className="jobs-grid">
          {filtered.map(job => (
            <div key={job.id} className="job-card">
              <div>
                <div className="job-card-company">{job.company}</div>
                <div className="job-card-title">{job.title}</div>
                <div className="job-card-tags">
                  <span className="job-tag tag-type">{job.type}</span>
                  {job.salary && <span className="job-tag tag-salary">{job.salary}</span>}
                  {job.location && <span className="job-tag tag-location">📍 {job.location}</span>}
                </div>
              </div>
              <div className="job-card-right">
                <div className="job-card-date">{formatDate(job.created_at)}</div>
                <button className="job-card-apply" onClick={() => showToast(`Отклик отправлен на ${job.title}!`)}>
                  Apply →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-title">Опубликовать вакансию</div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Компания</label>
                <input className="form-input" placeholder="Acme Inc." value={form.company} onChange={setF("company")} />
              </div>
              <div className="form-group">
                <label className="form-label">Должность</label>
                <input className="form-input" placeholder="Senior Engineer" value={form.title} onChange={setF("title")} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Тип</label>
                <select className="form-input" value={form.type} onChange={setF("type")}>
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Contract</option>
                  <option>Internship</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Категория</label>
                <select className="form-input" value={form.category} onChange={setF("category")}>
                  {CATEGORIES.filter(c => c !== "All").map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Местоположение</label>
                <input className="form-input" placeholder="Remote / Город" value={form.location} onChange={setF("location")} />
              </div>
              <div className="form-group">
                <label className="form-label">Зарплата</label>
                <input className="form-input" placeholder="$100k–$130k" value={form.salary} onChange={setF("salary")} />
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Отмена</button>
              <button className="btn btn-primary" onClick={postJob}>Опубликовать</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
