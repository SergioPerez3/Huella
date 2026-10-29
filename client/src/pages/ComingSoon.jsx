const ComingSoon = ({ title }) => (
  <section>
    <div className="page-header">
      <h1>{title}</h1>
    </div>
    <div className="card empty-state">
      <p className="muted">Próximamente</p>
    </div>
  </section>
);

export default ComingSoon;
