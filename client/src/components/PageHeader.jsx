const PageHeader = ({ icon: Icon, title, subtitle, children }) => (
  <div className="page-header">
    <div className="page-title">
      {Icon && (
        <span className="page-title-icon">
          <Icon aria-hidden="true" />
        </span>
      )}
      <div>
        <h1>{title}</h1>
        {subtitle && <p className="muted">{subtitle}</p>}
      </div>
    </div>
    {children && <div className="page-actions">{children}</div>}
  </div>
);

export default PageHeader;
